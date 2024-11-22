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

#include <emscripten/bind.h>

#include <req_sketch.hpp>

using req_sketch_float = datasketches::req_sketch<float>;

const emscripten::val Uint8Array = emscripten::val::global("Uint8Array");

EMSCRIPTEN_BINDINGS(req_sketch_float) {
  emscripten::function("getExceptionMessage", emscripten::optional_override([](intptr_t ptr) {
    return std::string(reinterpret_cast<std::exception*>(ptr)->what());
  }));

  emscripten::register_vector<float>("VectorFloat");

  emscripten::constant("DEFAULT_K", 12);

  emscripten::class_<req_sketch_float>("req_sketch_float")
    .constructor(emscripten::optional_override([](uint16_t k, bool hra) {
      return new req_sketch_float(k, hra);
    }))
    .function("isEmpty", &req_sketch_float::is_empty)
    .function("update", emscripten::optional_override([](req_sketch_float& self, float value) {
      self.update(value);
    }))
    .function("merge", emscripten::optional_override([](req_sketch_float& self, const std::string& bytes) {
      self.merge(req_sketch_float::deserialize(bytes.data(), bytes.size()));
    }))
    .function("serializeAsUint8Array", emscripten::optional_override([](const req_sketch_float& self) {
      auto bytes = self.serialize();
      return Uint8Array.new_(emscripten::typed_memory_view(bytes.size(), bytes.data()));
    }))
    .class_function("deserialize", emscripten::optional_override([](const std::string& bytes) {
      return new req_sketch_float(req_sketch_float::deserialize(bytes.data(), bytes.size()));
    }), emscripten::allow_raw_pointers())
    .function("getN", &req_sketch_float::get_n)
    .function("getNumRetained", &req_sketch_float::get_num_retained)
    .function("getMinValue", &req_sketch_float::get_min_item)
    .function("getMaxValue", &req_sketch_float::get_max_item)
    .function("getRank", &req_sketch_float::get_rank)
    .function("getQuantile", &req_sketch_float::get_quantile)
    .function("getPMF", emscripten::optional_override([](const req_sketch_float& self, const std::vector<float>& split_points, bool inclusive) {
      const auto pmf = self.get_PMF(split_points.data(), split_points.size(), inclusive);
      return emscripten::val::array(pmf.begin(), pmf.end());
    }))
    .function("getCDF", emscripten::optional_override([](const req_sketch_float& self, const std::vector<float>& split_points, bool inclusive) {
      const auto cdf = self.get_CDF(split_points.data(), split_points.size(), inclusive);
      return emscripten::val::array(cdf.begin(), cdf.end());
    }))
    .function("toString", emscripten::optional_override([](const req_sketch_float& self) {
      return self.to_string();
    }))
    .function("getRankLowerBound", emscripten::optional_override([](const req_sketch_float& self, double rank, uint8_t num_std_dev) {
      return self.get_rank_lower_bound(rank, num_std_dev);
    }))
    .function("getRankUpperBound", emscripten::optional_override([](const req_sketch_float& self, double rank, uint8_t num_std_dev) {
      return self.get_rank_upper_bound(rank, num_std_dev);
    }))
    ;
}
