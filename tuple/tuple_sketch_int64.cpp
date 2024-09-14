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

#include <tuple_sketch.hpp>
#include <tuple_union.hpp>
#include <tuple_intersection.hpp>
#include <tuple_a_not_b.hpp>
#include <theta_sketch.hpp>

#include "../base64.hpp"

using Summary = uint64_t;
using Update = uint64_t;

enum tuple_mode {SUM, MIN, MAX, ONE, NOP};

template<typename S, typename U>
class tuple_update_policy {
public:
  tuple_update_policy(tuple_mode mode): mode_(mode) {}
  Summary create() const {
    return S();
  }
  void update(S& summary, const U& update) const {
    if (mode_ == SUM) summary += update;
    else if (mode_ == MIN) summary = std::min(summary, update);
    else if (mode_ == MAX) summary = std::max(summary, update);
    else if (mode_ == ONE) summary = 1;
  }
private:
  tuple_mode mode_;
};
using update_tuple_sketch_int64 = datasketches::update_tuple_sketch<Summary, Update, tuple_update_policy<Summary, Update>>;
using compact_tuple_sketch_int64 = datasketches::compact_tuple_sketch<Summary>;

template<typename S>
class tuple_union_policy {
public:
  tuple_union_policy(tuple_mode mode): mode_(mode) {}
  void operator()(Summary& summary, const Summary& other) const {
    if (mode_ == SUM) summary += other;
    else if (mode_ == MIN) summary = std::min(summary, other);
    else if (mode_ == MAX) summary = std::max(summary, other);
    else if (mode_ == ONE) summary = 1;
  }
private:
  tuple_mode mode_;
};
using tuple_union_int64 = datasketches::tuple_union<Summary, tuple_union_policy<Summary>>;

template<typename S> using tuple_intersection_policy = tuple_union_policy<S>;
using tuple_intersection_int64 = datasketches::tuple_intersection<Summary, tuple_intersection_policy<Summary>>;

using tuple_a_not_b_int64 = datasketches::tuple_a_not_b<Summary>;

tuple_mode convert_mode(const std::string& mode_str) {
  if (mode_str == "" || mode_str == "SUM") return SUM;
  if (mode_str == "MIN") return MIN;
  if (mode_str == "MAX") return MAX;
  if (mode_str == "ONE") return ONE;
  if (mode_str == "NOP") return NOP;
  throw std::invalid_argument("unrecognized mode " + mode_str);
}

const emscripten::val Uint8Array = emscripten::val::global("Uint8Array");

