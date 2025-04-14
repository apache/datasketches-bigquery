
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

generate_udaf_test("kll_sketch_float_build", {
  input_columns: [`value`],
  input_rows: `SELECT * FROM UNNEST([NULL, NULL, NULL, NULL, NULL]) AS value`,
  expected_output: null
});

generate_udaf_test("kll_sketch_float_merge", {
  input_columns: [`sketch`],
  input_rows: `SELECT * FROM UNNEST([CAST(NULL AS BYTES), CAST(NULL AS BYTES), CAST(NULL AS BYTES)]) AS sketch`,
  expected_output: null
});

const kll_1 = `FROM_BASE64('BQEPAMgACAAKAAAAAAAAAMgAAQC+AAAAAACAPwAAIEEAACBBAAAQQQAAAEEAAOBAAADAQAAAoEAAAIBAAABAQAAAAEAAAIA/')`;

generate_udaf_test("kll_sketch_float_build", {
  input_columns: [`value`],
  input_rows: `SELECT * FROM UNNEST([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) AS value`,
  expected_output: kll_1
});

const kll_2 = `FROM_BASE64('BQEPAMgACAAKAAAAAAAAAMgAAQC+AAAAAAAwQQAAoEEAAKBBAACYQQAAkEEAAIhBAACAQQAAcEEAAGBBAABQQQAAQEEAADBB')`;

generate_udaf_test("kll_sketch_float_build", {
  input_columns: [`value`],
  input_rows: `SELECT * FROM UNNEST([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]) AS value`,
  expected_output: kll_2
});

const kll_3 = `FROM_BASE64('BQEPAMgACAAUAAAAAAAAAMgAAQC0AAAAAACAPwAAoEEAADBBAABAQQAAUEEAAGBBAABwQQAAgEEAAIhBAACQQQAAmEEAAKBBAACAPwAAAEAAAEBAAACAQAAAoEAAAMBAAADgQAAAAEEAABBBAAAgQQ==')`;

generate_udaf_test("kll_sketch_float_merge", {
  input_columns: [`sketch`],
  input_rows: `SELECT * FROM UNNEST([${kll_1}, ${kll_2}]) AS sketch`,
  expected_output: kll_3
});

generate_udf_test("kll_sketch_float_to_string", [{
  inputs: [ `CAST(NULL AS BYTES)` ],
  expected_output: null
}]);

generate_udf_test("kll_sketch_float_to_string", [{
  inputs: [ kll_3 ],
  expected_output: `'''### KLL sketch summary:
   K              : 200
   min K          : 200
   M              : 8
   N              : 20
   Epsilon        : 1.33%
   Epsilon PMF    : 1.65%
   Empty          : false
   Estimation mode: false
   Levels         : 1
   Sorted         : false
   Capacity items : 200
   Retained items : 20
   Min item      : 1
   Max item      : 20
### End sketch summary
'''`
}]);

generate_udf_test("kll_sketch_float_get_rank", [{
  inputs: [ `CAST(NULL AS BYTES)`, 10, true ],
  expected_output: null
}]);

generate_udf_test("kll_sketch_float_get_rank", [{
  inputs: [ kll_3, 10, true ],
  expected_output: 0.5
}]);

generate_udf_test("kll_sketch_float_get_quantile", [{
  inputs: [ `CAST(NULL AS BYTES)`, 0.5, true ],
  expected_output: null
}]);

generate_udf_test("kll_sketch_float_get_quantile", [{
  inputs: [ kll_3, 0.5, true ],
  expected_output: 10
}]);

generate_udf_test("kll_sketch_float_get_min_value", [{
  inputs: [ `CAST(NULL AS BYTES)` ],
  expected_output: null
}]);

generate_udf_test("kll_sketch_float_get_min_value", [{
  inputs: [ kll_3 ],
  expected_output: 1
}]);

generate_udf_test("kll_sketch_float_get_max_value", [{
  inputs: [ `CAST(NULL AS BYTES)` ],
  expected_output: null
}]);

generate_udf_test("kll_sketch_float_get_max_value", [{
  inputs: [ kll_3 ],
  expected_output: 20
}]);

