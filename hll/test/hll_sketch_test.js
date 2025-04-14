
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

generate_udaf_test("hll_sketch_agg_string", {
  input_columns: [`str`],
  input_rows: `SELECT * FROM UNNEST([CAST(NULL AS STRING), CAST(NULL AS STRING), CAST(NULL AS STRING)]) AS str`,
  expected_output: null
});

generate_udaf_test("hll_sketch_agg_int64", {
  input_columns: [`value`],
  input_rows: `SELECT * FROM UNNEST([NULL, NULL, NULL]) AS value`,
  expected_output: null
});

generate_udaf_test("hll_sketch_agg_union", {
  input_columns: [`sketch`],
  input_rows: `SELECT * FROM UNNEST([CAST(NULL AS BYTES), CAST(NULL AS BYTES), CAST(NULL AS BYTES)]) AS sketch`,
  expected_output: null
});

const hll_1 = `FROM_BASE64('AgEHDAMIAwAvgjsECv+ABG8Z3AY=')`;

generate_udaf_test("hll_sketch_agg_string", {
  input_columns: [`str`],
  input_rows: `SELECT * FROM UNNEST(['a', 'b', 'c']) AS str`,
  expected_output: hll_1
});

const hll_2 = `FROM_BASE64('AgEHDAMIAwBvGdwGwL9qEp160As=')`;

generate_udaf_test("hll_sketch_agg_string", {
  input_columns: [`str`],
  input_rows: `SELECT * FROM UNNEST(['c', 'd', 'e']) AS str`,
  expected_output: hll_2
});

generate_udf_test("hll_sketch_union", [{
  inputs: [ `CAST(NULL AS BYTES)`, `CAST(NULL AS BYTES)` ],
  expected_output: null
}]);

generate_udf_test("hll_sketch_union", [{
  inputs: [ hll_1, `CAST(NULL AS BYTES)` ],
  expected_output: hll_1
}]);

generate_udf_test("hll_sketch_union", [{
  inputs: [ `CAST(NULL AS BYTES)`, hll_2 ],
  expected_output: hll_2
}]);

const hll_union_1 = `FROM_BASE64('AgEHDAMIBQAvgjsECv+ABG8Z3AbAv2oSnXrQCw==')`;

generate_udf_test("hll_sketch_union", [{
  inputs: [ hll_1, hll_2 ],
  expected_output: hll_union_1
}]);

generate_udf_test("hll_sketch_get_estimate", [{
  inputs: [ `CAST(NULL AS BYTES)` ],
  expected_output: null
}]);

generate_udf_test("hll_sketch_get_estimate", [{
  inputs: [ hll_union_1 ],
  expected_output: 5.000000049670538
}]);

generate_udf_test("hll_sketch_to_string", [{
  inputs: [ `CAST(NULL AS BYTES)` ],
  expected_output: null
}]);

generate_udf_test("hll_sketch_to_string", [{
  inputs: [ hll_union_1 ],
  expected_output: `'''### HLL sketch summary:
  Log Config K   : 12
  Hll Target     : HLL_4
  Current Mode   : LIST
  LB             : 5
  Estimate       : 5
  UB             : 5.00025
  OutOfOrder flag: false
  Coupon count   : 5
### End HLL sketch summary
'''`
}]);

const hll_3 = `FROM_BASE64('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')`;

generate_udaf_test("hll_sketch_agg_int64", {
  input_columns: [`value`],
  input_rows: `SELECT * FROM UNNEST(GENERATE_ARRAY(1, 10000, 1)) AS value`,
  expected_output: hll_3
});

const hll_4 = `FROM_BASE64('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')`;

generate_udaf_test("hll_sketch_agg_int64", {
  input_columns: [`value`],
  input_rows: `SELECT * FROM UNNEST(GENERATE_ARRAY(100000, 110000, 1)) AS value`,
  expected_output: hll_4
});

const hll_union_2 = `FROM_BASE64('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')`;

generate_udaf_test("hll_sketch_agg_union", {
  input_columns: [`sketch`],
  input_rows: `SELECT * FROM UNNEST([${hll_3}, ${hll_4}]) AS sketch`,
  expected_output: hll_union_2
});

generate_udf_test("hll_sketch_get_estimate_and_bounds", [{
  inputs: [ `CAST(NULL AS BYTES)`, 3 ],
  expected_output: null
}]);

generate_udf_test("hll_sketch_get_estimate_and_bounds", [{
  inputs: [ hll_union_2, 3 ],
  expected_output: `STRUCT(20250.985334743167 AS estimate, 19292.57752380849 AS lower_bound, 21249.1304948276 AS upper_bound)`
}]);


// using full signatures

const hll_8_hll6_1 = `FROM_BASE64('AgEHCAMIAwQvgjsECv+ABG8Z3AY=')`;

generate_udaf_test("hll_sketch_agg_string_lgk_type", {
  input_columns: [`str`, 'STRUCT(8 AS lgk, "HLL_6" AS type) NOT AGGREGATE'],
  input_rows: `SELECT * FROM UNNEST(['a', 'b', 'c']) AS str`,
  expected_output: hll_8_hll6_1
});

const hll_8_hll6_2 = `FROM_BASE64('AgEHCAMIAwRvGdwGwL9qEp160As=')`;

