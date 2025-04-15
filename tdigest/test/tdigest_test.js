
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

generate_udaf_test("tdigest_double_build", {
  input_columns: [`value`],
  input_rows: `SELECT * FROM UNNEST([NULL, NULL, NULL, NULL, NULL]) AS value`,
  expected_output: null
});

generate_udaf_test("tdigest_double_merge", {
  input_columns: [`sketch`],
  input_rows: `SELECT * FROM UNNEST([CAST(NULL AS BYTES), CAST(NULL AS BYTES), CAST(NULL AS BYTES)]) AS sketch`,
  expected_output: null
});

const td_1 = `FROM_BASE64('AgEUyAAEAAAKAAAAAAAAAAAAAAAAAPA/AAAAAAAAJEAAAAAAAADwPwEAAAAAAAAAAAAAAAAAAEABAAAAAAAAAAAAAAAAAAhAAQAAAAAAAAAAAAAAAAAQQAEAAAAAAAAAAAAAAAAAFEABAAAAAAAAAAAAAAAAABhAAQAAAAAAAAAAAAAAAAAcQAEAAAAAAAAAAAAAAAAAIEABAAAAAAAAAAAAAAAAACJAAQAAAAAAAAAAAAAAAAAkQAEAAAAAAAAA')`;

generate_udaf_test("tdigest_double_build", {
  input_columns: [`value`],
  input_rows: `SELECT * FROM UNNEST([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) AS value`,
  expected_output: td_1
});

const td_2 = `FROM_BASE64('AgEUyAAEAAAKAAAAAAAAAAAAAAAAACZAAAAAAAAANEAAAAAAAAAmQAEAAAAAAAAAAAAAAAAAKEABAAAAAAAAAAAAAAAAACpAAQAAAAAAAAAAAAAAAAAsQAEAAAAAAAAAAAAAAAAALkABAAAAAAAAAAAAAAAAADBAAQAAAAAAAAAAAAAAAAAxQAEAAAAAAAAAAAAAAAAAMkABAAAAAAAAAAAAAAAAADNAAQAAAAAAAAAAAAAAAAA0QAEAAAAAAAAA')`;

generate_udaf_test("tdigest_double_build", {
  input_columns: [`value`],
  input_rows: `SELECT * FROM UNNEST([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]) AS value`,
  expected_output: td_2
});

const td_3 = `FROM_BASE64('AgEUyAAAAAAUAAAAAAAAAAAAAAAAAPA/AAAAAAAANEAAAAAAAADwPwEAAAAAAAAAAAAAAAAAAEABAAAAAAAAAAAAAAAAAAhAAQAAAAAAAAAAAAAAAAAQQAEAAAAAAAAAAAAAAAAAFEABAAAAAAAAAAAAAAAAABhAAQAAAAAAAAAAAAAAAAAcQAEAAAAAAAAAAAAAAAAAIEABAAAAAAAAAAAAAAAAACJAAQAAAAAAAAAAAAAAAAAkQAEAAAAAAAAAAAAAAAAAJkABAAAAAAAAAAAAAAAAAChAAQAAAAAAAAAAAAAAAAAqQAEAAAAAAAAAAAAAAAAALEABAAAAAAAAAAAAAAAAAC5AAQAAAAAAAAAAAAAAAAAwQAEAAAAAAAAAAAAAAAAAMUABAAAAAAAAAAAAAAAAADJAAQAAAAAAAAAAAAAAAAAzQAEAAAAAAAAAAAAAAAAANEABAAAAAAAAAA==')`;

generate_udaf_test("tdigest_double_merge", {
  input_columns: [`sketch`],
  input_rows: `SELECT * FROM UNNEST([${td_1}, ${td_2}]) AS sketch`,
  expected_output: td_3
});

generate_udf_test("tdigest_double_to_string", [{
  inputs: [ `CAST(NULL AS BYTES)` ],
  expected_output: null
}]);

generate_udf_test("tdigest_double_to_string", [{
  inputs: [ td_3 ],
  expected_output: `'''### t-Digest summary:
   Nominal k          : 200
   Centroids          : 20
   Buffered           : 0
   Centroids capacity : 410
   Buffer capacity    : 1640
   Centroids Weight   : 20
   Total Weight       : 20
   Reverse Merge      : false
   Min                : 1
   Max                : 20
### End t-Digest summary
'''`
}]);

generate_udf_test("tdigest_double_get_rank", [{
  inputs: [ `CAST(NULL AS BYTES)`, 10 ],
  expected_output: null
}]);

