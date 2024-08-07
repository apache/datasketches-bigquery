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

CREATE OR REPLACE AGGREGATE FUNCTION `$BQ_PROJECT.$BQ_DATASET`.cpc_sketch_agg_string`(str STRING, params STRUCT<lg_k INT, seed INT64> NOT AGGREGATE) RETURNS BYTES LANGUAGE js
OPTIONS (library=["gs://$GCS_BUCKET/cpc_sketch.mjs"]) AS R"""
import ModuleFactory from "gs://$GCS_BUCKET/cpc_sketch.mjs";
var Module = await ModuleFactory();
const default_lg_k = Number(12);
const default_seed = BigInt(9001);

function destroyState(state) {
  if (state.sketch) {
    state.sketch.delete();
    state.sketch = null;
  }
  if (state.union) {
    state.union.delete();
    state.union = null;
  }
  state.serialized = null;
}

// UDAF interface
export function initialState(params) {
  var state = {
    lg_k: params.lg_k == null ? default_lg_k : Number(params.lg_k),
    seed: params.seed == null ? default_seed : BigInt(params.seed),
    sketch: null,
    union: null,
    serialized: null
  };
  state.sketch = new Module.cpc_sketch(state.lg_k, state.seed);
  return state;
}

export function aggregate(state, str) {
  if (state.sketch == null) {
    state.sketch = new Module.cpc_sketch(state.lg_k, state.seed);
  }
  state.sketch.updateString(str);
}

export function serialize(state) {
  try {
    if (state.sketch != null && state.serialized != null) {
      // merge aggregated and serialized state
      var u = new Module.cpc_union(state.lg_k, state.seed);
      try {
        u.updateWithSketch(state.sketch);
        u.updateWithBytes(state.serialized, state.seed);
        state.serialized = u.getResultAsUint8ArrayCompressed();
      } finally {
        u.delete();
      }
    } else if (state.sketch != null) {
      state.serialized = state.sketch.serializeAsUint8Array();
    } else if (state.union != null) {
      state.serialized = state.union.getResultAsUint8Array();
    } else if (state.serialized == null) {
      throw new Error("Unexpected state in serialization " + JSON.stringify(state));
    }
    return {
      lg_k: state.lg_k,
      seed: state.seed,
      bytes: state.serialized
    };
  } finally {
    destroyState(state);
  }
}

export function deserialize(serialized) {
  return {
    sketch: null,
    union: null,
    serialized: serialized.bytes,
    lg_k: serialized.lg_k,
    seed: serialized.seed
  };
}

export function merge(state, other_state) {
  if (!state.union) {
    state.union = new Module.cpc_union(state.lg_k, state.seed);
  }
  if (state.sketch || other_state.sketch) {
    throw new Error("sketch is not expected in merge");
  }
  if (other_state.union) {
    throw new Error("other_state should not have union in merge");
  }
  if (state.serialized) {
    state.union.updateWithBytes(state.serialized, state.seed);
    state.serialized = null;
  }
  if (other_state.serialized) {
    state.union.updateWithBytes(other_state.serialized, other_state.seed);
    other_state.serialized = null;
  } else {
    throw new Error("other_state should have serialized sketch in merge");
  }
}

export function finalize(state) {
  return serialize(state).bytes
}
""";
