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

CREATE OR REPLACE AGGREGATE FUNCTION `$BQ_PROJECT.$BQ_DATASET`.theta_sketch_agg_union(sketch BYTES, lg_k INT64 NOT AGGREGATE)
RETURNS BYTES
LANGUAGE js
OPTIONS (
  library=["$GCS_BUCKET/theta_sketch.mjs"],
  description = '''Creates a sketch that represents the union of the given column of sketches.
Param sketch: the column of sketches. Each as bytes.
Param lg_k: the sketch accuracy/size parameter as an integer in the range [4, 26].
Returns a Compact, Compressed Theta Sketch, as bytes, from which the union cardinality can be obtained. .
For more details: https://datasketches.apache.org/docs/Theta/ThetaSketchFramework.html'''
) AS R"""
import ModuleFactory from "$GCS_BUCKET/theta_sketch.mjs";
var Module = await ModuleFactory();
const default_lg_k = 12;
const default_seed = BigInt(9001);

var buffer = {ptr: 0, size: 0};

function reserveBuffer(size) {
  if (buffer.size < size) {
    if (buffer.ptr != 0) {
      Module._free(buffer.ptr);
    }
    buffer.ptr = Module._malloc(size);
    buffer.size = size;
  }
}

// ensures we have a theta_union
// if there is a compact_theta_sketch, add it to the union and destroy it
function ensureUnion(state) {
  try {
    if (state.union == null) {
      state.union = new Module.theta_union(state.lg_k, state.seed);
    }
    if (state.serialized != null) {
      reserveBuffer(state.serialized.length);
      Module.HEAPU8.subarray(buffer.ptr, buffer.ptr + state.serialized.length).set(state.serialized);
      state.union.updateWithBuffer(buffer.ptr, state.serialized.length, state.seed);
      state.serialized = null;
    }
  } catch (e) {
    throw new Error(Module.getExceptionMessage(e));
  }
}

export function initialState(lg_k) {
  return {
    lg_k: lg_k == null ? Number(default_lg_k) : Number(lg_k),
    seed: default_seed,
    union: null,
    serialized: null
  };
  reserveBuffer(Module.compact_theta_sketch.getMaxSerializedSizeBytes(state.lg_k));
}

export function aggregate(state, sketch) {
  if (sketch != null) {
    ensureUnion(state);
    try {
      reserveBuffer(sketch.length);
      Module.HEAPU8.subarray(buffer.ptr, buffer.ptr + sketch.length).set(sketch);
      state.union.updateWithBuffer(buffer.ptr, sketch.length, state.seed);
    } catch (e) {
      throw new Error(Module.getExceptionMessage(e));
    }
  }
}

export function serialize(state) {
  try {
    ensureUnion(state);
    reserveBuffer(Module.compact_theta_sketch.getMaxSerializedSizeBytes(state.lg_k));
    var size = state.union.getResultStreamCompressed(buffer.ptr, buffer.size);
    return {
      lg_k: state.lg_k,
      seed: state.seed,
      bytes: Module.HEAPU8.slice(buffer.ptr, buffer.ptr + size)
    };
  } catch (e) {
    throw new Error(Module.getExceptionMessage(e));
  } finally {
    if (state.union != null) {
      state.union.delete();
    }
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
  reserveBuffer(Module.compact_theta_sketch.getMaxSerializedSizeBytes(state.lg_k));
  if (other_state.union) {
    throw new Error("Did not expect union in other state");
  }
  if (state.union == null) {
    state.union = new Module.theta_union(state.lg_k, state.seed);
  }
  if (state.serialized != null) {
    try {
      reserveBuffer(state.serialized.length);
      Module.HEAPU8.subarray(buffer.ptr, buffer.ptr + state.serialized.length).set(state.serialized);
      state.union.updateWithBuffer(buffer.ptr, state.serialized.length, state.seed);
      state.serialized = null;
    } catch (e) {
      throw new Error(Module.getExceptionMessage(e));
    }
  }
  if (other_state.serialized != null) {
    try {
      reserveBuffer(other_state.serialized.length);
      Module.HEAPU8.subarray(buffer.ptr, buffer.ptr + other_state.serialized.length).set(other_state.serialized);
      state.union.updateWithBuffer(buffer.ptr, other_state.serialized.length, other_state.seed);
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
