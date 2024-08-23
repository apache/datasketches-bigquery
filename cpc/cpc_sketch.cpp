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

#include "../base64.hpp"

const emscripten::val Uint8Array = emscripten::val::global("Uint8Array");

EMSCRIPTEN_BINDINGS(cpc_sketch) {

  emscripten::function("getExceptionMessage", emscripten::optional_override([](intptr_t ptr) {
    return std::string(reinterpret_cast<std::exception*>(ptr)->what());
  }));

  emscripten::class_<datasketches::cpc_sketch>("cpc_sketch")
    .constructor(emscripten::optional_override([](uint8_t lg_k, uint64_t seed) {
      return new datasketches::cpc_sketch(lg_k, seed);
    }))
    .function("updateString", emscripten::select_overload<void(const std::string&)>(&datasketches::cpc_sketch::update))
    .function("serializeAsUint8Array", emscripten::optional_override([](const datasketches::cpc_sketch& self) {
      auto bytes = self.serialize();
      return Uint8Array.new_(emscripten::typed_memory_view(bytes.size(), bytes.data()));
    }))
    .class_function("deserializeFromB64", emscripten::optional_override([](const std::string& b64, uint64_t seed) {
      std::vector<char> bytes(b64_dec_len(b64.data(), b64.size()));
      b64_decode(b64.data(), b64.size(), bytes.data());
      return new datasketches::cpc_sketch(datasketches::cpc_sketch::deserialize(bytes.data(), bytes.size(), seed));
    }), emscripten::allow_raw_pointers())
    .class_function("deserializeFromBytes", emscripten::optional_override([](const std::string& bytes, uint64_t seed) {
      return new datasketches::cpc_sketch(datasketches::cpc_sketch::deserialize(bytes.data(), bytes.size(), seed));
    }), emscripten::allow_raw_pointers())
    .function("getEstimate", &datasketches::cpc_sketch::get_estimate)
    .function("getLowerBound", &datasketches::cpc_sketch::get_lower_bound)
    .function("getUpperBound", &datasketches::cpc_sketch::get_upper_bound)
    .function("toString", &datasketches::cpc_sketch::to_string)
    .class_function("getMaxSerializedSizeBytes", &datasketches::cpc_sketch::get_max_serialized_size_bytes)
    ;

  emscripten::class_<datasketches::cpc_union>("cpc_union")
    .constructor(emscripten::optional_override([](uint8_t lg_k, uint64_t seed) {
      return new datasketches::cpc_union(lg_k, seed);
    }))
    .function("updateWithSketch", emscripten::optional_override([](datasketches::cpc_union& self, const datasketches::cpc_sketch& sketch) {
      self.update(sketch);
    }), emscripten::allow_raw_pointers())
    .function("updateWithBytes", emscripten::optional_override([](datasketches::cpc_union& self, const std::string& bytes, uint64_t seed) {
      self.update(datasketches::cpc_sketch::deserialize(bytes.data(), bytes.size(), seed));
    }), emscripten::allow_raw_pointers())
    .function("updateWithB64", emscripten::optional_override([](datasketches::cpc_union& self, const std::string& b64, uint64_t seed) {
      std::vector<char> bytes(b64_dec_len(b64.data(), b64.size()));
      b64_decode(b64.data(), b64.size(), bytes.data());
      self.update(datasketches::cpc_sketch::deserialize(bytes.data(), bytes.size(), seed));
    }), emscripten::allow_raw_pointers())
    .function("updateWithBuffer", emscripten::optional_override([](datasketches::cpc_union& self, intptr_t bytes, size_t size, uint64_t seed) {
      self.update(datasketches::cpc_sketch::deserialize(reinterpret_cast<void*>(bytes), size, seed));
    }))
//    .function("getResultStream", emscripten::optional_override([](datasketches::cpc_union& self, intptr_t bytes, size_t size) {
//      std::strstream stream(reinterpret_cast<char*>(bytes), size);
//      self.get_result().serialize(stream);
//      return (int) stream.tellp();
//    }))
    .function("getResultAsUint8Array", emscripten::optional_override([](datasketches::cpc_union& self) {
      auto bytes = self.get_result().serialize();
      return Uint8Array.new_(emscripten::typed_memory_view(bytes.size(), bytes.data()));
    }))
    .function("getResultB64", emscripten::optional_override([](datasketches::cpc_union& self) {
      auto bytes = self.get_result().serialize();
      std::vector<char> b64(b64_enc_len(bytes.size()));
      b64_encode((const char*) bytes.data(), bytes.size(), b64.data());
      return std::string(b64.data(), b64.size());
    }))
    ;

}
