
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

// using defaults

generate_udaf_test("tuple_sketch_int64_agg_string", {
  input_columns: [`str`, `1`],
  input_rows: `SELECT * FROM UNNEST([CAST(NULL AS STRING), CAST(NULL AS STRING), CAST(NULL AS STRING)]) AS str`,
  expected_output: null
});

generate_udaf_test("tuple_sketch_int64_agg_int64", {
  input_columns: [`value`, `1`],
  input_rows: `SELECT * FROM UNNEST([NULL, NULL, NULL]) AS value`,
  expected_output: null
});

generate_udaf_test("tuple_sketch_int64_agg_union", {
  input_columns: [`sketch`],
  input_rows: `SELECT * FROM UNNEST([CAST(NULL AS BYTES), CAST(NULL AS BYTES), CAST(NULL AS BYTES)]) AS sketch`,
  expected_output: null
});

const tuple_1 = `FROM_BASE64('AgMJAQAazJMDAAAAAAAAALcMbuWor0AIAQAAAAAAAACFf0C2icflNAEAAAAAAAAAF8EdUoUHAXsBAAAAAAAAAA==')`;

generate_udaf_test("tuple_sketch_int64_agg_string", {
  input_columns: [`str`, `1`],
  input_rows: `SELECT * FROM UNNEST(['a', 'b', 'c']) AS str`,
  expected_output: tuple_1
});

const tuple_2 = `FROM_BASE64('AgMJAQAazJMDAAAAAAAAALcMbuWor0AIAQAAAAAAAABOPehbCCvBLgEAAAAAAAAA4F817XUdAHMBAAAAAAAAAA==')`;

generate_udaf_test("tuple_sketch_int64_agg_string", {
  input_columns: [`str`, `1`],
  input_rows: `SELECT * FROM UNNEST(['c', 'd', 'e']) AS str`,
  expected_output: tuple_2
});

generate_udf_test("tuple_sketch_int64_union", [{
  inputs: [ `CAST(NULL AS BYTES)`, `CAST(NULL AS BYTES)` ],
  expected_output: null
}]);

generate_udf_test("tuple_sketch_int64_union", [{
  inputs: [ tuple_1, `CAST(NULL AS BYTES)` ],
  expected_output: tuple_1
}]);

generate_udf_test("tuple_sketch_int64_union", [{
  inputs: [ `CAST(NULL AS BYTES)`, tuple_2 ],
  expected_output: tuple_2
}]);

const tuple_union_1 = `FROM_BASE64('AgMJAQAazJMFAAAAAAAAALcMbuWor0AIAgAAAAAAAABOPehbCCvBLgEAAAAAAAAAhX9AtonH5TQBAAAAAAAAAOBfNe11HQBzAQAAAAAAAAAXwR1ShQcBewEAAAAAAAAA')`;

generate_udf_test("tuple_sketch_int64_union", [{
  inputs: [ tuple_1, tuple_2 ],
  expected_output: tuple_union_1
}]);

generate_udf_test("tuple_sketch_int64_get_estimate", [{
  inputs: [ `CAST(NULL AS BYTES)` ],
  expected_output: null
}]);

generate_udf_test("tuple_sketch_int64_get_estimate", [{
  inputs: [ tuple_union_1 ],
  expected_output: 5
}]);

generate_udf_test("tuple_sketch_int64_to_string", [{
  inputs: [ `CAST(NULL AS BYTES)` ],
  expected_output: null
}]);

generate_udf_test("tuple_sketch_int64_to_string", [{
  inputs: [ tuple_union_1 ],
  expected_output: `'''### Tuple sketch summary:
   num retained entries : 5
   seed hash            : 37836
   empty?               : false
   ordered?             : true
   estimation mode?     : false
   theta (fraction)     : 1
   theta (raw 64-bit)   : 9223372036854775807
   estimate             : 5
   lower bound 95% conf : 5
   upper bound 95% conf : 5
### End sketch summary
'''`
}]);

