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

#include <theta_sketch.hpp>
#include <theta_union.hpp>
#include <theta_intersection.hpp>
#include <theta_a_not_b.hpp>

#include "base64.hpp"

using datasketches::update_theta_sketch;
using datasketches::compact_theta_sketch;
using datasketches::wrapped_compact_theta_sketch;
using datasketches::theta_union;
using datasketches::theta_intersection;
using datasketches::theta_a_not_b;

const emscripten::val Uint8Array = emscripten::val::global("Uint8Array");

EMSCRIPTEN_BINDINGS(theta_sketch) {
  emscripten::register_vector<uint8_t>("VectorBytes");

  emscripten::function("getExceptionMessage", emscripten::optional_override([](intptr_t ptr) {
    return std::string(reinterpret_cast<std::exception*>(ptr)->what());
  }));
  using vector_bytes = compact_theta_sketch::vector_bytes;

  emscripten::class_<update_theta_sketch>("update_theta_sketch")
    .constructor(emscripten::optional_override([](uint8_t lg_k) {
      return new update_theta_sketch(update_theta_sketch::builder().set_lg_k(lg_k).build());
    }))
    .constructor(emscripten::optional_override([](uint8_t lg_k, uint64_t seed) {
      return new update_theta_sketch(update_theta_sketch::builder().set_lg_k(lg_k).set_seed(seed).build());
    }))
    .function("updateString", emscripten::select_overload<void(const std::string&)>(&update_theta_sketch::update))
    .function("serialize", emscripten::optional_override([](update_theta_sketch& self) {
      return self.compact().serialize_compressed();
    }))
    .function("serializeB64", emscripten::optional_override([](const update_theta_sketch& self) {
      auto bytes = self.compact().serialize();
      std::vector<char> b64(b64_enc_len(bytes.size()));
      b64_encode((const char*) bytes.data(), bytes.size(), b64.data());
      return std::string(b64.data(), b64.size());
    }))
    .function("serializeB64Compressed", emscripten::optional_override([](const update_theta_sketch& self) {
      auto bytes = self.compact().serialize_compressed();
      std::vector<char> b64(b64_enc_len(bytes.size()));
      b64_encode((const char*) bytes.data(), bytes.size(), b64.data());
      return std::string(b64.data(), b64.size());
    }))
    .function("serializeAsUint8Array", emscripten::optional_override([](const update_theta_sketch& self) {
      auto bytes = self.compact().serialize();
      return Uint8Array.new_(emscripten::typed_memory_view(bytes.size(), bytes.data()));
    }))
    .function("serializeAsUint8ArrayCompressed", emscripten::optional_override([](const update_theta_sketch& self) {
      auto bytes = self.compact().serialize_compressed();
      return Uint8Array.new_(emscripten::typed_memory_view(bytes.size(), bytes.data()));
    }))
    ;

  emscripten::class_<compact_theta_sketch>("compact_theta_sketch")
    .constructor(emscripten::optional_override([](intptr_t bytes, size_t size, uint64_t seed) {
      return new compact_theta_sketch(compact_theta_sketch::deserialize(reinterpret_cast<void*>(bytes), size, seed));
    }))
    .constructor(emscripten::optional_override([](compact_theta_sketch::vector_bytes& bytes, uint64_t seed) {
      return new compact_theta_sketch(compact_theta_sketch::deserialize(bytes.data(), bytes.size(), seed));
    }))
    .class_function("deserializeFromB64", emscripten::optional_override([](const std::string& b64, uint64_t seed) {
      std::vector<char> bytes(b64_dec_len(b64.data(), b64.size()));
      b64_decode(b64.data(), b64.size(), bytes.data());
      return new compact_theta_sketch(compact_theta_sketch::deserialize(bytes.data(), bytes.size(), seed));
    }), emscripten::allow_raw_pointers())
    .class_function("deserializeFromBinary", emscripten::optional_override([](const std::string& bytes, uint64_t seed) {
      return new compact_theta_sketch(compact_theta_sketch::deserialize(bytes.data(), bytes.size(), seed));
    }), emscripten::allow_raw_pointers())
    .class_function("deserializeFromVectorBytes", emscripten::optional_override([](const vector_bytes& bytes, uint64_t seed) {
      return new compact_theta_sketch(compact_theta_sketch::deserialize(bytes.data(), bytes.size(), seed));
    }), emscripten::allow_raw_pointers())
    .function("getEstimate", emscripten::optional_override([](const compact_theta_sketch& self) {
      return self.get_estimate();
    }))
    .function("getLowerBound", emscripten::optional_override([](const compact_theta_sketch& self, uint8_t num_std_devs) {
      return self.get_lower_bound(num_std_devs);
    }))
    .function("getUpperBound", emscripten::optional_override([](const compact_theta_sketch& self, uint8_t num_std_devs) {
      return self.get_upper_bound(num_std_devs);
    }))
    .function("toString", emscripten::optional_override([](const compact_theta_sketch& self) {
      return std::string(self.to_string());
    }))
    .function("serialize", emscripten::optional_override([](const compact_theta_sketch& self) {
      return self.serialize_compressed();
    }))
    .class_function("getMaxSerializedSizeBytes", &compact_theta_sketch::get_max_serialized_size_bytes)
    ;

  emscripten::class_<wrapped_compact_theta_sketch>("wrapped_compact_theta_sketch")
    .constructor(emscripten::optional_override([](intptr_t bytes, size_t size) {
      return new wrapped_compact_theta_sketch(wrapped_compact_theta_sketch::wrap(reinterpret_cast<void*>(bytes), size));
    }))
    .function("getEstimate", emscripten::optional_override([](wrapped_compact_theta_sketch& self) {
      return self.get_estimate();
    }))
    .function("toString", emscripten::optional_override([](wrapped_compact_theta_sketch& self) {
      return std::string(self.to_string());
    }))
    ;

  emscripten::class_<theta_union>("theta_union")
    .constructor(emscripten::optional_override([]() {
      return new theta_union(theta_union::builder().build());
    }))
    .constructor(emscripten::optional_override([](uint8_t lg_k) {
      return new theta_union(theta_union::builder().set_lg_k(lg_k).build());
    }))
    .constructor(emscripten::optional_override([](uint8_t lg_k, uint64_t seed) {
      return new theta_union(theta_union::builder().set_lg_k(lg_k).set_seed(seed).build());
    }))
    .function("updateWithUpdateSketch", emscripten::optional_override([](theta_union& self, const update_theta_sketch& sketch) {
      self.update(sketch);
    }), emscripten::allow_raw_pointers())
    .function("updateWithCompactSketch", emscripten::optional_override([](theta_union& self, const compact_theta_sketch& sketch) {
      self.update(sketch);
    }), emscripten::allow_raw_pointers())
    .function("updateWithWrappedSketch", emscripten::optional_override([](theta_union& self, const wrapped_compact_theta_sketch& sketch) {
      self.update(sketch);
    }), emscripten::allow_raw_pointers())
    .function("updateWithBytes", emscripten::optional_override([](theta_union& self, const std::string& bytes, uint64_t seed) {
      self.update(wrapped_compact_theta_sketch::wrap(bytes.data(), bytes.size(), seed));
    }), emscripten::allow_raw_pointers())
    .function("updateWithVectorBytes", emscripten::optional_override([](theta_union& self, const vector_bytes& bytes, uint64_t seed) {
      self.update(wrapped_compact_theta_sketch::wrap(bytes.data(), bytes.size(), seed));
    }), emscripten::allow_raw_pointers())
    .function("updateWithB64", emscripten::optional_override([](theta_union& self, const std::string& b64, uint64_t seed) {
      std::vector<char> bytes(b64_dec_len(b64.data(), b64.size()));
      b64_decode(b64.data(), b64.size(), bytes.data());
      self.update(wrapped_compact_theta_sketch::wrap(bytes.data(), bytes.size(), seed));
    }), emscripten::allow_raw_pointers())
    .function("updateWithBuffer", emscripten::optional_override([](theta_union& self, intptr_t bytes, size_t size, uint64_t seed) {
      self.update(wrapped_compact_theta_sketch::wrap(reinterpret_cast<void*>(bytes), size, seed));
    }))
    .function("getResultSerialized", emscripten::optional_override([](theta_union& self) {
      return self.get_result().serialize_compressed();
    }))
    .function("getResultStreamCompressed", emscripten::optional_override([](theta_union& self, intptr_t bytes, size_t size) {
      std::strstream stream(reinterpret_cast<char*>(bytes), size);
      self.get_result().serialize_compressed(stream);
      return (int) stream.tellp();
    }))
    .function("getResultAsUint8Array", emscripten::optional_override([](theta_union& self) {
      auto bytes = self.get_result().serialize();
      return Uint8Array.new_(emscripten::typed_memory_view(bytes.size(), bytes.data()));
    }))
    .function("getResultAsUint8ArrayCompressed", emscripten::optional_override([](theta_union& self) {
      auto bytes = self.get_result().serialize_compressed();
      return Uint8Array.new_(emscripten::typed_memory_view(bytes.size(), bytes.data()));
    }))
    .function("getResultB64", emscripten::optional_override([](theta_union& self) {
      auto bytes = self.get_result().serialize();
      std::vector<char> b64(b64_enc_len(bytes.size()));
      b64_encode((const char*) bytes.data(), bytes.size(), b64.data());
      return std::string(b64.data(), b64.size());
    }))
    .function("getResultB64Compressed", emscripten::optional_override([](theta_union& self) {
      auto bytes = self.get_result().serialize_compressed();
      std::vector<char> b64(b64_enc_len(bytes.size()));
      b64_encode((const char*) bytes.data(), bytes.size(), b64.data());
      return std::string(b64.data(), b64.size());
    }))
    ;

  emscripten::class_<theta_intersection>("theta_intersection")
    .constructor(emscripten::optional_override([]() {
      return new theta_intersection();
    }))
    .constructor(emscripten::optional_override([](uint64_t seed) {
      return new theta_intersection(seed);
    }))
    .function("updateWithCompactSketch", emscripten::optional_override([](theta_intersection& self, const compact_theta_sketch& sketch) {
      self.update(sketch);
    }))
    .function("updateWithWrappedSketch", emscripten::optional_override([](theta_intersection& self, const wrapped_compact_theta_sketch& sketch) {
      self.update(sketch);
    }))
    .function("updateWithB64", emscripten::optional_override([](theta_intersection& self, const std::string& b64, uint64_t seed) {
      std::vector<char> bytes(b64_dec_len(b64.data(), b64.size()));
      b64_decode(b64.data(), b64.size(), bytes.data());
      self.update(wrapped_compact_theta_sketch::wrap(bytes.data(), bytes.size(), seed));
    }), emscripten::allow_raw_pointers())
    .function("getResultB64", emscripten::optional_override([](theta_intersection& self) {
      auto bytes = self.get_result().serialize();
      std::vector<char> b64(b64_enc_len(bytes.size()));
      b64_encode((const char*) bytes.data(), bytes.size(), b64.data());
      return std::string(b64.data(), b64.size());
    }))
    .function("getResultB64Compressed", emscripten::optional_override([](theta_intersection& self) {
      auto bytes = self.get_result().serialize_compressed();
      std::vector<char> b64(b64_enc_len(bytes.size()));
      b64_encode((const char*) bytes.data(), bytes.size(), b64.data());
      return std::string(b64.data(), b64.size());
    }))
    ;

  emscripten::class_<theta_a_not_b>("theta_a_not_b")
    .constructor(emscripten::optional_override([]() {
      return new theta_a_not_b();
    }))
    .constructor(emscripten::optional_override([](uint64_t seed) {
      return new theta_a_not_b(seed);
    }))
    .function("computeWithCompactSketch", emscripten::optional_override([](theta_a_not_b& self,
      const compact_theta_sketch& sketch1, const compact_theta_sketch& sketch2) {
      return self.compute(sketch1, sketch2);
    }))
    .function("computeWithWrappedSketch", emscripten::optional_override([](theta_a_not_b& self,
      const wrapped_compact_theta_sketch& sketch1, const wrapped_compact_theta_sketch& sketch2) {
      return self.compute(sketch1, sketch2);
    }))
    .function("computeWithB64ReturnB64", emscripten::optional_override([](theta_a_not_b& self,
      const std::string& b64_1, const std::string& b64_2, uint64_t seed) {
      std::vector<char> bytes1(b64_dec_len(b64_1.data(), b64_1.size()));
      b64_decode(b64_1.data(), b64_1.size(), bytes1.data());
      std::vector<char> bytes2(b64_dec_len(b64_2.data(), b64_2.size()));
      b64_decode(b64_2.data(), b64_2.size(), bytes2.data());
      auto bytes = self.compute(
        wrapped_compact_theta_sketch::wrap(bytes1.data(), bytes1.size(), seed),
        wrapped_compact_theta_sketch::wrap(bytes2.data(), bytes2.size(), seed)
      ).serialize();
      std::vector<char> b64(b64_enc_len(bytes.size()));
      b64_encode((const char*) bytes.data(), bytes.size(), b64.data());
      return std::string(b64.data(), b64.size());
    }))
    .function("computeWithB64ReturnB64Compressed", emscripten::optional_override([](theta_a_not_b& self,
      const std::string& b64_1, const std::string& b64_2, uint64_t seed) {
      std::vector<char> bytes1(b64_dec_len(b64_1.data(), b64_1.size()));
      b64_decode(b64_1.data(), b64_1.size(), bytes1.data());
      std::vector<char> bytes2(b64_dec_len(b64_2.data(), b64_2.size()));
      b64_decode(b64_2.data(), b64_2.size(), bytes2.data());
      auto bytes = self.compute(
        wrapped_compact_theta_sketch::wrap(bytes1.data(), bytes1.size(), seed),
        wrapped_compact_theta_sketch::wrap(bytes2.data(), bytes2.size(), seed)
      ).serialize_compressed();
      std::vector<char> b64(b64_enc_len(bytes.size()));
      b64_encode((const char*) bytes.data(), bytes.size(), b64.data());
      return std::string(b64.data(), b64.size());
    }))
    ;
}
