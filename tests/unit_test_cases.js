
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

const { generate_udf_test, generate_udaf_test } = require('./unit_test_utils');

generate_udaf_test("frequent_strings_sketch_build", {
  input_columns: [`item`, `weight`, '5 NOT AGGREGATE'],
  input_rows: `SELECT item, 1 as weight
   FROM UNNEST(['a', 'a', 'c']) as item`,
  expected_output: `FROM_BASE64('BAEKBQMAAAACAAAAAAAAAAMAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAEAAAAAAAAAAQAAAGEBAAAAYw==')`,
});

generate_udaf_test("frequent_strings_sketch_merge", {
  input_columns: [`sketch`, `5 NOT AGGREGATE`],
  input_rows: `SELECT * FROM UNNEST([
      FROM_BASE64('BAEKBQMAAAACAAAAAAAAAAMAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAEAAAAAAAAAAQAAAGEBAAAAYw=='),
      FROM_BASE64('BAEKBQMAAAACAAAAAAAAAAMAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAEAAAAAAAAAAQAAAGEBAAAAYw==')
    ]) AS sketch`,
  expected_output: `FROM_BASE64('BAEKBQMAAAACAAAAAAAAAAYAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAIAAAAAAAAAAQAAAGEBAAAAYw==')`,
});