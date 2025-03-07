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
#include <theta_jaccard_similarity.hpp>

using datasketches::update_theta_sketch;
using datasketches::compact_theta_sketch;
using datasketches::wrapped_compact_theta_sketch;
using datasketches::theta_union;
using datasketches::theta_intersection;
using datasketches::theta_a_not_b;

const emscripten::val Uint8Array = emscripten::val::global("Uint8Array");

EMSCRIPTEN_BINDINGS(theta_sketch) {
  emscripten::register_vector<double>("VectorDouble");

  emscripten::function("getExceptionMessage", emscripten::optional_override([](intptr_t ptr) {
    return std::string(reinterpret_cast<std::exception*>(ptr)->what());
  }));

  emscripten::constant("DEFAULT_LG_K", datasketches::theta_constants::DEFAULT_LG_K);
  emscripten::constant("DEFAULT_SEED", datasketches::DEFAULT_SEED);

  emscripten::class_<update_theta_sketch>("update_theta_sketch")
    .constructor(emscripten::optional_override([](uint8_t lg_k, uint64_t seed, float p) {
      return new update_theta_sketch(update_theta_sketch::builder().set_lg_k(lg_k).set_seed(seed).set_p(p).build());
    }))
    .function("updateString", emscripten::select_overload<void(const std::string&)>(&update_theta_sketch::update))
    .function("updateInt64", emscripten::select_overload<void(uint64_t)>(&update_theta_sketch::update))
    .function("serializeAsUint8ArrayCompressed", emscripten::optional_override([](const update_theta_sketch& self) {
      auto bytes = self.compact().serialize_compressed();
      return Uint8Array.new_(emscripten::typed_memory_view(bytes.size(), bytes.data()));
    }))
    ;

  emscripten::class_<compact_theta_sketch>("compact_theta_sketch")
    .class_function("getEstimateFromBytes", emscripten::optional_override([](const std::string& bytes, uint64_t seed) {
      return wrapped_compact_theta_sketch::wrap(bytes.data(), bytes.size(), seed).get_estimate();
    }))
    .class_function("getEstimateAndBoundsFromBytes", emscripten::optional_override([](const std::string& bytes, uint8_t num_std_devs, uint64_t seed) {
      const auto sketch =  wrapped_compact_theta_sketch::wrap(bytes.data(), bytes.size(), seed);
      return std::vector<double>{sketch.get_estimate(), sketch.get_lower_bound(num_std_devs), sketch.get_upper_bound(num_std_devs)};
    }))
    .class_function("toStringFromBytes", emscripten::optional_override([](const std::string& bytes, uint64_t seed) {
      return wrapped_compact_theta_sketch::wrap(bytes.data(), bytes.size(), seed).to_string();
    }))
    .class_function("getThetaFromBytes", emscripten::optional_override([](const std::string& bytes, uint64_t seed) {
      return wrapped_compact_theta_sketch::wrap(bytes.data(), bytes.size(), seed).get_theta();
    }))
    .class_function("getNumRetainedFromBytes", emscripten::optional_override([](const std::string& bytes, uint64_t seed) {
      return wrapped_compact_theta_sketch::wrap(bytes.data(), bytes.size(), seed).get_num_retained();
    }))
    .class_function("getMaxSerializedSizeBytes", &compact_theta_sketch::get_max_serialized_size_bytes)
    ;

  emscripten::class_<theta_union>("theta_union")
    .constructor(emscripten::optional_override([](uint8_t lg_k, uint64_t seed) {
      return new theta_union(theta_union::builder().set_lg_k(lg_k).set_seed(seed).build());
    }))
    .function("updateWithUpdateSketch", emscripten::optional_override([](theta_union& self, const update_theta_sketch& sketch) {
      self.update(sketch);
    }))
    .function("updateWithCompactSketch", emscripten::optional_override([](theta_union& self, const compact_theta_sketch& sketch) {
      self.update(sketch);
    }))
    .function("updateWithBytes", emscripten::optional_override([](theta_union& self, const std::string& bytes, uint64_t seed) {
      self.update(wrapped_compact_theta_sketch::wrap(bytes.data(), bytes.size(), seed));
    }))
    .function("updateWithBuffer", emscripten::optional_override([](theta_union& self, intptr_t bytes, size_t size, uint64_t seed) {
      self.update(wrapped_compact_theta_sketch::wrap(reinterpret_cast<void*>(bytes), size, seed));
    }))
    .function("getResultStreamCompressed", emscripten::optional_override([](theta_union& self, intptr_t bytes, size_t size) {
      std::strstream stream(reinterpret_cast<char*>(bytes), size);
      self.get_result().serialize_compressed(stream);
      return (int) stream.tellp();
    }))
    .function("getResultAsUint8ArrayCompressed", emscripten::optional_override([](theta_union& self) {
      auto bytes = self.get_result().serialize_compressed();
      return Uint8Array.new_(emscripten::typed_memory_view(bytes.size(), bytes.data()));
    }))
    .class_function("computeWithBytesReturnCompressed", emscripten::optional_override([](const std::string& bytes1, const std::string& bytes2, uint8_t lg_k, uint64_t seed) {
      auto u = theta_union::builder().set_lg_k(lg_k).set_seed(seed).build();
      u.update(wrapped_compact_theta_sketch::wrap(bytes1.data(), bytes1.size(), seed));
      u.update(wrapped_compact_theta_sketch::wrap(bytes2.data(), bytes2.size(), seed));
      const auto bytes = u.get_result().serialize_compressed();
      return Uint8Array.new_(emscripten::typed_memory_view(bytes.size(), bytes.data()));
    }))
    ;

  emscripten::function("thetaIntersectionCompressed", emscripten::optional_override([](const std::string& bytes1, const std::string& bytes2, uint64_t seed) {
      theta_intersection intersection(seed);
      intersection.update(wrapped_compact_theta_sketch::wrap(bytes1.data(), bytes1.size(), seed));
      intersection.update(wrapped_compact_theta_sketch::wrap(bytes2.data(), bytes2.size(), seed));
      const auto bytes = intersection.get_result().serialize_compressed();
      return Uint8Array.new_(emscripten::typed_memory_view(bytes.size(), bytes.data()));
    }))
    ;

  emscripten::function("thetaAnotBCompressed", emscripten::optional_override([](const std::string& bytes1, const std::string& bytes2, uint64_t seed) {
      const auto bytes = theta_a_not_b(seed).compute(
        wrapped_compact_theta_sketch::wrap(bytes1.data(), bytes1.size(), seed),
        wrapped_compact_theta_sketch::wrap(bytes2.data(), bytes2.size(), seed)
      ).serialize_compressed();
      return Uint8Array.new_(emscripten::typed_memory_view(bytes.size(), bytes.data()));
    }))
    ;

  emscripten::function("thetaJaccardSimilarity", emscripten::optional_override([](const std::string& bytes1, const std::string& bytes2, uint64_t seed) {
    const auto arr = datasketches::theta_jaccard_similarity::jaccard(
      wrapped_compact_theta_sketch::wrap(bytes1.data(), bytes1.size(), seed),
      wrapped_compact_theta_sketch::wrap(bytes2.data(), bytes2.size(), seed),
      seed
    );
    return std::vector<double>{arr[0], arr[1], arr[2]};
  }));
}