generate_udf_test("tuple_sketch_int64_intersection", [{
  inputs: [ `CAST(NULL AS BYTES)`, `CAST(NULL AS BYTES)` ],
  expected_output: null
}]);

generate_udf_test("tuple_sketch_int64_intersection", [{
  inputs: [ tuple_1, `CAST(NULL AS BYTES)` ],
  expected_output: null
}]);

generate_udf_test("tuple_sketch_int64_intersection", [{
  inputs: [ `CAST(NULL AS BYTES)`, tuple_2 ],
  expected_output: null
}]);

const tuple_intersection = `FROM_BASE64('AQMJAQAazJO3DG7lqK9ACAIAAAAAAAAA')`;

generate_udf_test("tuple_sketch_int64_intersection", [{
  inputs: [ tuple_1, tuple_2 ],
  expected_output: tuple_intersection
}]);

generate_udf_test("tuple_sketch_int64_get_estimate", [{
  inputs: [ tuple_intersection ],
  expected_output: 1
}]);

generate_udf_test("tuple_sketch_int64_a_not_b", [{
  inputs: [ `CAST(NULL AS BYTES)`, `CAST(NULL AS BYTES)` ],
  expected_output: null
}]);

generate_udf_test("tuple_sketch_int64_a_not_b", [{
  inputs: [ `CAST(NULL AS BYTES)`, tuple_2 ],
  expected_output: null
}]);

generate_udf_test("tuple_sketch_int64_a_not_b", [{
  inputs: [ tuple_1, `CAST(NULL AS BYTES)` ],
  expected_output: tuple_1
}]);

const tuple_a_not_b = `FROM_BASE64('AgMJAQAazJMCAAAAAAAAAIV/QLaJx+U0AQAAAAAAAAAXwR1ShQcBewEAAAAAAAAA')`;

generate_udf_test("tuple_sketch_int64_a_not_b", [{
  inputs: [ tuple_1, tuple_2 ],
  expected_output: tuple_a_not_b
}]);

generate_udf_test("tuple_sketch_int64_get_estimate", [{
  inputs: [ tuple_a_not_b ],
  expected_output: 2
}]);

generate_udf_test("tuple_sketch_int64_jaccard_similarity", [{
  inputs: [ `CAST(NULL AS BYTES)`, `CAST(NULL AS BYTES)` ],
  expected_output: null
}]);

generate_udf_test("tuple_sketch_int64_jaccard_similarity", [{
  inputs: [ tuple_1, `CAST(NULL AS BYTES)` ],
  expected_output: null
}]);

generate_udf_test("tuple_sketch_int64_jaccard_similarity", [{
  inputs: [ `CAST(NULL AS BYTES)`, tuple_2 ],
  expected_output: null
}]);

generate_udf_test("tuple_sketch_int64_jaccard_similarity", [{
  inputs: [ tuple_1, tuple_2 ],
  expected_output: `STRUCT(0.2 AS lower_bound, 0.2 AS estimate, 0.2 AS upper_bound)`
}]);

const tuple_3 = `FROM_BASE64('AgMJAQAazJMDAAAAAAAAABX5fcu9hqEFAQAAAAAAAADDl/wSgXCdHgEAAAAAAAAAukCzwdoGaV0BAAAAAAAAAA==')`;

generate_udaf_test("tuple_sketch_int64_agg_int64", {
  input_columns: [`value`, `1`],
  input_rows: `SELECT * FROM UNNEST([1, 2, 3]) AS value`,
  expected_output: tuple_3
});

const tuple_4 = `FROM_BASE64('AgMJAQAazJMDAAAAAAAAAEDeLuHJ2z0IAQAAAAAAAAC9MnNyRpHMFAEAAAAAAAAAukCzwdoGaV0BAAAAAAAAAA==')`;

generate_udaf_test("tuple_sketch_int64_agg_int64", {
  input_columns: [`value`, `1`],
  input_rows: `SELECT * FROM UNNEST([3, 4, 5]) AS value`,
  expected_output: tuple_4
});

