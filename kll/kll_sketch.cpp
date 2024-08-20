/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

#include <strstream>
#include <emscripten/bind.h>

#include <kll_sketch.hpp>
#include <kolmogorov_smirnov.hpp>

#include "base64.hpp"

using kll_sketch_float = datasketches::kll_sketch<float>;

const emscripten::val Uint8Array = emscripten::val::global("Uint8Array");

EMSCRIPTEN_BINDINGS(kll_sketch_float) {
  emscripten::function("getExceptionMessage", emscripten::optional_override([](intptr_t ptr) {
    return std::string(reinterpret_cast<std::exception*>(ptr)->what());
  }));

  emscripten::register_vector<float>("VectorFloat");
  emscripten::register_vector<double>("VectorDouble");

  emscripten::class_<kll_sketch_float>("kll_sketch_float")
    .constructor(emscripten::optional_override([](uint16_t k) {
      return new kll_sketch_float(k);
    }))
    .function("isEmpty", &kll_sketch_float::is_empty)
    .function("update", emscripten::optional_override([](kll_sketch_float& self, float value) {
      self.update(value);
    }))
    .function("mergeBytes", emscripten::optional_override([](kll_sketch_float& self, const std::string& bytes) {
      self.merge(kll_sketch_float::deserialize(bytes.data(), bytes.size()));
    }), emscripten::allow_raw_pointers())
    .function("mergeBuffer", emscripten::optional_override([](kll_sketch_float& self, intptr_t bytes, size_t size) {
      self.merge(kll_sketch_float::deserialize(reinterpret_cast<void*>(bytes), size));
    }))
    .function("serializeAsUint8Array", emscripten::optional_override([](const kll_sketch_float& self) {
      auto bytes = self.serialize();
      return Uint8Array.new_(emscripten::typed_memory_view(bytes.size(), bytes.data()));
    }))
    .class_function("deserializeFromB64", emscripten::optional_override([](const std::string& b64) {
      std::vector<char> bytes(b64_dec_len(b64.data(), b64.size()));
      b64_decode(b64.data(), b64.size(), bytes.data());
      return new kll_sketch_float(kll_sketch_float::deserialize(bytes.data(), bytes.size()));
    }), emscripten::allow_raw_pointers())
    .function("getN", &kll_sketch_float::get_n)
    .function("getRank", &kll_sketch_float::get_rank)
    .function("getQuantile", &kll_sketch_float::get_quantile)
    .function("getPMF", emscripten::optional_override([](const kll_sketch_float& self, const std::vector<float>& split_points, bool inclusive) {
      return self.get_PMF(split_points.data(), split_points.size(), inclusive);
    }))
    .function("getCDF", emscripten::optional_override([](const kll_sketch_float& self, const std::vector<float>& split_points, bool inclusive) {
      return self.get_CDF(split_points.data(), split_points.size(), inclusive);
    }))
    .function("toString", emscripten::optional_override([](const kll_sketch_float& self) {
      return std::string(self.to_string());
    }))
    ;

  emscripten::function("kolmogorovSmirnovTest", emscripten::optional_override([](const std::string& sketch1_b64, const std::string& sketch2_b64, double pvalue) {
    std::vector<char> bytes1(b64_dec_len(sketch1_b64.data(), sketch1_b64.size()));
    b64_decode(sketch1_b64.data(), sketch1_b64.size(), bytes1.data());
    std::vector<char> bytes2(b64_dec_len(sketch2_b64.data(), sketch2_b64.size()));
    b64_decode(sketch2_b64.data(), sketch2_b64.size(), bytes2.data());
    return datasketches::kolmogorov_smirnov::test(
      kll_sketch_float::deserialize(bytes1.data(), bytes1.size()),
      kll_sketch_float::deserialize(bytes2.data(), bytes2.size()),
      pvalue
    );
  }));
}
