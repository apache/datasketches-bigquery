# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.

CREATE OR REPLACE AGGREGATE FUNCTION `$BQ_PROJECT.$BQ_DATASET`.theta_sketch_agg_union(sketch BYTES, lg_k INT64 NOT AGGREGATE) RETURNS BYTES LANGUAGE js
OPTIONS (library=["$GCS_BUCKET/theta_sketch.mjs"]) AS R"""
import ModuleFactory from "$GCS_BUCKET/theta_sketch.mjs";
var Module = await ModuleFactory();
const default_lg_k = 12;
const default_seed = BigInt(9001);

// ensures we have a theta_union
// if there is a compact_theta_sketch, add it to the union and destroy it
function ensureUnion(state) {
  if (state.union == null) {
    state.union = new Module.theta_union(state.lg_k, state.seed);
  }
  if (state.serialized != null) {
    state.union.updateWithBytes(state.serialized, state.seed);
    state.serialized = null;
  }
}

export function initialState(lg_k) {
  return {
    lg_k: lg_k == null ? Number(default_lg_k) : Number(lg_k),
    seed: default_seed,
    union: null,
    serialized: null
  };
}

export function aggregate(state, sketch) {
  if (sketch != null) {
    ensureUnion(state);
    try {
      state.union.updateWithBytes(sketch, state.seed);
    } catch (e) {
      throw new Error(Module.getExceptionMessage(e));
    }
  }
}

export function serialize(state) {
  ensureUnion(state);
  try {
    return {
      lg_k: state.lg_k,
      seed: state.seed,
      bytes: state.union.getResultAsUint8ArrayCompressed()
    };
  } finally {
    state.union.delete();
    state.union = null;
  }
}

export function deserialize(serialized) {
  return {
    lg_k: serialized.lg_k,
    seed: serialized.seed,
    union: null,
    serialized: serialized.bytes
  };
}

export function merge(state, other_state) {
  ensureUnion(state);
  if (other_state.union) {
    throw new Error("Did not expect union in other state");
  }
  if (other_state.serialized) {
    try {
      state.union.updateWithBytes(other_state.serialized, state.seed);
      other_state.serialized = null;
    } catch (e) {
      throw new Error(Module.getExceptionMessage(e));
    }
  } else {
    throw new Error("Expected serialized sketch in other_state");
  }
}
export function finalize(state) {
  return serialize(state).bytes;
}
""";
