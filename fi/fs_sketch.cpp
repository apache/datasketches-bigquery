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

#include <frequent_items_sketch.hpp>

using frequent_strings_sketch = datasketches::frequent_items_sketch<std::string>;

const emscripten::val Uint8Array = emscripten::val::global("Uint8Array");

EMSCRIPTEN_BINDINGS(frequent_strings_sketch) {
  emscripten::function("getExceptionMessage", emscripten::optional_override([](intptr_t ptr) {
    return std::string(reinterpret_cast<std::exception*>(ptr)->what());
  }));

  emscripten::class_<frequent_strings_sketch>("frequent_strings_sketch")
    .constructor(emscripten::optional_override([](uint8_t lg_max_map_size) {
      return new frequent_strings_sketch(lg_max_map_size);
    }))
    .function("isEmpty", &frequent_strings_sketch::is_empty)
    .function("update", emscripten::optional_override([](frequent_strings_sketch& self, const std::string& str, uint64_t weight) {
      self.update(str, weight);
    }))
    .function("merge", emscripten::optional_override([](frequent_strings_sketch& self, const std::string& bytes) {
      self.merge(frequent_strings_sketch::deserialize(bytes.data(), bytes.size()));
    }))
    .function("serializeAsUint8Array", emscripten::optional_override([](const frequent_strings_sketch& self) {
      auto bytes = self.serialize();
      return Uint8Array.new_(emscripten::typed_memory_view(bytes.size(), bytes.data()));
    }))
    .class_function("deserialize", emscripten::optional_override([](const std::string& bytes) {
      return new frequent_strings_sketch(frequent_strings_sketch::deserialize(bytes.data(), bytes.size()));
    }), emscripten::allow_raw_pointers())
    .class_function("toString", emscripten::optional_override([](const std::string& bytes) {
      return frequent_strings_sketch::deserialize(bytes.data(), bytes.size()).to_string();
    }))
    .class_function("getResult", emscripten::optional_override([](const std::string& bytes, const std::string& err_type_str, uint64_t threshold) {
      datasketches::frequent_items_error_type err_type;
      if (err_type_str == "NO_FALSE_NEGATIVES") {
        err_type = datasketches::NO_FALSE_NEGATIVES;
      } else if (err_type_str == "NO_FALSE_POSITIVES") {
        err_type = datasketches::NO_FALSE_POSITIVES;
      } else {
        throw std::invalid_argument("unrecognized error type " + err_type_str);
      }
      const auto sketch = frequent_strings_sketch::deserialize(bytes.data(), bytes.size());
      const auto rows = threshold > 0 ? sketch.get_frequent_items(err_type, threshold) : sketch.get_frequent_items(err_type);
      emscripten::val result(emscripten::val::array());
      for (const auto& row: rows) {
        emscripten::val r(emscripten::val::object());
        r.set("item", row.get_item());
        r.set("estimate", row.get_estimate());
        r.set("lower_bound", row.get_lower_bound());
        r.set("upper_bound", row.get_upper_bound());
        result.call<void>("push", r);
      }
      return result;
    }))
    ;
}
