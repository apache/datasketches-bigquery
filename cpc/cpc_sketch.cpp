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

#include <cpc_sketch.hpp>
#include <cpc_union.hpp>

const emscripten::val Uint8Array = emscripten::val::global("Uint8Array");

EMSCRIPTEN_BINDINGS(cpc_sketch) {
  emscripten::register_vector<double>("VectorDouble");

  emscripten::function("getExceptionMessage", emscripten::optional_override([](intptr_t ptr) {
    return std::string(reinterpret_cast<std::exception*>(ptr)->what());
  }));

  emscripten::constant("DEFAULT_LG_K", datasketches::cpc_constants::DEFAULT_LG_K);
  emscripten::constant("DEFAULT_SEED", datasketches::DEFAULT_SEED);

  emscripten::class_<datasketches::cpc_sketch>("cpc_sketch")
    .constructor(emscripten::optional_override([](uint8_t lg_k, uint64_t seed) {
      return new datasketches::cpc_sketch(lg_k, seed);
    }))
    .function("updateString", emscripten::select_overload<void(const std::string&)>(&datasketches::cpc_sketch::update))
    .function("serializeAsUint8Array", emscripten::optional_override([](const datasketches::cpc_sketch& self) {
      auto bytes = self.serialize();
      return Uint8Array.new_(emscripten::typed_memory_view(bytes.size(), bytes.data()));
    }))
    .class_function("getEstimate", emscripten::optional_override([](const std::string& sketch_bytes, uint64_t seed) {
      return datasketches::cpc_sketch::deserialize(sketch_bytes.data(), sketch_bytes.size(), seed).get_estimate();
    }))
    .class_function("getEstimateAndBounds", emscripten::optional_override([](const std::string& sketch_bytes, uint8_t num_std_devs, uint64_t seed) {
      const auto sketch = datasketches::cpc_sketch::deserialize(sketch_bytes.data(), sketch_bytes.size(), seed);
      return std::vector<double>{sketch.get_estimate(), sketch.get_lower_bound(num_std_devs), sketch.get_upper_bound(num_std_devs)};
    }))
    .class_function("toString", emscripten::optional_override([](const std::string& sketch_bytes, uint64_t seed) {
      return datasketches::cpc_sketch::deserialize(sketch_bytes.data(), sketch_bytes.size(), seed).to_string();
    }))
    ;

  emscripten::class_<datasketches::cpc_union>("cpc_union")
    .constructor(emscripten::optional_override([](uint8_t lg_k, uint64_t seed) {
      return new datasketches::cpc_union(lg_k, seed);
    }))
    .function("updateWithSketch", emscripten::optional_override([](datasketches::cpc_union& self, const datasketches::cpc_sketch& sketch) {
      self.update(sketch);
    }))
    .function("updateWithBytes", emscripten::optional_override([](datasketches::cpc_union& self, const std::string& bytes, uint64_t seed) {
      self.update(datasketches::cpc_sketch::deserialize(bytes.data(), bytes.size(), seed));
    }))
    .function("getResultAsUint8Array", emscripten::optional_override([](datasketches::cpc_union& self) {
      auto bytes = self.get_result().serialize();
      return Uint8Array.new_(emscripten::typed_memory_view(bytes.size(), bytes.data()));
    }))
    ;

  emscripten::function("cpcUnion", emscripten::optional_override([](const std::string& bytes1, const std::string& bytes2, uint8_t lg_k, uint64_t seed) {
    datasketches::cpc_union u(lg_k, seed);
    u.update(datasketches::cpc_sketch::deserialize(bytes1.data(), bytes1.size(), seed));
    u.update(datasketches::cpc_sketch::deserialize(bytes2.data(), bytes2.size(), seed));
    const auto bytes = u.get_result().serialize();
    return Uint8Array.new_(emscripten::typed_memory_view(bytes.size(), bytes.data()));
  }));
}