generate_udf_test("kll_sketch_float_get_n", [{
  inputs: [ `CAST(NULL AS BYTES)` ],
  expected_output: null
}]);

generate_udf_test("kll_sketch_float_get_n", [{
  inputs: [ kll_3 ],
  expected_output: 20
}]);

generate_udf_test("kll_sketch_float_get_num_retained", [{
  inputs: [ `CAST(NULL AS BYTES)` ],
  expected_output: null
}]);

generate_udf_test("kll_sketch_float_get_num_retained", [{
  inputs: [ kll_3 ],
  expected_output: 20
}]);

generate_udf_test("kll_sketch_float_get_normalized_rank_error", [{
  inputs: [ `CAST(NULL AS BYTES)`, true ],
  expected_output: null
}]);

generate_udf_test("kll_sketch_float_get_normalized_rank_error", [{
  inputs: [ kll_3, true ],
  expected_output: 0.01651561908528982
}]);

generate_udf_test("kll_sketch_float_get_pmf", [{
  inputs: [ `CAST(NULL AS BYTES)`, `[10.0]`, true ],
  expected_output: `[]`
}]);

generate_udf_test("kll_sketch_float_get_pmf", [{
  inputs: [ kll_3, `[10.0]`, true ],
  expected_output: `[0.5, 0.5]`
}]);

generate_udf_test("kll_sketch_float_get_cdf", [{
  inputs: [ `CAST(NULL AS BYTES)`, `[10.0]`, true ],
  expected_output: `[]`
}]);

generate_udf_test("kll_sketch_float_get_cdf", [{
  inputs: [ kll_3, `[10.0]`, true ],
  expected_output: `[0.5, 1.0]`
}]);

generate_udf_test("kll_sketch_float_kolmogorov_smirnov", [{
  inputs: [ kll_1, `CAST(NULL AS BYTES)`, 0.05 ],
  expected_output: null
}]);

generate_udf_test("kll_sketch_float_kolmogorov_smirnov", [{
  inputs: [ `CAST(NULL AS BYTES)`, kll_2, 0.05 ],
  expected_output: null
}]);

generate_udf_test("kll_sketch_float_kolmogorov_smirnov", [{
  inputs: [ kll_1, kll_1, 0.05 ],
  expected_output: false
}]);

generate_udf_test("kll_sketch_float_kolmogorov_smirnov", [{
  inputs: [ kll_1, kll_2, 0.05 ],
  expected_output: true
}]);


// using full signatures

const kll_4 = `FROM_BASE64('BQEPAGQACAAKAAAAAAAAAGQAAQBaAAAAAACAPwAAIEEAACBBAAAQQQAAAEEAAOBAAADAQAAAoEAAAIBAAABAQAAAAEAAAIA/')`;

generate_udaf_test("kll_sketch_float_build_k", {
  input_columns: [`value`, `100 NOT AGGREGATE`],
  input_rows: `SELECT * FROM UNNEST([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) AS value`,
  expected_output: kll_4
});

const kll_5 = `FROM_BASE64('BQEPAGQACAAKAAAAAAAAAGQAAQBaAAAAAAAwQQAAoEEAAKBBAACYQQAAkEEAAIhBAACAQQAAcEEAAGBBAABQQQAAQEEAADBB')`;

generate_udaf_test("kll_sketch_float_build_k", {
  input_columns: [`value`, `100 NOT AGGREGATE`],
  input_rows: `SELECT * FROM UNNEST([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]) AS value`,
  expected_output: kll_5
});

const kll_6 = `FROM_BASE64('BQEPAGQACAAUAAAAAAAAAGQAAQBQAAAAAACAPwAAoEEAADBBAABAQQAAUEEAAGBBAABwQQAAgEEAAIhBAACQQQAAmEEAAKBBAACAPwAAAEAAAEBAAACAQAAAoEAAAMBAAADgQAAAAEEAABBBAAAgQQ==')`;

generate_udaf_test("kll_sketch_float_merge_k", {
  input_columns: [`sketch`, `100 NOT AGGREGATE`],
  input_rows: `SELECT * FROM UNNEST([${kll_4}, ${kll_5}]) AS sketch`,
  expected_output: kll_6
});
