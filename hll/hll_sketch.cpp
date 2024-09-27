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

#include <hll.hpp>

datasketches::target_hll_type convert_tgt_type(const std::string& tgt_type_str) {
  if (tgt_type_str == "" || tgt_type_str == "HLL_4") return datasketches::HLL_4;
  if (tgt_type_str == "HLL_6") return datasketches::HLL_6;
  if (tgt_type_str == "HLL_8") return datasketches::HLL_8;
  throw std::invalid_argument("unrecognized HLL target type " + tgt_type_str);
}

const emscripten::val Uint8Array = emscripten::val::global("Uint8Array");

EMSCRIPTEN_BINDINGS(hll_sketch) {
  emscripten::register_vector<double>("VectorDouble");

  emscripten::function("getExceptionMessage", emscripten::optional_override([](intptr_t ptr) {
    return std::string(reinterpret_cast<std::exception*>(ptr)->what());
  }));

  emscripten::class_<datasketches::hll_sketch>("hll_sketch")
    .constructor(emscripten::optional_override([](uint8_t lg_k, const std::string& tgt_type_str) {
      return new datasketches::hll_sketch(lg_k, convert_tgt_type(tgt_type_str));
    }))
    .function("updateString", emscripten::select_overload<void(const std::string&)>(&datasketches::hll_sketch::update))
    .function("serializeAsUint8Array", emscripten::optional_override([](const datasketches::hll_sketch& self) {
      auto bytes = self.serialize_compact();
      return Uint8Array.new_(emscripten::typed_memory_view(bytes.size(), bytes.data()));
    }))
    .class_function("getEstimate", emscripten::optional_override([](const std::string& bytes) {
      return datasketches::hll_sketch::deserialize(bytes.data(), bytes.size()).get_estimate();
    }))
    .class_function("getEstimateAndBounds", emscripten::optional_override([](const std::string& bytes, uint8_t num_std_devs) {
      const auto sketch = datasketches::hll_sketch::deserialize(bytes.data(), bytes.size());
      return std::vector<double>{sketch.get_estimate(), sketch.get_lower_bound(num_std_devs), sketch.get_upper_bound(num_std_devs)};
    }))
    .class_function("toString", emscripten::optional_override([](const std::string& bytes) {
      return datasketches::hll_sketch::deserialize(bytes.data(), bytes.size()).to_string();
    }))
    ;

  emscripten::class_<datasketches::hll_union>("hll_union")
    .constructor(emscripten::optional_override([](uint8_t lg_k) {
      return new datasketches::hll_union(lg_k);
    }))
    .function("updateWithSketch", emscripten::optional_override([](datasketches::hll_union& self, const datasketches::hll_sketch& sketch) {
      self.update(sketch);
    }))
    .function("updateWithBytes", emscripten::optional_override([](datasketches::hll_union& self, const std::string& bytes) {
      self.update(datasketches::hll_sketch::deserialize(bytes.data(), bytes.size()));
    }))
    .function("getResultAsUint8Array", emscripten::optional_override([](datasketches::hll_union& self, const std::string& tgt_type_str) {
      auto bytes = self.get_result(convert_tgt_type(tgt_type_str)).serialize_compact();
      return Uint8Array.new_(emscripten::typed_memory_view(bytes.size(), bytes.data()));
    }))
    ;

  emscripten::function("hllUnion", emscripten::optional_override([](
    const std::string& bytes1, const std::string& bytes2, uint8_t lg_k, const std::string& tgt_type_str
  ) {
    datasketches::hll_union u(lg_k);
    u.update(datasketches::hll_sketch::deserialize(bytes1.data(), bytes1.size()));
    u.update(datasketches::hll_sketch::deserialize(bytes2.data(), bytes2.size()));
    const auto bytes = u.get_result(convert_tgt_type(tgt_type_str)).serialize_compact();
    return Uint8Array.new_(emscripten::typed_memory_view(bytes.size(), bytes.data()));
  }));
}
