
// Licensed to the Apache Software Foundation (ASF) under one
// or more contributor license agreements.  See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership.  The ASF licenses this file
// to you under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance
// with the License.  You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.

const { generate_udf_test, generate_udaf_test } = unit_test_utils;

generate_udaf_test("req_sketch_float_build", {
  input_columns: [`value`],
  input_rows: `SELECT * FROM UNNEST([NULL, NULL, NULL, NULL, NULL]) AS value`,
  expected_output: null
});

generate_udaf_test("req_sketch_float_merge", {
  input_columns: [`sketch`],
  input_rows: `SELECT * FROM UNNEST([CAST(NULL AS BYTES), CAST(NULL AS BYTES), CAST(NULL AS BYTES)]) AS sketch`,
  expected_output: null
});

const req_1 = `FROM_BASE64('AgERCAwAAQAAAAAAAAAAAAAAQEEAAwAACgAAAAAAIEEAABBBAAAAQQAA4EAAAMBAAACgQAAAgEAAAEBAAAAAQAAAgD8=')`;

generate_udaf_test("req_sketch_float_build", {
  input_columns: [`value`],
  input_rows: `SELECT * FROM UNNEST([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) AS value`,
  expected_output: req_1
});

const req_2 = `FROM_BASE64('AgERCAwAAQAAAAAAAAAAAAAAQEEAAwAACgAAAAAAoEEAAJhBAACQQQAAiEEAAIBBAABwQQAAYEEAAFBBAABAQQAAMEE=')`;

generate_udaf_test("req_sketch_float_build", {
  input_columns: [`value`],
  input_rows: `SELECT * FROM UNNEST([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]) AS value`,
  expected_output: req_2
});

const req_3 = `FROM_BASE64('AgERKAwAAQAAAAAAAAAAAAAAQEEAAwAAFAAAAAAAgD8AAABAAABAQAAAgEAAAKBAAADAQAAA4EAAAABBAAAQQQAAIEEAADBBAABAQQAAUEEAAGBBAABwQQAAgEEAAIhBAACQQQAAmEEAAKBB')`;

generate_udaf_test("req_sketch_float_merge", {
  input_columns: [`sketch`],
  input_rows: `SELECT * FROM UNNEST([${req_1}, ${req_2}]) AS sketch`,
  expected_output: req_3
});

generate_udf_test("req_sketch_float_to_string", [{
  inputs: [ `CAST(NULL AS BYTES)` ],
  expected_output: null
}]);

generate_udf_test("req_sketch_float_to_string", [{
  inputs: [ req_3 ],
  expected_output: `'''### REQ sketch summary:
   K              : 12
   High Rank Acc  : true
   Empty          : false
   Estimation mode: false
   Sorted         : true
   N              : 20
   Levels         : 1
   Retained items : 20
   Capacity items : 72
   Min item      : 1
   Max item      : 20
### End sketch summary
'''`
}]);

generate_udf_test("req_sketch_float_get_rank", [{
  inputs: [ `CAST(NULL AS BYTES)`, 10, true ],
  expected_output: null
}]);

generate_udf_test("req_sketch_float_get_rank", [{
  inputs: [ req_3, 10, true ],
  expected_output: 0.5
}]);

generate_udf_test("req_sketch_float_get_quantile", [{
  inputs: [ `CAST(NULL AS BYTES)`, 0.5, true ],
  expected_output: null
}]);

generate_udf_test("req_sketch_float_get_quantile", [{
  inputs: [ req_3, 0.5, true ],
  expected_output: 10
}]);

generate_udf_test("req_sketch_float_get_min_value", [{
  inputs: [ `CAST(NULL AS BYTES)` ],
  expected_output: null
}]);

generate_udf_test("req_sketch_float_get_min_value", [{
  inputs: [ req_3 ],
  expected_output: 1
}]);

generate_udf_test("req_sketch_float_get_max_value", [{
  inputs: [ `CAST(NULL AS BYTES)` ],
  expected_output: null
}]);