generate_udf_test("tdigest_double_get_rank", [{
  inputs: [ td_3, 10 ],
  expected_output: 0.475
}]);

generate_udf_test("tdigest_double_get_quantile", [{
  inputs: [ `CAST(NULL AS BYTES)`, 0.5 ],
  expected_output: null
}]);

generate_udf_test("tdigest_double_get_quantile", [{
  inputs: [ td_3, 0.5 ],
  expected_output: 11
}]);

generate_udf_test("tdigest_double_get_min_value", [{
  inputs: [ `CAST(NULL AS BYTES)` ],
  expected_output: null
}]);

generate_udf_test("tdigest_double_get_min_value", [{
  inputs: [ td_3 ],
  expected_output: 1
}]);

generate_udf_test("tdigest_double_get_max_value", [{
  inputs: [ `CAST(NULL AS BYTES)` ],
  expected_output: null
}]);

generate_udf_test("tdigest_double_get_max_value", [{
  inputs: [ td_3 ],
  expected_output: 20
}]);

generate_udf_test("tdigest_double_get_total_weight", [{
  inputs: [ `CAST(NULL AS BYTES)` ],
  expected_output: null
}]);

generate_udf_test("tdigest_double_get_total_weight", [{
  inputs: [ td_3 ],
  expected_output: 20
}]);

// using full signatures

const td_4 = `FROM_BASE64('AgEUZAAEAAAKAAAAAAAAAAAAAAAAAPA/AAAAAAAAJEAAAAAAAADwPwEAAAAAAAAAAAAAAAAAAEABAAAAAAAAAAAAAAAAAAhAAQAAAAAAAAAAAAAAAAAQQAEAAAAAAAAAAAAAAAAAFEABAAAAAAAAAAAAAAAAABhAAQAAAAAAAAAAAAAAAAAcQAEAAAAAAAAAAAAAAAAAIEABAAAAAAAAAAAAAAAAACJAAQAAAAAAAAAAAAAAAAAkQAEAAAAAAAAA')`;

generate_udaf_test("tdigest_double_build_k", {
  input_columns: [`value`, `100 NOT AGGREGATE`],
  input_rows: `SELECT * FROM UNNEST([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) AS value`,
  expected_output: td_4
});

const td_5 = `FROM_BASE64('AgEUZAAEAAAKAAAAAAAAAAAAAAAAACZAAAAAAAAANEAAAAAAAAAmQAEAAAAAAAAAAAAAAAAAKEABAAAAAAAAAAAAAAAAACpAAQAAAAAAAAAAAAAAAAAsQAEAAAAAAAAAAAAAAAAALkABAAAAAAAAAAAAAAAAADBAAQAAAAAAAAAAAAAAAAAxQAEAAAAAAAAAAAAAAAAAMkABAAAAAAAAAAAAAAAAADNAAQAAAAAAAAAAAAAAAAA0QAEAAAAAAAAA')`;

generate_udaf_test("tdigest_double_build_k", {
  input_columns: [`value`, `100 NOT AGGREGATE`],
  input_rows: `SELECT * FROM UNNEST([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]) AS value`,
  expected_output: td_5
});

const td_6 = `FROM_BASE64('AgEUZAAAAAAUAAAAAAAAAAAAAAAAAPA/AAAAAAAANEAAAAAAAADwPwEAAAAAAAAAAAAAAAAAAEABAAAAAAAAAAAAAAAAAAhAAQAAAAAAAAAAAAAAAAAQQAEAAAAAAAAAAAAAAAAAFEABAAAAAAAAAAAAAAAAABhAAQAAAAAAAAAAAAAAAAAcQAEAAAAAAAAAAAAAAAAAIEABAAAAAAAAAAAAAAAAACJAAQAAAAAAAAAAAAAAAAAkQAEAAAAAAAAAAAAAAAAAJkABAAAAAAAAAAAAAAAAAChAAQAAAAAAAAAAAAAAAAAqQAEAAAAAAAAAAAAAAAAALEABAAAAAAAAAAAAAAAAAC5AAQAAAAAAAAAAAAAAAAAwQAEAAAAAAAAAAAAAAAAAMUABAAAAAAAAAAAAAAAAADJAAQAAAAAAAAAAAAAAAAAzQAEAAAAAAAAAAAAAAAAANEABAAAAAAAAAA==')`;

generate_udaf_test("tdigest_double_merge_k", {
  input_columns: [`sketch`, `100 NOT AGGREGATE`],
  input_rows: `SELECT * FROM UNNEST([${td_4}, ${td_5}]) AS sketch`,
  expected_output: td_6
});