const tuple_union_2 = `FROM_BASE64('AgMJAQAazJMFAAAAAAAAABX5fcu9hqEFAQAAAAAAAABA3i7hyds9CAEAAAAAAAAAvTJzckaRzBQBAAAAAAAAAMOX/BKBcJ0eAQAAAAAAAAC6QLPB2gZpXQIAAAAAAAAA')`;

generate_udaf_test("tuple_sketch_int64_agg_union", {
  input_columns: [`sketch`],
  input_rows: `SELECT * FROM UNNEST([${tuple_3}, ${tuple_4}]) AS sketch`,
  expected_output: tuple_union_2
});

generate_udf_test("tuple_sketch_int64_get_estimate_and_bounds", [{
  inputs: [ `CAST(NULL AS BYTES)`, 3 ],
  expected_output: null
}]);

generate_udf_test("tuple_sketch_int64_get_estimate_and_bounds", [{
  inputs: [ tuple_union_2, 3 ],
  expected_output: `STRUCT(5 AS estimate, 5 AS lower_bound, 5 AS upper_bound)`
}]);

generate_udf_test("tuple_sketch_int64_get_theta", [{
  inputs: [ `CAST(NULL AS BYTES)` ],
  expected_output: null
}]);

generate_udf_test("tuple_sketch_int64_get_theta", [{
  inputs: [ tuple_union_2 ],
  expected_output: 1
}]);

generate_udf_test("tuple_sketch_int64_get_num_retained", [{
  inputs: [ `CAST(NULL AS BYTES)` ],
  expected_output: null
}]);

generate_udf_test("tuple_sketch_int64_get_num_retained", [{
  inputs: [ tuple_union_2 ],
  expected_output: 5
}]);

generate_udf_test("tuple_sketch_int64_from_theta_sketch", [{
  inputs: [ `CAST(NULL AS BYTES)`, 1 ],
  expected_output: null
}]);

generate_udf_test("tuple_sketch_int64_from_theta_sketch", [{
  inputs: [ `FROM_BASE64('AQQDPwEazJMDEIFfUcrcGW6ylF+DQ0nLOjDZ/9ze6gyQ')`, 1 ],
  expected_output: tuple_1
}]);

generate_udf_test("tuple_sketch_int64_get_sum_estimate_and_bounds", [{
  inputs: [ `CAST(NULL AS BYTES)`, 2 ],
  expected_output: null
}]);

generate_udf_test("tuple_sketch_int64_get_sum_estimate_and_bounds", [{
  inputs: [ tuple_union_2, 2 ],
  expected_output: `STRUCT(6 AS sum_estimate, 6 AS sum_lower_bound, 6 AS sum_upper_bound)`
}]);

generate_udf_test("tuple_sketch_int64_filter_low_high", [{
  inputs: [ `CAST(NULL AS BYTES)`, 1, 1 ],
  expected_output: null
}]);

generate_udf_test("tuple_sketch_int64_filter_low_high", [{
  inputs: [ tuple_union_2, 1, 1 ],
  expected_output: `FROM_BASE64('AgMJAQAazJMEAAAAAAAAABX5fcu9hqEFAQAAAAAAAABA3i7hyds9CAEAAAAAAAAAvTJzckaRzBQBAAAAAAAAAMOX/BKBcJ0eAQAAAAAAAAA=')`
}]);


// using full signatures

const tuple_8_111_09_min_1 = `FROM_BASE64('AwMJAQAajNMDAAAAAAAAAAAAAAAAMzNzVFGNpRzS1xYBAAAAAAAAACc7TbuPjPQXAQAAAAAAAAD5mKk7pGL+SgEAAAAAAAAA')`;

generate_udaf_test("tuple_sketch_int64_agg_string_lgk_seed_p_mode", {
  input_columns: [`str`, `1`, 'STRUCT(8 AS lgk, 111 AS seed, 0.9 AS p, "MIN" AS mode) NOT AGGREGATE'],
  input_rows: `SELECT * FROM UNNEST(['a', 'b', 'c']) AS str`,
  expected_output: tuple_8_111_09_min_1
});

