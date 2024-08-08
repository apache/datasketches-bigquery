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

CREATE OR REPLACE FUNCTION `$BQ_PROJECT.$BQ_DATASET`.theta_sketch_a_not_b(sketch1 BYTES, sketch2 BYTES, seed INT64)
RETURNS BYTES
LANGUAGE js
OPTIONS (
  library=["$GCS_BUCKET/theta_sketch.js"],
  description = '''Performs the scalar set difference: sketch1 and not sketch2.
Param sketch1: the first sketch "a" as bytes.
Param sketch2: the second sketch "b" as bytes.
Param seed: This is used to confirm that the given sketch was configured with the correct seed.
Returns a Compact, Compressed Theta Sketch, as bytes, from which the set difference cardinality can be obtained.
For more details: https://datasketches.apache.org/docs/Theta/ThetaSketchFramework.html'''
) AS R"""
const default_seed = BigInt(9001);
try {
  var a_not_b = new Module.theta_a_not_b(seed ? BigInt(seed) : default_seed);
  try {
    return a_not_b.computeWithB64ReturnB64Compressed(sketch1, sketch2, seed ? BigInt(seed) : default_seed);
  } finally {
    a_not_b.delete();
  }
} catch (e) {
  throw new Error(Module.getExceptionMessage(e));
}
""";
