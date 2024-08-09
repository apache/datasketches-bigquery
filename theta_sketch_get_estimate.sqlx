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

CREATE OR REPLACE FUNCTION `$BQ_PROJECT.$BQ_DATASET`.theta_sketch_get_estimate(base64 BYTES, seed INT64)
RETURNS FLOAT64
LANGUAGE js
OPTIONS (
  library=["$GCS_BUCKET/theta_sketch.js"],
  description = '''Gets cardinality estimate and bounds from given sketch.
Param base64: The given sketch to query as bytes.
Param seed: This is used to confirm that the given sketch was configured with the correct seed.
Returns a FLOAT64 value as the cardinality estimate.
For more details: https://datasketches.apache.org/docs/Theta/ThetaSketchFramework.html'''
) AS R"""
const default_seed = BigInt(9001);
try {
  var sketch = Module.compact_theta_sketch.deserializeFromB64(base64, seed ? BigInt(seed) : default_seed);
  try {
    return sketch.getEstimate();
  } finally {
    sketch.delete();
  }
} catch (e) {
  throw new Error(Module.getExceptionMessage(e));
}
""";
