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
#include <tuple_jaccard_similarity.hpp>
#include <theta_sketch.hpp>

using Summary = uint64_t;
using Update = uint64_t;

enum tuple_mode {SUM, MIN, MAX, ONE, NOP};

template<typename S, typename U>
class tuple_update_policy {
public:
  tuple_update_policy(tuple_mode mode): mode_(mode) {}
  Summary create() const {
    if (mode_ == ONE) return 1;
    else if (mode_ == MIN) return std::numeric_limits<Summary>::max();
    else if (mode_ == MAX) return std::numeric_limits<Summary>::min();
    return 0;
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

template<typename T>
struct no_op_policy {
  void operator()(T&, const T&) const {}
};

using tuple_jaccard_similarity_int64 = datasketches::tuple_jaccard_similarity<Summary, no_op_policy<Summary>, no_op_policy<Summary>>;

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
    .class_function("convertTheta", emscripten::optional_override([](const std::string& theta_sketch_bytes, uint64_t value, uint64_t seed) {
      // converting constructor does not currently take wrapped compact theta sketch
      const auto sketch = datasketches::compact_theta_sketch::deserialize(theta_sketch_bytes.data(), theta_sketch_bytes.size(), seed);
      auto bytes = compact_tuple_sketch_int64(sketch, value).serialize();
      return Uint8Array.new_(emscripten::typed_memory_view(bytes.size(), bytes.data()));
    }))
    .class_function("getEstimate", emscripten::optional_override([](const std::string& sketch_bytes, uint64_t seed) {
      return compact_tuple_sketch_int64::deserialize(sketch_bytes.data(), sketch_bytes.size(), seed).get_estimate();
    }))
    .class_function("getEstimateAndBounds", emscripten::optional_override([](const std::string& sketch_bytes, uint8_t num_std_devs, uint64_t seed) {
      const auto sketch = compact_tuple_sketch_int64::deserialize(sketch_bytes.data(), sketch_bytes.size(), seed);
      auto result =  emscripten::val::object();
      result.set("estimate", sketch.get_estimate());
      result.set("lower_bound", sketch.get_lower_bound(num_std_devs));
      result.set("upper_bound", sketch.get_upper_bound(num_std_devs));
      return result;
    }))
    .class_function("getSumEstimateAndBounds", emscripten::optional_override([](const std::string& sketch_bytes, uint8_t num_std_devs, uint64_t seed) {
      const auto sketch = compact_tuple_sketch_int64::deserialize(sketch_bytes.data(), sketch_bytes.size(), seed);
      uint64_t sum = 0;
      for (const auto& entry: sketch) sum += entry.second;
      const double sum_estimate = sum / sketch.get_theta();
      auto result =  emscripten::val::object();
      result.set("sum_estimate", sum_estimate);
      result.set("sum_lower_bound", sketch.get_estimate() > 0 ? (sum_estimate * sketch.get_lower_bound(num_std_devs) / sketch.get_estimate()) : 0);
      result.set("sum_upper_bound", sketch.get_estimate() > 0 ? (sum_estimate * sketch.get_upper_bound(num_std_devs) / sketch.get_estimate()) : 0);
      return result;
    }))
    .class_function("getTheta", emscripten::optional_override([](const std::string& sketch_bytes, uint64_t seed) {
      return compact_tuple_sketch_int64::deserialize(sketch_bytes.data(), sketch_bytes.size(), seed).get_theta();
    }))
    .class_function("getNumRetained", emscripten::optional_override([](const std::string& sketch_bytes, uint64_t seed) {
      return compact_tuple_sketch_int64::deserialize(sketch_bytes.data(), sketch_bytes.size(), seed).get_num_retained();
    }))
    .class_function("toString", emscripten::optional_override([](const std::string& sketch_bytes, uint64_t seed) {
      return compact_tuple_sketch_int64::deserialize(sketch_bytes.data(), sketch_bytes.size(), seed).to_string();
    }))
    .class_function("filterLowHigh", emscripten::optional_override([](const std::string& sketch_bytes, int low, int high, uint64_t seed) {
      auto bytes = compact_tuple_sketch_int64::deserialize(
        sketch_bytes.data(), sketch_bytes.size(), seed
      ).filter([low, high](int v){return v >= low && v <= high;}).serialize();
      return Uint8Array.new_(emscripten::typed_memory_view(bytes.size(), bytes.data()));
    }))
    ;

  emscripten::class_<tuple_union_int64>("tuple_union_int64")
    .constructor(emscripten::optional_override([](uint8_t lg_k, uint64_t seed, std::string mode_str) {
      const auto policy = tuple_union_policy<Summary>(convert_mode(mode_str));
      return new tuple_union_int64(tuple_union_int64::builder(policy).set_lg_k(lg_k).set_seed(seed).build());
    }))
    .function("updateWithUpdateSketch", emscripten::optional_override([](tuple_union_int64& self, const update_tuple_sketch_int64& sketch) {
      self.update(sketch);
    }))
    .function("updateWithCompactSketch", emscripten::optional_override([](tuple_union_int64& self, const compact_tuple_sketch_int64& sketch) {
      self.update(sketch);
    }))
    .function("updateWithBytes", emscripten::optional_override([](tuple_union_int64& self, const std::string& bytes, uint64_t seed) {
      self.update(compact_tuple_sketch_int64::deserialize(bytes.data(), bytes.size(), seed));
    }))
    .function("getResultAsUint8Array", emscripten::optional_override([](tuple_union_int64& self) {
      auto bytes = self.get_result().serialize();
      return Uint8Array.new_(emscripten::typed_memory_view(bytes.size(), bytes.data()));
    }))
    ;

  emscripten::function("tupleUnionInt64", emscripten::optional_override([](
    const std::string& bytes1, const std::string& bytes2, uint8_t lg_k, uint64_t seed, const std::string& mode_str
  ) {
    const auto policy = tuple_union_policy<Summary>(convert_mode(mode_str));
    auto u = tuple_union_int64(tuple_union_int64::builder(policy).set_lg_k(lg_k).set_seed(seed).build());
    u.update(compact_tuple_sketch_int64::deserialize(bytes1.data(), bytes1.size(), seed));
    u.update(compact_tuple_sketch_int64::deserialize(bytes2.data(), bytes2.size(), seed));
    const auto bytes = u.get_result().serialize();
    return Uint8Array.new_(emscripten::typed_memory_view(bytes.size(), bytes.data()));
  }));

  emscripten::function("tupleIntersectionInt64", emscripten::optional_override([](
    const std::string& bytes1, const std::string& bytes2, uint64_t seed, const std::string& mode_str
  ) {
    tuple_intersection_int64 intersection(seed, tuple_intersection_policy<Summary>(convert_mode(mode_str)));
    intersection.update(compact_tuple_sketch_int64::deserialize(bytes1.data(), bytes1.size(), seed));
    intersection.update(compact_tuple_sketch_int64::deserialize(bytes2.data(), bytes2.size(), seed));
    const auto bytes = intersection.get_result().serialize();
    return Uint8Array.new_(emscripten::typed_memory_view(bytes.size(), bytes.data()));
  }));

  emscripten::function("tupleAnotBInt64", emscripten::optional_override([](const std::string& bytes1, const std::string& bytes2, uint64_t seed) {
    auto bytes = tuple_a_not_b_int64(seed).compute(
      compact_tuple_sketch_int64::deserialize(bytes1.data(), bytes1.size(), seed),
      compact_tuple_sketch_int64::deserialize(bytes2.data(), bytes2.size(), seed)
    ).serialize();
    return Uint8Array.new_(emscripten::typed_memory_view(bytes.size(), bytes.data()));
  }));

  emscripten::function("tupleInt64JaccardSimilarity", emscripten::optional_override([](const std::string& bytes1, const std::string& bytes2, uint64_t seed) {
    const auto arr = tuple_jaccard_similarity_int64::jaccard(
      compact_tuple_sketch_int64::deserialize(bytes1.data(), bytes1.size(), seed),
      compact_tuple_sketch_int64::deserialize(bytes2.data(), bytes2.size(), seed),
      seed
    );
    return std::vector<double>{arr[0], arr[1], arr[2]};
  }));
}