const tuple_8_111_09_min_2 = `FROM_BASE64('AwMJAQAajNMDAAAAAAAAAAAAAAAAMzNzVFGNpRzS1xYBAAAAAAAAAOOWbNjz/z4eAQAAAAAAAACi02OpMeqiYgEAAAAAAAAA')`;

generate_udaf_test("tuple_sketch_int64_agg_string_lgk_seed_p_mode", {
  input_columns: [`str`, `1`, 'STRUCT(8 AS lgk, 111 AS seed, 0.9 AS p, "MIN" AS mode) NOT AGGREGATE'],
  input_rows: `SELECT * FROM UNNEST(['c', 'd', 'e']) AS str`,
  expected_output: tuple_8_111_09_min_2
});

const tuple_union_8_111_min = `FROM_BASE64('AwMJAQAajNMFAAAAAAAAAAAAAAAAMzNzVFGNpRzS1xYBAAAAAAAAACc7TbuPjPQXAQAAAAAAAADjlmzY8/8+HgEAAAAAAAAA+ZipO6Ri/koBAAAAAAAAAKLTY6kx6qJiAQAAAAAAAAA=')`;

generate_udf_test("tuple_sketch_int64_union_lgk_seed_mode", [{
  inputs: [ tuple_8_111_09_min_1, tuple_8_111_09_min_2, 8, 111, `"MIN"` ],
  expected_output: tuple_union_8_111_min
}]);

generate_udf_test("tuple_sketch_int64_get_estimate_seed", [{
  inputs: [ tuple_union_8_111_min, 111 ],
  expected_output: 5.5555557027275215
}]);

generate_udf_test("tuple_sketch_int64_to_string_seed", [{
  inputs: [ tuple_union_8_111_min, 111 ],
  expected_output: `'''### Tuple sketch summary:
   num retained entries : 5
   seed hash            : 54156
   empty?               : false
   ordered?             : true
   estimation mode?     : true
   theta (fraction)     : 0.9
   theta (raw 64-bit)   : 8301034613266972672
   estimate             : 5.55556
   lower bound 95% conf : 5
   upper bound 95% conf : 9
### End sketch summary
'''`
}]);

const tuple_intersection_111_min = `FROM_BASE64('AwMJAQAajNMBAAAAAAAAAAAAAAAAMzNzVFGNpRzS1xYBAAAAAAAAAA==')`;

generate_udf_test("tuple_sketch_int64_intersection_seed_mode", [{
  inputs: [ tuple_8_111_09_min_1, tuple_8_111_09_min_2, 111, `"MIN"` ],
  expected_output: tuple_intersection_111_min
}]);

generate_udf_test("tuple_sketch_int64_get_estimate_seed", [{
  inputs: [ tuple_intersection_111_min, 111 ],
  expected_output: 1.1111111405455043
}]);

const tuple_a_not_b_111 = `FROM_BASE64('AwMJAQAajNMCAAAAAAAAAAAAAAAAMzNzJztNu4+M9BcBAAAAAAAAAPmYqTukYv5KAQAAAAAAAAA=')`;

generate_udf_test("tuple_sketch_int64_a_not_b_seed", [{
  inputs: [ tuple_8_111_09_min_1, tuple_8_111_09_min_2, 111 ],
  expected_output: tuple_a_not_b_111
}]);

generate_udf_test("tuple_sketch_int64_get_estimate_seed", [{
  inputs: [ tuple_a_not_b_111, 111 ],
  expected_output: 2.2222222810910086
}]);

generate_udf_test("tuple_sketch_int64_jaccard_similarity_seed", [{
  inputs: [ tuple_8_111_09_min_1, tuple_8_111_09_min_2, 111 ],
  expected_output: `STRUCT(0.05868247546115801 AS lower_bound, 0.2 AS estimate, 0.4517325934817119 AS upper_bound)`
}]);