EMSCRIPTEN_BINDINGS(tuple_sketch_int64) {
  emscripten::register_vector<double>("VectorDouble");

  emscripten::function("getExceptionMessage", emscripten::optional_override([](intptr_t ptr) {
    return std::string(reinterpret_cast<std::exception*>(ptr)->what());
  }));

  emscripten::constant("DEFAULT_LG_K", datasketches::theta_constants::DEFAULT_LG_K);
  emscripten::constant("DEFAULT_SEED", datasketches::DEFAULT_SEED);

  emscripten::class_<update_tuple_sketch_int64>("update_tuple_sketch_int64")
    .constructor(emscripten::optional_override([](uint8_t lg_k, uint64_t seed, float p, const std::string& mode_str) {
      const auto policy = tuple_update_policy<Summary, Update>(convert_mode(mode_str));
      return new update_tuple_sketch_int64(update_tuple_sketch_int64::builder(policy).set_lg_k(lg_k).set_seed(seed).set_p(p).build());
    }))
    .function("updateString", emscripten::optional_override([](update_tuple_sketch_int64& self, const std::string& key, Update value) {
      self.update(key, value);
    }))
    .function("updateInt64", emscripten::optional_override([](update_tuple_sketch_int64& self, uint64_t key, Update value) {
      self.update(key, value);
    }))
    .function("serializeAsUint8Array", emscripten::optional_override([](const update_tuple_sketch_int64& self) {
      auto bytes = self.compact().serialize();
      return Uint8Array.new_(emscripten::typed_memory_view(bytes.size(), bytes.data()));
    }))
    ;

  emscripten::class_<compact_tuple_sketch_int64>("compact_tuple_sketch_int64")
    .class_function("deserializeFromB64", emscripten::optional_override([](const std::string& b64, uint64_t seed) {
      std::vector<char> bytes(b64_dec_len(b64.data(), b64.size()));
      b64_decode(b64.data(), b64.size(), bytes.data());
      return new compact_tuple_sketch_int64(compact_tuple_sketch_int64::deserialize(bytes.data(), bytes.size(), seed));
    }), emscripten::allow_raw_pointers())
    .class_function("deserializeFromBinary", emscripten::optional_override([](const std::string& bytes, uint64_t seed) {
      return new compact_tuple_sketch_int64(compact_tuple_sketch_int64::deserialize(bytes.data(), bytes.size(), seed));
    }), emscripten::allow_raw_pointers())
    .class_function("convertThetaFromB64", emscripten::optional_override([](const std::string& b64, uint64_t value, uint64_t seed) {
      std::vector<char> bytes(b64_dec_len(b64.data(), b64.size()));
      b64_decode(b64.data(), b64.size(), bytes.data());
      // converting constructor does not currently take wrapped compact theta sketch
      const auto sketch = datasketches::compact_theta_sketch::deserialize(bytes.data(), bytes.size(), seed);
      return new compact_tuple_sketch_int64(sketch, value);
    }), emscripten::allow_raw_pointers())
    .function("getEstimate", emscripten::optional_override([](const compact_tuple_sketch_int64& self) {
      return self.get_estimate();
    }))
    .function("toString", emscripten::optional_override([](const compact_tuple_sketch_int64& self) {
      return std::string(self.to_string());
    }))
    .function("serializeAsB64", emscripten::optional_override([](const compact_tuple_sketch_int64& self) {
      auto bytes = self.serialize();
      std::vector<char> b64(b64_enc_len(bytes.size()));
      b64_encode((const char*) bytes.data(), bytes.size(), b64.data());
      return std::string(b64.data(), b64.size());
    }))
    .function("filterB64", emscripten::optional_override([](const compact_tuple_sketch_int64& self, int low, int high) {
      auto sketch = self.filter([low, high](int v){return v >= low && v <= high;});
      auto bytes = sketch.serialize();
      std::vector<char> b64(b64_enc_len(bytes.size()));
      b64_encode((const char*) bytes.data(), bytes.size(), b64.data());
      return std::string(b64.data(), b64.size());
    }))
    ;

  emscripten::class_<tuple_union_int64>("tuple_union_int64")
    .constructor(emscripten::optional_override([](uint8_t lg_k, uint64_t seed, std::string mode_str) {
      const auto policy = tuple_union_policy<Summary>(convert_mode(mode_str));
      return new tuple_union_int64(tuple_union_int64::builder(policy).set_lg_k(lg_k).set_seed(seed).build());
    }))
    .function("updateWithCompactSketch", emscripten::optional_override([](tuple_union_int64& self, const compact_tuple_sketch_int64& sketch) {
      self.update(sketch);
    }), emscripten::allow_raw_pointers())
    .function("updateWithBytes", emscripten::optional_override([](tuple_union_int64& self, const std::string& bytes, uint64_t seed) {
      self.update(compact_tuple_sketch_int64::deserialize(bytes.data(), bytes.size(), seed));
    }), emscripten::allow_raw_pointers())
    .function("updateWithB64", emscripten::optional_override([](tuple_union_int64& self, const std::string& b64, uint64_t seed) {
      std::vector<char> bytes(b64_dec_len(b64.data(), b64.size()));
      b64_decode(b64.data(), b64.size(), bytes.data());
      self.update(compact_tuple_sketch_int64::deserialize(bytes.data(), bytes.size(), seed));
    }), emscripten::allow_raw_pointers())
    .function("getResultAsUint8Array", emscripten::optional_override([](tuple_union_int64& self) {
      auto bytes = self.get_result().serialize();
      return Uint8Array.new_(emscripten::typed_memory_view(bytes.size(), bytes.data()));
    }))
    .function("getResultB64", emscripten::optional_override([](tuple_union_int64& self) {
      auto bytes = self.get_result().serialize();
      std::vector<char> b64(b64_enc_len(bytes.size()));
      b64_encode((const char*) bytes.data(), bytes.size(), b64.data());
      return std::string(b64.data(), b64.size());
    }))
    ;

  emscripten::class_<tuple_intersection_int64>("tuple_intersection_int64")
    .constructor(emscripten::optional_override([](uint64_t seed, const std::string& mode_str) {
      return new tuple_intersection_int64(seed, tuple_intersection_policy<Summary>(convert_mode(mode_str)));
    }))
    .function("updateWithB64", emscripten::optional_override([](tuple_intersection_int64& self, const std::string& b64, uint64_t seed) {
      std::vector<char> bytes(b64_dec_len(b64.data(), b64.size()));
      b64_decode(b64.data(), b64.size(), bytes.data());
      self.update(compact_tuple_sketch_int64::deserialize(bytes.data(), bytes.size(), seed));
    }), emscripten::allow_raw_pointers())
    .function("getResultB64", emscripten::optional_override([](tuple_intersection_int64& self) {
      auto bytes = self.get_result().serialize();
      std::vector<char> b64(b64_enc_len(bytes.size()));
      b64_encode((const char*) bytes.data(), bytes.size(), b64.data());
      return std::string(b64.data(), b64.size());
    }))
    ;

  emscripten::class_<tuple_a_not_b_int64>("tuple_a_not_b_int64")
    .constructor(emscripten::optional_override([](uint64_t seed) {
      return new tuple_a_not_b_int64(seed);
    }))
    .function("computeWithB64ReturnB64", emscripten::optional_override([](tuple_a_not_b_int64& self,
      const std::string& b64_1, const std::string& b64_2, uint64_t seed) {
      std::vector<char> bytes1(b64_dec_len(b64_1.data(), b64_1.size()));
      b64_decode(b64_1.data(), b64_1.size(), bytes1.data());
      std::vector<char> bytes2(b64_dec_len(b64_2.data(), b64_2.size()));
      b64_decode(b64_2.data(), b64_2.size(), bytes2.data());
      auto bytes = self.compute(
        compact_tuple_sketch_int64::deserialize(bytes1.data(), bytes1.size(), seed),
        compact_tuple_sketch_int64::deserialize(bytes2.data(), bytes2.size(), seed)
      ).serialize();
      std::vector<char> b64(b64_enc_len(bytes.size()));
      b64_encode((const char*) bytes.data(), bytes.size(), b64.data());
      return std::string(b64.data(), b64.size());
    }))
    ;
}