generate_udaf_test("hll_sketch_agg_string_lgk_type", {
  input_columns: [`str`, 'STRUCT(8 AS lgk, "HLL_6" AS type) NOT AGGREGATE'],
  input_rows: `SELECT * FROM UNNEST(['c', 'd', 'e']) AS str`,
  expected_output: hll_8_hll6_2
});

const hll_union_8_hll6_1 = `FROM_BASE64('AgEHCAMIBQQvgjsECv+ABG8Z3AbAv2oSnXrQCw==')`;

generate_udf_test("hll_sketch_union_lgk_type", [{
  inputs: [ hll_8_hll6_1, hll_8_hll6_2, 8, `"HLL_6"` ],
  expected_output: hll_union_8_hll6_1
}]);

generate_udf_test("hll_sketch_get_estimate", [{
  inputs: [ hll_union_8_hll6_1 ],
  expected_output: 5.000000049670538
}]);

generate_udf_test("hll_sketch_to_string", [{
  inputs: [ hll_union_8_hll6_1 ],
  expected_output: `'''### HLL sketch summary:
  Log Config K   : 8
  Hll Target     : HLL_6
  Current Mode   : LIST
  LB             : 5
  Estimate       : 5
  UB             : 5.00025
  OutOfOrder flag: false
  Coupon count   : 5
### End HLL sketch summary
'''`
}]);

const hll_8_hll6_3 = `FROM_BASE64('CgEHCAAIAAam0v3qmrTDQAAAAADwBxJAAAAAAAAAAAAAAAAAAAAAAEhRIIxRIAhiHMVhGIeBIEmSGAaCFMtRGMqRFAlBNAZhIARiHEeCGMVhIAhyHEVhGISRGAhRFMdhIMqBIMmhIEhxHMVhHIaBGIlxJMRBHEdRGIZRGMhRGIRhEMdiHEWBFApxFINjGAqyGEyxHIWBFIZBIAdyGMZhGMZhEAiRHApSFIZRKIRxGEZhGEZiGMdhHAdTHAWSGIVSGARxGAZRJEdiHIeBGIZxHEdhHIdBJIlhGEVhFAphFIWRHIdREEVRGAA=')`;

generate_udaf_test("hll_sketch_agg_int64_lgk_type", {
  input_columns: [`value`, 'STRUCT(8 AS lgk, "HLL_6" AS type) NOT AGGREGATE'],
  input_rows: `SELECT * FROM UNNEST(GENERATE_ARRAY(1, 10000, 1)) AS value`,
  expected_output: hll_8_hll6_3
});

const hll_8_hll6_4 = `FROM_BASE64('CgEHCAAIAAYaGqx/Y6bCQAAAAAA4NRNAAAAAAAAAAAAAAAAAAAAAAAdCFAZiGEZhFIhhHEZxEAZyGEZiGIlBIIRRFIeBGISBGAeBHIdBGMhTHARCHIVxFMaRFEhhGAZiEEiiGEZRHIaRGISBHAZhMIphGEtxEE5BGEdRHEdhGMdRFAhyNIhxHIVxHEVxHEVRGMVBIEeSGAVSKAZSLIZhHAVRFEZhHAVxIIZhFIdBFEZiFIZRFIWBHIVxJAhyFMdhEElxLEiBFEVhFEaBIEphJEVSHEWBFElxEEeSHMVxGAhxFEZxGApjGAA=')`;

generate_udaf_test("hll_sketch_agg_int64_lgk_type", {
  input_columns: [`value`, 'STRUCT(8 AS lgk, "HLL_6" AS type) NOT AGGREGATE'],
  input_rows: `SELECT * FROM UNNEST(GENERATE_ARRAY(100000, 110000, 1)) AS value`,
  expected_output: hll_8_hll6_4
});

const hll_union_8_hll6_2 = `FROM_BASE64('CgEHCAAYAAYAAAAAAAAAAAAAAABQSgJAAAAAAAAAAAAAAAAAAAAAAAhSIAxiIAhiHMhhHIeBIEmSGEaCGMtRIMqRFImBNIaBIAeCHEeCGMhjIAhyHIVxGMaRGEhhGAdiIEqiIMmhIIiRHMWBHIaBMIpxJMtxHE5RGIdRHMhhGMdhFMhyNIiBHIpxHIVzHAqyGMyxIEeSGAZSKAdyLMZhHMZhFEiRHApyIIZhKIdxGEZiGEZiGMeBHAdzJAiSGIdiGElxLEiBJEdiHIeBIIpxJEdiHIeBJIlxGEeSHMpxGIiRHIdxGApjGAA=')`;

generate_udaf_test("hll_sketch_agg_union_lgk_type", {
  input_columns: [`sketch`, 'STRUCT(8 AS lgk, "HLL_6" AS type) NOT AGGREGATE'],
  input_rows: `SELECT * FROM UNNEST([${hll_8_hll6_3}, ${hll_8_hll6_4}]) AS sketch`,
  expected_output: hll_union_8_hll6_2
});

generate_udf_test("hll_sketch_get_estimate_and_bounds", [{
  inputs: [ hll_union_8_hll6_2, 3 ],
  expected_output: `STRUCT(20589.9367655959 AS estimate, 16893.540168045525 AS lower_bound, 24930.66787891017 AS upper_bound)`
}]);
