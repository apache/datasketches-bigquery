
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

generate_udaf_test("frequent_strings_sketch_build", {
  input_columns: [`str`, `1`, `5 NOT AGGREGATE`],
  input_rows: `SELECT * FROM UNNEST([CAST(NULL AS STRING), CAST(NULL AS STRING), CAST(NULL AS STRING)]) AS str`,
  expected_output: null
});

generate_udaf_test("frequent_strings_sketch_merge", {
  input_columns: [`sketch`, `5 NOT AGGREGATE`],
  input_rows: `SELECT * FROM UNNEST([CAST(NULL AS BYTES), CAST(NULL AS BYTES), CAST(NULL AS BYTES)]) AS sketch`,
  expected_output: null
});

const fi_1 = `FROM_BASE64('BAEKBQMAAAADAAAAAAAAAAMAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAEAAAAAAAAAAQAAAAAAAAABAAAAYQEAAABiAQAAAGM=')`;

generate_udaf_test("frequent_strings_sketch_build", {
  input_columns: [`str`, `1`, `5 NOT AGGREGATE`],
  input_rows: `SELECT * FROM UNNEST(['a', 'b', 'c']) AS str`,
  expected_output: fi_1
});

const fi_2 = `FROM_BASE64('BAEKBQMAAAACAAAAAAAAAAMAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAEAAAAAAAAAAQAAAGEBAAAAYg==')`;

generate_udaf_test("frequent_strings_sketch_build", {
  input_columns: [`str`, `1`, `5 NOT AGGREGATE`],
  input_rows: `SELECT * FROM UNNEST(['a', 'b', 'a']) AS str`,
  expected_output: fi_2
});


const fi_3 = `FROM_BASE64('BAEKBQMAAAADAAAAAAAAAAYAAAAAAAAAAAAAAAAAAAADAAAAAAAAAAIAAAAAAAAAAQAAAAAAAAABAAAAYQEAAABiAQAAAGM=')`;

generate_udaf_test("frequent_strings_sketch_merge", {
  input_columns: [`sketch`, `5 NOT AGGREGATE`],
  input_rows: `SELECT * FROM UNNEST([${fi_1}, ${fi_2}]) AS sketch`,
  expected_output: fi_3
});

generate_udf_test("frequent_strings_sketch_to_string", [{
  inputs: [ `CAST(NULL AS BYTES)` ],
  expected_output: null
}]);

generate_udf_test("frequent_strings_sketch_to_string", [{
  inputs: [ fi_3 ],
  expected_output: `'''### Frequent items sketch summary:
   lg cur map size  : 3
   lg max map size  : 5
   num active items : 3
   total weight     : 6
   max error        : 0
### End sketch summary
'''`
}]);

generate_udf_test("frequent_strings_sketch_get_result", [{
  inputs: [ `CAST(NULL AS BYTES)`, `"NO_FALSE_POSITIVES"`, `NULL` ],
  expected_output: `[]`
}]);

generate_udf_test("frequent_strings_sketch_get_result", [{
  inputs: [ fi_3, `"NO_FALSE_POSITIVES"`, `NULL` ],
  expected_output: `[STRUCT('a' AS item, 3 AS estimate, 3 AS lower_bound, 3 AS upper_bound), STRUCT('b' AS item, 2 AS estimate, 2 AS lower_bound, 2 AS upper_bound), STRUCT('c' AS item, 1 AS estimate, 1 AS lower_bound, 1 AS upper_bound)]`
}]);

generate_udf_test("frequent_strings_sketch_get_result", [{
  inputs: [ fi_3, `"NO_FALSE_NEGATIVES"`, `2` ],
  expected_output: `[STRUCT('a' AS item, 3 AS estimate, 3 AS lower_bound, 3 AS upper_bound)]`
}]);
