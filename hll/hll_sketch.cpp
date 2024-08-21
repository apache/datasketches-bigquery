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

#include "base64.hpp"

const emscripten::val Uint8Array = emscripten::val::global("Uint8Array");

EMSCRIPTEN_BINDINGS(hll_sketch) {

  emscripten::function("getExceptionMessage", emscripten::optional_override([](intptr_t ptr) {
    return std::string(reinterpret_cast<std::exception*>(ptr)->what());
  }));

  emscripten::enum_<datasketches::target_hll_type>("TargetHllType")
    .value("HLL_4", datasketches::HLL_4)
    .value("HLL_6", datasketches::HLL_6)
    .value("HLL_8", datasketches::HLL_8)
    ;

  emscripten::class_<datasketches::hll_sketch>("hll_sketch")
    .constructor(emscripten::optional_override([](uint8_t lg_k, datasketches::target_hll_type tgt_type) {
      return new datasketches::hll_sketch(lg_k, tgt_type);
    }))
    .function("updateString", emscripten::select_overload<void(const std::string&)>(&datasketches::hll_sketch::update))
    .function("serializeAsUint8Array", emscripten::optional_override([](const datasketches::hll_sketch& self) {
      auto bytes = self.serialize_compact();
      return Uint8Array.new_(emscripten::typed_memory_view(bytes.size(), bytes.data()));
    }))
    .class_function("deserializeFromB64", emscripten::optional_override([](const std::string& b64) {
      std::vector<char> bytes(b64_dec_len(b64.data(), b64.size()));
      b64_decode(b64.data(), b64.size(), bytes.data());
      return new datasketches::hll_sketch(datasketches::hll_sketch::deserialize(bytes.data(), bytes.size()));
    }), emscripten::allow_raw_pointers())
    .class_function("deserializeFromBytes", emscripten::optional_override([](const std::string& bytes) {
      return new datasketches::hll_sketch(datasketches::hll_sketch::deserialize(bytes.data(), bytes.size()));
    }), emscripten::allow_raw_pointers())
    .function("getEstimate", &datasketches::hll_sketch::get_estimate)
    .function("getLowerBound", &datasketches::hll_sketch::get_lower_bound)
    .function("getUpperBound", &datasketches::hll_sketch::get_upper_bound)
    .function("toString", emscripten::optional_override([](const datasketches::hll_sketch& self) {
      return self.to_string();
    }))
    .class_function("getMaxSerializedSizeBytes", &datasketches::hll_sketch::get_max_updatable_serialization_bytes)
    ;

  emscripten::class_<datasketches::hll_union>("hll_union")
    .constructor(emscripten::optional_override([](uint8_t lg_k) {
      return new datasketches::hll_union(lg_k);
    }))
    .function("updateWithSketch", emscripten::optional_override([](datasketches::hll_union& self, const datasketches::hll_sketch& sketch) {
      self.update(sketch);
    }), emscripten::allow_raw_pointers())
    .function("updateWithBytes", emscripten::optional_override([](datasketches::hll_union& self, const std::string& bytes) {
      self.update(datasketches::hll_sketch::deserialize(bytes.data(), bytes.size()));
    }), emscripten::allow_raw_pointers())
    .function("updateWithB64", emscripten::optional_override([](datasketches::hll_union& self, const std::string& b64) {
      std::vector<char> bytes(b64_dec_len(b64.data(), b64.size()));
      b64_decode(b64.data(), b64.size(), bytes.data());
      self.update(datasketches::hll_sketch::deserialize(bytes.data(), bytes.size()));
    }), emscripten::allow_raw_pointers())
    .function("updateWithBuffer", emscripten::optional_override([](datasketches::hll_union& self, intptr_t bytes, size_t size) {
      self.update(datasketches::hll_sketch::deserialize(reinterpret_cast<void*>(bytes), size));
    }))
    .function("getResultStream", emscripten::optional_override([](datasketches::hll_union& self, intptr_t bytes, size_t size, datasketches::target_hll_type tgt_type) {
      std::strstream stream(reinterpret_cast<char*>(bytes), size);
      self.get_result(tgt_type).serialize_compact(stream);
      return (int) stream.tellp();
    }))
    .function("getResultAsUint8Array", emscripten::optional_override([](datasketches::hll_union& self, datasketches::target_hll_type tgt_type) {
      auto bytes = self.get_result(tgt_type).serialize_compact();
      return Uint8Array.new_(emscripten::typed_memory_view(bytes.size(), bytes.data()));
    }))
    .function("getResultB64", emscripten::optional_override([](datasketches::hll_union& self, datasketches::target_hll_type tgt_type) {
      auto bytes = self.get_result(tgt_type).serialize_compact();
      std::vector<char> b64(b64_enc_len(bytes.size()));
      b64_encode((const char*) bytes.data(), bytes.size(), b64.data());
      return std::string(b64.data(), b64.size());
    }))
    ;

}