generate_udf_test("req_sketch_float_get_max_value", [{
  inputs: [ req_3 ],
  expected_output: 20
}]);

generate_udf_test("req_sketch_float_get_n", [{
  inputs: [ `CAST(NULL AS BYTES)` ],
  expected_output: null
}]);

generate_udf_test("req_sketch_float_get_n", [{
  inputs: [ req_3 ],
  expected_output: 20
}]);

generate_udf_test("req_sketch_float_get_num_retained", [{
  inputs: [ `CAST(NULL AS BYTES)` ],
  expected_output: null
}]);

generate_udf_test("req_sketch_float_get_num_retained", [{
  inputs: [ req_3 ],
  expected_output: 20
}]);

generate_udf_test("req_sketch_float_get_pmf", [{
  inputs: [ `CAST(NULL AS BYTES)`, `[10.0]`, true ],
  expected_output: `[]`
}]);

generate_udf_test("req_sketch_float_get_pmf", [{
  inputs: [ req_3, `[10.0]`, true ],
  expected_output: `[0.5, 0.5]`
}]);

generate_udf_test("req_sketch_float_get_cdf", [{
  inputs: [ `CAST(NULL AS BYTES)`, `[10.0]`, true ],
  expected_output: `[]`
}]);

generate_udf_test("req_sketch_float_get_cdf", [{
  inputs: [ req_3, `[10.0]`, true ],
  expected_output: `[0.5, 1.0]`
}]);

generate_udf_test("req_sketch_float_get_rank_lower_bound", [{
  inputs: [ req_3, 0.95, 2 ],
  expected_output: 0.95
}]);

generate_udf_test("req_sketch_float_get_rank_lower_bound", [{
  inputs: [ `CAST(NULL AS BYTES)`, 0.95, 2 ],
  expected_output: null
}]);

generate_udf_test("req_sketch_float_get_rank_upper_bound", [{
  inputs: [ `CAST(NULL AS BYTES)`, 0.95, 2 ],
  expected_output: null
}]);

generate_udf_test("req_sketch_float_get_rank_upper_bound", [{
  inputs: [ req_3, 0.95, 2 ],
  expected_output: 0.95
}]);

// using full signatures

const req_4 = `FROM_BASE64('AgERAAoAAQAAAAAAAAAAAAAAIEEAAwAACgAAAAAAgD8AAABAAABAQAAAgEAAAKBAAADAQAAA4EAAAABBAAAQQQAAIEE=')`;

generate_udaf_test("req_sketch_float_build_k_hra", {
  input_columns: [`value`, `STRUCT(10 AS k, false AS hra) NOT AGGREGATE`],
  input_rows: `SELECT * FROM UNNEST([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) AS value`,
  expected_output: req_4
});

const req_5 = `FROM_BASE64('AgERAAoAAQAAAAAAAAAAAAAAIEEAAwAACgAAAAAAMEEAAEBBAABQQQAAYEEAAHBBAACAQQAAiEEAAJBBAACYQQAAoEE=')`;

generate_udaf_test("req_sketch_float_build_k_hra", {
  input_columns: [`value`, `STRUCT(10 AS k, false AS hra) NOT AGGREGATE`],
  input_rows: `SELECT * FROM UNNEST([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]) AS value`,
  expected_output: req_5
});

const req_6 = `FROM_BASE64('AgERIAoAAQAAAAAAAAAAAAAAIEEAAwAAFAAAAAAAgD8AAABAAABAQAAAgEAAAKBAAADAQAAA4EAAAABBAAAQQQAAIEEAADBBAABAQQAAUEEAAGBBAABwQQAAgEEAAIhBAACQQQAAmEEAAKBB')`;

generate_udaf_test("req_sketch_float_merge_k_hra", {
  input_columns: [`sketch`, `STRUCT(10 AS k, false AS hra) NOT AGGREGATE`],
  input_rows: `SELECT * FROM UNNEST([${req_4}, ${req_5}]) AS sketch`,
  expected_output: req_6
});
