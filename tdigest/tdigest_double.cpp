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

#include <tdigest.hpp>

using tdigest_double = datasketches::tdigest_double;

const emscripten::val Uint8Array = emscripten::val::global("Uint8Array");

EMSCRIPTEN_BINDINGS(tdigest_double) {
  emscripten::function("getExceptionMessage", emscripten::optional_override([](intptr_t ptr) {
    return std::string(reinterpret_cast<std::exception*>(ptr)->what());
  }));

  emscripten::constant("DEFAULT_K", tdigest_double::DEFAULT_K);

  emscripten::class_<tdigest_double>("tdigest_double")
    .constructor(emscripten::optional_override([](uint16_t k) {
      return new tdigest_double(k);
    }))
    .function("isEmpty", &tdigest_double::is_empty)
    .function("update", &tdigest_double::update)
    .function("merge", emscripten::optional_override([](tdigest_double& self, const std::string& bytes) {
      auto td = tdigest_double::deserialize(bytes.data(), bytes.size());
      self.merge(td);
    }))
    .function("serializeAsUint8Array", emscripten::optional_override([](const tdigest_double& self) {
      const auto bytes = self.serialize();
      return Uint8Array.new_(emscripten::typed_memory_view(bytes.size(), bytes.data()));
    }))
    .class_function("deserialize", emscripten::optional_override([](const std::string& bytes) {
      return new tdigest_double(tdigest_double::deserialize(bytes.data(), bytes.size()));
    }), emscripten::allow_raw_pointers())
    .function("getTotalWeight", &tdigest_double::get_total_weight)
    .function("getMinValue", &tdigest_double::get_min_value)
    .function("getMaxValue", &tdigest_double::get_max_value)
    .function("getRank", &tdigest_double::get_rank)
    .function("getQuantile", &tdigest_double::get_quantile)
    .function("toString", emscripten::optional_override([](const tdigest_double& self) {
      return self.to_string();
    }))
    ;
}