const tuple_8_111_09_max_3 = `FROM_BASE64('AwMJAQAajNMDAAAAAAAAAAAAAAAAMzNzpIWo8+CEJzgBAAAAAAAAACCibaX/wM1AAQAAAAAAAADExpvpLnp1SAEAAAAAAAAA')`;

generate_udaf_test("tuple_sketch_int64_agg_int64_lgk_seed_p_mode", {
  input_columns: [`value`, `1`, 'STRUCT(8 AS lgk, 111 AS seed, 0.9 AS p, "MAX" AS mode) NOT AGGREGATE'],
  input_rows: `SELECT * FROM UNNEST([1, 2, 3]) AS value`,
  expected_output: tuple_8_111_09_max_3
});

const tuple_8_111_09_max_4 = `FROM_BASE64('AwMJAQAajNMDAAAAAAAAAAAAAAAAMzNzTrdXenJE1wACAAAAAAAAANlaaoMLu9UFAgAAAAAAAAAgom2l/8DNQAIAAAAAAAAA')`;

generate_udaf_test("tuple_sketch_int64_agg_int64_lgk_seed_p_mode", {
  input_columns: [`value`, `2`, 'STRUCT(8 AS lgk, 111 AS seed, 0.9 AS p, "MAX" AS mode) NOT AGGREGATE'],
  input_rows: `SELECT * FROM UNNEST([3, 4, 5]) AS value`,
  expected_output: tuple_8_111_09_max_4
});

const tuple_union_8_111_09_max = `FROM_BASE64('AwMJAQAajNMFAAAAAAAAAAAAAAAAMzNzTrdXenJE1wACAAAAAAAAANlaaoMLu9UFAgAAAAAAAACkhajz4IQnOAEAAAAAAAAAIKJtpf/AzUACAAAAAAAAAMTGm+kuenVIAQAAAAAAAAA=')`;

generate_udaf_test("tuple_sketch_int64_agg_union_lgk_seed_mode", {
  input_columns: [`sketch`, 'STRUCT(8 AS lgk, 111 AS seed, "MAX" AS mode) NOT AGGREGATE'],
  input_rows: `SELECT * FROM UNNEST([${tuple_8_111_09_max_3}, ${tuple_8_111_09_max_4}]) AS sketch`,
  expected_output: tuple_union_8_111_09_max
});

generate_udf_test("tuple_sketch_int64_get_estimate_and_bounds_seed", [{
  inputs: [ tuple_union_8_111_09_max, 3, 111 ],
  expected_output: `STRUCT(5.5555557027275215 AS estimate, 5 AS lower_bound, 11 AS upper_bound)`
}]);

generate_udf_test("tuple_sketch_int64_get_theta_seed", [{
  inputs: [ tuple_union_8_111_09_max, 111 ],
  expected_output: 0.8999999761581421
}]);

generate_udf_test("tuple_sketch_int64_get_num_retained_seed", [{
  inputs: [ tuple_union_8_111_09_max, 111 ],
  expected_output: 5
}]);

generate_udf_test("tuple_sketch_int64_from_theta_sketch_seed", [{
  inputs: [ `FROM_BASE64('AgQDPgEajNMAAAAAADMzcwNbX0hyljVFUBHLpzFb/p08wnWFIBcXdIA=')`, 1, 111 ],
  expected_output: tuple_8_111_09_min_1
}]);

generate_udf_test("tuple_sketch_int64_get_sum_estimate_and_bounds_seed", [{
  inputs: [ tuple_union_8_111_09_max, 2, 111 ],
  expected_output: `STRUCT(8.888889124364034 AS sum_estimate, 8 AS sum_lower_bound, 14.399999999999999 AS sum_upper_bound)`
}]);

generate_udf_test("tuple_sketch_int64_filter_low_high_seed", [{
  inputs: [ tuple_union_8_111_09_max, 1, 1, 111 ],
  expected_output: `FROM_BASE64('AwMJAQAajNMCAAAAAAAAAAAAAAAAMzNzpIWo8+CEJzgBAAAAAAAAAMTGm+kuenVIAQAAAAAAAAA=')`
}]);
