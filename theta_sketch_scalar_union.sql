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

CREATE OR REPLACE FUNCTION `$BQ_PROJECT.$BQ_DATASET`.theta_sketch_scalar_union(sketch1 BYTES, sketch2 BYTES, lg_k INT64, seed INT64) RETURNS BYTES LANGUAGE js
OPTIONS (library=["gs://datasketches/theta_sketch.js"]) AS R"""
const default_lg_k = 12;
const default_seed = BigInt(9001);
var union = new Module.theta_union(lg_k ? lg_k : default_lg_k, seed ? BigInt(seed) : default_seed);
try {
  union.updateWithB64(sketch1, seed ? BigInt(seed) : default_seed)
  union.updateWithB64(sketch2, seed ? BigInt(seed) : default_seed)
  return union.getResultB64Compressed();
} finally {
  union.delete();
}
""";
