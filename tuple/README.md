<!--
    Licensed to the Apache Software Foundation (ASF) under one
    or more contributor license agreements.  See the NOTICE file
    distributed with this work for additional information
    regarding copyright ownership.  The ASF licenses this file
    to you under the Apache License, Version 2.0 (the
    "License"); you may not use this file except in compliance
    with the License.  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing,
    software distributed under the License is distributed on an
    "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, either express or implied.  See the License for the
    specific language governing permissions and limitations
    under the License.
-->

# Apache DataSketches Tuple Sketches for Google BigQuery

Tuple sketches extend the functionality of Theta sketches by
allowing you to associate a summary value with each item in the set. This
enables calculations like the sum, minimum, or maximum of values associated with
the distinct items.

Please visit 
[Tuple Sketches](https://datasketches.apache.org/docs/Tuple/TupleSketches.html) 
for more information about this sketch family.

Please visit the main 
[Apache DataSketches website](https://datasketches.apache.org) 
for more information about DataSketches library.

If you are interested in making contributions to this project please see our 
[Community](https://datasketches.apache.org/docs/Community/) 
page for how to contact us.

| Function Name | Function Type | Signature | Description |
|---|---|---|---|
| [tuple_sketch_int64_agg_union](../definitions/tuple/tuple_sketch_int64_agg_union.sqlx) | AGGREGATE | (sketch BYTES) -> BYTES | Builds a Tuple Sketch that represents the UNION of the given column of Tuple Sketches.\<br\>Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.\<br\>This function only applies to Tuple Sketches with an INT64 summary column.\<br\>\<br\>Param sketch: the given column of Tuple Sketches with an INT64 summary column. This may not be NULL.\<br\>Defaults: lg\_k = 12, seed = 9001, mode = SUM.\<br\>Returns: a Compact Tuple Sketch as BYTES.  |
| [tuple_sketch_int64_agg_string](../definitions/tuple/tuple_sketch_int64_agg_string.sqlx) | AGGREGATE | (key STRING, value INT64) -> BYTES | Builds a Tuple Sketch from an STRING Key column and an INT64 value column.\<br\>Multiple values for the same key are aggregated using the default mode.\<br\>Note that cardinality estimation accuracy, plots, error tables, and sampling probability p are the same as the Theta Sketch.\<br\>This function only applies to Tuple Sketches with an STRING Key column and an INT64 summary column.\<br\> \<br\>Param key: the STRING column of identifiers. This may not be NULL.\<br\>Param value: the INT64 value column associated with each key. This may not be NULL.\<br\>Defaults: lg\_k = 12, seed = 9001, p = 1.0, mode = SUM.\<br\>Returns: a Compact Tuple Sketch as BYTES. |
| [tuple_sketch_int64_agg_int64](../definitions/tuple/tuple_sketch_int64_agg_int64.sqlx) | AGGREGATE | (key INT64, value INT64) -> BYTES | Builds a Tuple Sketch from an INT64 Key column and an INT64 value column.\<br\>Multiple values for the same key are aggregated using the default mode.\<br\>Note that cardinality estimation accuracy, plots, error tables, and sampling probability p are the same as the Theta Sketch.\<br\>This function only applies to Tuple Sketches with an INT64 Key column and an INT64 summary column.\<br\>\<br\>Param key: the INT64 key column of identifiers. This may not be NULL.\<br\>Param value: the INT64 value column associated with each key. This may not be NULL.\<br\>Defaults: lg\_k = 12, seed = 9001, p = 1.0, mode = SUM.\<br\>Returns: a Compact Tuple Sketch as BYTES. |
| [tuple_sketch_int64_agg_union_lgk_seed_mode](../definitions/tuple/tuple_sketch_int64_agg_union_lgk_seed_mode.sqlx) | AGGREGATE | (sketch BYTES, params STRUCT<lg_k BYTEINT, seed INT64, mode STRING> NOT AGGREGATE) -> BYTES | Builds a Tuple Sketch that represents the UNION of the given column of Tuple Sketches.\<br\>Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.\<br\>This function only applies to Tuple Sketches with an INT64 summary column.\<br\>\<br\>Param sketch: the given column of Tuple Sketches with an INT64 summary column. This may not be NULL.\<br\>Param lg\_k: the sketch accuracy/size parameter as an integer in the range \[4, 26\]. A NULL specifies the default lg\_k of 12.\<br\>Param seed: the seed to be used by the underlying hash function. A NULL specifies the default seed of 9001.\<br\>Param mode:  aggregation mode for the summary field: one of { SUM, MIN, MAX, ONE \(constant 1\) }. A NULL specifies the default = SUM.\<br\>Returns: a Compact Tuple Sketch as BYTES. |
| [tuple_sketch_int64_agg_int64_lgk_seed_p_mode](../definitions/tuple/tuple_sketch_int64_agg_int64_lgk_seed_p_mode.sqlx) | AGGREGATE | (key INT64, value INT64, params STRUCT<lg_k BYTEINT, seed INT64, p FLOAT64, mode STRING> NOT AGGREGATE) -> BYTES | Builds a Tuple Sketch from an INT64 Key column and an INT64 value column.\<br\>Multiple values for the same key are aggregated using one of the selectable operations: { SUM, MIN, MAX, ONE \(constant 1\) }.\<br\>Note that cardinality estimation accuracy, plots, error tables, and sampling probability p are the same as the Theta Sketch.\<br\>This function only applies to Tuple Sketches with an INT64 Key column and an INT64 summary column.\<br\>\<br\>Param key: the INT64 key column of identifiers. This may not be NULL.\<br\>Param value: the INT64 value column associated with each key. This may not be NULL.\<br\>Param lg\_k: the sketch accuracy/size parameter as an integer in the range \[4, 26\]. A NULL specifies the default lg\_k of 12.\<br\>Param seed: the seed to be used by the underlying hash function. A NULL specifies the default seed of 9001.\<br\>Param p: up\-front sampling probability. A NULL specifies the default of 1.0.\<br\>Param mode:  aggregation mode for the summary field: one of { SUM, MIN, MAX, ONE \(constant 1\) }. A NULL specifies the default = SUM.\<br\>Returns: a Compact Tuple Sketch as BYTES. |
| [tuple_sketch_int64_agg_string_lgk_seed_p_mode](../definitions/tuple/tuple_sketch_int64_agg_string_lgk_seed_p_mode.sqlx) | AGGREGATE | (key STRING, value INT64, params STRUCT<lg_k BYTEINT, seed INT64, p FLOAT64, mode STRING> NOT AGGREGATE) -> BYTES | Builds a Tuple Sketch from an STRING Key column and an INT64 value column.\<br\>Multiple values for the same key are aggregated using one of the selectable operations: SUM, MIN, MAX, ONE.\<br\>Note that cardinality estimation accuracy, plots, error tables, and sampling probability p are the same as the Theta Sketch.\<br\>This function only applies to Tuple Sketches with an STRING Key column and an INT64 summary column.\<br\>\<br\>Param key: the STRING key column of identifiers. This may not be NULL.\<br\>Param value: the INT64 value column associated with each key. This may not be NULL.\<br\>Param lg\_k: the sketch accuracy/size parameter as an integer in the range \[4, 26\]. A NULL specifies the default lg\_k of 12.\<br\>Param seed: the seed to be used by the underlying hash function. A NULL specifies the default seed of 9001.\<br\>Param p: up\-front sampling probability. A NULL specifies the default of 1.0.\<br\>Param mode:  aggregation mode for the summary field: one of { SUM, MIN, MAX, ONE \(constant 1\) }. A NULL specifies the default = SUM.\<br\>Returns: a Compact Tuple Sketch as BYTES. |
| [tuple_sketch_int64_to_string](../definitions/tuple/tuple_sketch_int64_to_string.sqlx) | SCALAR | (sketch BYTES) -> STRING | Returns a human readable STRING that is a short summary of the state of this sketch.\<br\>  Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.\<br\>  This function only applies to Tuple Sketches with an INT64 summary column.\<br\>\<br\>Param sketch: the sketch to be summarized. This may not be NULL.\<br\>Defaults: seed = 9001.\<br\>Returns: A human readable STRING that is a short summary of the state of this sketch. |
| [tuple_sketch_int64_get_estimate](../definitions/tuple/tuple_sketch_int64_get_estimate.sqlx) | SCALAR | (sketch BYTES) -> FLOAT64 | Returns the cardinality estimate of the given Tuple Sketch.\<br\>Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.\<br\>This function only applies to Tuple Sketches with an INT64 summary column.\<br\>  \<br\>Param sketch: the given Tuple Sketch. This may not be NULL.\<br\>Defaults: seed = 9001.\<br\>Returns: the cardinality estimate of the given Tuple Sketch |
| [tuple_sketch_int64_get_theta](../definitions/tuple/tuple_sketch_int64_get_theta.sqlx) | SCALAR | (sketch BYTES) -> FLOAT64 | Returns theta \(effective sampling rate\) as a fraction from 0 to 1.\<br\>Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.\<br\>This function only applies to Tuple Sketches with an INT64 summary column.\<br\>  \<br\>Param sketch: the given Tuple Sketch. This may not be NULL.\<br\>Defaults: seed = 9001.\<br\>Returns: theta as FLOAT64. |
| [tuple_sketch_int64_get_num_retained](../definitions/tuple/tuple_sketch_int64_get_num_retained.sqlx) | SCALAR | (sketch BYTES) -> INT | Returns the number of retained entries in the given sketch.\<br\>Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.\<br\>This function only applies to Tuple Sketches with an INT64 summary column.\<br\>  \<br\>Param sketch: the given Tuple Sketch. This may not be NULL.\<br\>Defaults: seed = 9001.\<br\>Returns: number of retained entries as INT. |
| [tuple_sketch_int64_get_theta_seed](../definitions/tuple/tuple_sketch_int64_get_theta_seed.sqlx) | SCALAR | (sketch BYTES, seed INT64) -> FLOAT64 | Returns theta \(effective sampling rate\) as a fraction from 0 to 1.\<br\>Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.\<br\>This function only applies to Tuple Sketches with an INT64 summary column.\<br\>  \<br\>Param sketch: the given Tuple Sketch. This may not be NULL.\<br\>Param seed: This is used to confirm that the given sketches were configured with the correct seed. A NULL specifies the default seed = 9001.\<br\>Returns: theta as FLOAT64. |
| [tuple_sketch_int64_get_num_retained_seed](../definitions/tuple/tuple_sketch_int64_get_num_retained_seed.sqlx) | SCALAR | (sketch BYTES, seed INT64) -> INT | Returns the number of retained entries in the given sketch.\<br\>Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.\<br\>This function only applies to Tuple Sketches with an INT64 summary column.\<br\>  \<br\>Param sketch: the given Tuple Sketch. This may not be NULL.\<br\>Param seed: This is used to confirm that the given sketches were configured with the correct seed. A NULL specifies the default seed = 9001.\<br\>Returns: number of retained entries as INT. |
| [tuple_sketch_int64_to_string_seed](../definitions/tuple/tuple_sketch_int64_to_string_seed.sqlx) | SCALAR | (sketch BYTES, seed INT64) -> STRING | Returns a human readable STRING that is a short summary of the state of this sketch.\<br\>  Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.\<br\>  This function only applies to Tuple Sketches with an INT64 summary column.\<br\>\<br\>Param sketch: the sketch to be summarized. This may not be NULL.\<br\>Param seed: This is used to confirm that the given sketches were configured with the correct seed. A NULL specifies the default seed = 9001.\<br\>Returns: A human readable STRING that is a short summary of the state of this sketch. |
| [tuple_sketch_int64_a_not_b](../definitions/tuple/tuple_sketch_int64_a_not_b.sqlx) | SCALAR | (sketchA BYTES, sketchB BYTES) -> BYTES | Computes a sketch that represents the set difference of sketchA and not sketchB.\<br\>Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.\<br\>This function only applies to Tuple Sketches with an INT64 summary column. \<br\>  \<br\>Param sketchA: the first sketch "A" as BYTES. This may not be NULL.\<br\>Param sketchB: the second sketch "B" as BYTES. This may not be NULL.\<br\>Defaults: seed = 9001.\<br\>Returns: a Compact Tuple Sketch as BYTES. |
| [tuple_sketch_int64_from_theta_sketch](../definitions/tuple/tuple_sketch_int64_from_theta_sketch.sqlx) | SCALAR | (sketch BYTES, value INT64) -> BYTES | Converts the given Theta Sketch into a Tuple Sketch with a INT64 summary column set to the given INT64 value.\<br\>Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.\<br\>\<br\>Param sketch: the given Theta Sketch. This may not be NULL.\<br\>Param value: the given INT64 value. This may not be NULL.\<br\>Defaults: seed = 9001.\<br\>Returns: a Tuple Sketch with an INT64 summary column as BYTES. |
| [tuple_sketch_int64_get_estimate_seed](../definitions/tuple/tuple_sketch_int64_get_estimate_seed.sqlx) | SCALAR | (sketch BYTES, seed INT64) -> FLOAT64 | Returns the cardinality estimate of the given Tuple Sketch.\<br\>Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.\<br\>This function only applies to Tuple Sketches with an INT64 summary column.\<br\>  \<br\>Param sketch: the given Tuple Sketch. This may not be NULL.\<br\>Param seed: This is used to confirm that the given sketches were configured with the correct seed. A NULL specifies the default seed = 9001.\<br\>Returns: the cardinality estimate of the given Tuple Sketch |
| [tuple_sketch_int64_intersection](../definitions/tuple/tuple_sketch_int64_intersection.sqlx) | SCALAR | (sketchA BYTES, sketchB BYTES) -> BYTES | Computes a sketch that represents the scalar intersection of sketchA and sketchB.\<br\>Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.\<br\>This function only applies to Tuple Sketches with an INT64 summary column.\<br\>\<br\>Param sketchA: the first sketch "A" as BYTES.\<br\>Param sketchB: the second sketch "B" as BYTES.\<br\>Defaults: seed = 9001.\<br\>Returns: a Compact Tuple Sketch as BYTES. |
| [tuple_sketch_int64_union](../definitions/tuple/tuple_sketch_int64_union.sqlx) | SCALAR | (sketchA BYTES, sketchB BYTES) -> BYTES | Computes a Tuple Sketch that represents the UNION of sketchA and sketchB.\<br\>Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.\<br\>This function only applies to Tuple Sketches with an INT64 summary column.\<br\>\<br\>Param sketchA: the first sketch "A" as BYTES. This may not be NULL.\<br\>Param sketchB: the second sketch "B" as BYTES. This may not be NULL.\<br\>Defaults: seed = 9001.\<br\>Returns: a Compact Tuple Sketch as BYTES. |
| [tuple_sketch_int64_from_theta_sketch_seed](../definitions/tuple/tuple_sketch_int64_from_theta_sketch_seed.sqlx) | SCALAR | (sketch BYTES, value INT64, seed INT64) -> BYTES | Converts the given Theta Sketch into a Tuple Sketch with a INT64 summary column set to the given INT64 value.\<br\>Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.\<br\>\<br\>Param sketch: the given Theta Sketch. This may not be NULL.\<br\>Param value: the given INT64 value. This may not be NULL.\<br\>Param seed: This is used to confirm that the given sketches were configured with the correct seed. A NULL specifies the default seed = 9001.\<br\>Returns: a Tuple Sketch with an INT64 summary column as BYTES. |
| [tuple_sketch_int64_a_not_b_seed](../definitions/tuple/tuple_sketch_int64_a_not_b_seed.sqlx) | SCALAR | (sketchA BYTES, sketchB BYTES, seed INT64) -> BYTES | Computes a sketch that represents the scalar set difference of sketchA and not sketchB.\<br\>Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.\<br\>This function only applies to Tuple Sketches with an INT64 summary column.\<br\>\<br\>Param sketchA: the first sketch "A" as BYTES. This may not be NULL.\<br\>Param sketchB: the second sketch "B" as BYTES. This may not be NULL.\<br\>Param seed: This is used to confirm that the given sketches were configured with the correct seed. A NULL specifies the default seed = 9001.\<br\>Returns: a Compact Tuple Sketch as BYTES. |
| [tuple_sketch_int64_filter_low_high](../definitions/tuple/tuple_sketch_int64_filter_low_high.sqlx) | SCALAR | (sketch BYTES, low INT64, high INT64) -> BYTES | Returns a Tuple Sketch computed from the given sketch filtered by the given low and high values. \<br\>This returns a compact tuple sketch that contains the subset of rows of the give sketch where the\<br\>summary column is greater\-than or equal to the given low and less\-than or equal to the given high.\<br\>Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.\<br\>This function only applies to Tuple Sketches with an INT64 summary column.\<br\>\<br\>Param sketch: the given Tuple Sketch. This may not be NULL.\<br\>Param low: the given low INT64. This may not be NULL.\<br\>Param high: the given high INT64. This may not be NULL.\<br\>Defaults: seed = 9001.\<br\>Returns: a Compact Tuple Sketch as BYTES. |
| [tuple_sketch_int64_get_estimate_and_bounds](../definitions/tuple/tuple_sketch_int64_get_estimate_and_bounds.sqlx) | SCALAR | (sketch BYTES, num_std_devs BYTEINT) -> STRUCT<estimate FLOAT64, lower_bound FLOAT64, upper_bound FLOAT64> | Returns the cardinality estimate and bounds from the given Tuple Sketch.\<br\>Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.\<br\>This function only applies to Tuple Sketches with an INT64 summary column.\<br\>  \<br\>Param sketch: the given Tuple Sketch. This may not be NULL.\<br\>Param num\_std\_devs: The returned bounds will be based on the statistical confidence interval\<br\>  determined by the given number of standard deviations from the returned estimate.\<br\>  This number may be one of {1,2,3}, where 1 represents 68% confidence,\<br\>  2 represents 95% confidence and 3 represents 99.7% confidence.\<br\>  For example, if the given num\_std\_devs = 2 and the returned values are {1000, 990, 1010}\<br\>  that means that with 95% confidence, the true value lies within the range \[990, 1010\].\<br\>Defaults: seed = 9001.\<br\>Returns: a STRUCT with three FLOAT64 values as {estimate, lower\_bound, upper\_bound}. |
| [tuple_sketch_int64_filter_low_high_seed](../definitions/tuple/tuple_sketch_int64_filter_low_high_seed.sqlx) | SCALAR | (sketch BYTES, low INT64, high INT64, seed INT64) -> BYTES | Returns a Tuple Sketch computed from the given sketch filtered by the given low and high values. \<br\>This returns a compact tuple sketch that contains the subset of rows of the give sketch where the\<br\>summary column is greater\-than or equal to the given low and less\-than or equal to the given high.\<br\>Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.\<br\>This function only applies to Tuple Sketches with an INT64 summary column.\<br\>\<br\>Param sketch: the given Tuple Sketch. This may not be NULL.\<br\>Param low: the given low INT64. This may not be NULL.\<br\>Param high: the given high INT64. This may not be NULL.\<br\>Param seed: This is used to confirm that the given sketches were configured with the correct seed. A NULL specifies the default seed = 9001.\<br\>Returns: a Compact Tuple Sketch as BYTES. |
| [tuple_sketch_int64_jaccard_similarity](../definitions/tuple/tuple_sketch_int64_jaccard_similarity.sqlx) | SCALAR | (sketchA BYTES, sketchB BYTES) -> STRUCT<lower_bound FLOAT64, estimate FLOAT64, upper_bound FLOAT64> | Computes the Jaccard similarity index with upper and lower bounds.\<br\>The Jaccard similarity index J\(A,B\) = \(A ^ B\)/\(A U B\) is used to measure how similar the two sketches are to each other.\<br\>If J = 1.0, the sketches are considered equal. If J = 0, the two sketches are disjoint.\<br\>A Jaccard of .95 means the overlap between the two sets is 95% of the union of the two sets.\<br\>This function only applies to Tuple Sketches with an INT64 summary column.\<br\>\<br\>Param sketchA: the first sketch as bytes. This may not be NULL.\<br\>Param sketchB: the second sketch as bytes. This may not be NULL.\<br\>Defaults: seed = 9001.\<br\>Returns: a STRUCT with three FLOAT64 values {lower\_bound, estimate, upper\_bound} of the Jaccard index. |
| [tuple_sketch_int64_get_sum_estimate_and_bounds](../definitions/tuple/tuple_sketch_int64_get_sum_estimate_and_bounds.sqlx) | SCALAR | (sketch BYTES, num_std_devs BYTEINT) -> STRUCT<sum_estimate FLOAT64, sum_lower_bound FLOAT64, sum_upper_bound FLOAT64> | Returns the estimate and bounds for the sum of the INT64 summary column\<br\>scaled to the original population from the given Tuple Sketch.\<br\>Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.\<br\>This function only applies to Tuple Sketches with an INT64 summary column.\<br\>  \<br\>Param sketch: the given Tuple Sketch. This may not be NULL.\<br\>Param num\_std\_devs: The returned bounds will be based on the statistical confidence interval\<br\>  determined by the given number of standard deviations from the returned estimate.\<br\>  This number may be one of {1,2,3}, where 1 represents 68% confidence,\<br\>  2 represents 95% confidence and 3 represents 99.7% confidence.\<br\>  For example, if the given num\_std\_devs = 2 and the returned values are {1000, 990, 1010}\<br\>  that means that with 95% confidence, the true value lies within the range \[990, 1010\].\<br\>Defaults: seed = 9001.\<br\>Returns: a STRUCT with three FLOAT64 values as {sum\_estimate, sum\_lower\_bound, sum\_upper\_bound}. |
| [tuple_sketch_int64_intersection_seed_mode](../definitions/tuple/tuple_sketch_int64_intersection_seed_mode.sqlx) | SCALAR | (sketchA BYTES, sketchB BYTES, seed INT64, mode STRING) -> BYTES | Computes a sketch that represents the scalar intersection of sketchA and sketchB.\<br\>Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.\<br\>This function only applies to Tuple Sketches with an INT64 summary column.\<br\>\<br\>Param sketchA: the first sketch "A" as BYTES.\<br\>Param sketchB: the second sketch "B" as BYTES.\<br\>Param seed: This is used to confirm that the given sketches were configured with the correct seed. A NULL specifies the default seed = 9001.\<br\>Returns: a Compact Tuple Sketch as BYTES. |
| [tuple_sketch_int64_get_sum_estimate_and_bounds_seed](../definitions/tuple/tuple_sketch_int64_get_sum_estimate_and_bounds_seed.sqlx) | SCALAR | (sketch BYTES, num_std_devs BYTEINT, seed INT64) -> STRUCT<sum_estimate FLOAT64, sum_lower_bound FLOAT64, sum_upper_bound FLOAT64> | Returns the estimate and bounds for the sum of the INT64 summary column\<br\>scaled to the original population from the given Tuple Sketch.\<br\>Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.\<br\>This function only applies to Tuple Sketches with an INT64 summary column.\<br\>\<br\>Param sketch: the given Tuple Sketch. This may not be NULL.\<br\>Param num\_std\_devs: The returned bounds will be based on the statistical confidence interval\<br\>  determined by the given number of standard deviations from the returned estimate.\<br\>  This number may be one of {1,2,3}, where 1 represents 68% confidence,\<br\>  2 represents 95% confidence and 3 represents 99.7% confidence.\<br\>  For example, if the given num\_std\_devs = 2 and the returned values are {1000, 990, 1010}\<br\>  that means that with 95% confidence, the true value lies within the range \[990, 1010\].\<br\>Param seed: This is used to confirm that the given sketches were configured with the correct seed. A NULL specifies the default seed = 9001.\<br\>Returns: a STRUCT with three FLOAT64 values as {sum\_estimate, sum\_lower\_bound, sum\_upper\_bound}. |
| [tuple_sketch_int64_union_lgk_seed_mode](../definitions/tuple/tuple_sketch_int64_union_lgk_seed_mode.sqlx) | SCALAR | (sketchA BYTES, sketchB BYTES, lg_k BYTEINT, seed INT64, mode STRING) -> BYTES | Computes a Tuple Sketch that represents the UNION of sketchA and sketchB.\<br\>Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.\<br\>This function only applies to Tuple Sketches with an INT64 summary column.\<br\>\<br\>Param sketchA: the first sketch "A" as BYTES. This may not be NULL.\<br\>Param sketchB: the second sketch "B" as BYTES. This may not be NULL.\<br\>Param seed: This is used to confirm that the given sketches were configured with the correct seed. A NULL specifies the default seed = 9001.\<br\>Returns: a Compact Tuple Sketch as BYTES. |
| [tuple_sketch_int64_get_estimate_and_bounds_seed](../definitions/tuple/tuple_sketch_int64_get_estimate_and_bounds_seed.sqlx) | SCALAR | (sketch BYTES, num_std_devs BYTEINT, seed INT64) -> STRUCT<estimate FLOAT64, lower_bound FLOAT64, upper_bound FLOAT64> | Returns the cardinality estimate and bounds from the given Tuple Sketch.\<br\>Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.\<br\>This function only applies to Tuple Sketches with an INT64 summary column.\<br\>  \<br\>Param sketch: the given Tuple Sketch. This may not be NULL.\<br\>Param num\_std\_devs: The returned bounds will be based on the statistical confidence interval\<br\>  determined by the given number of standard deviations from the returned estimate.\<br\>  This number may be one of {1,2,3}, where 1 represents 68% confidence,\<br\>  2 represents 95% confidence and 3 represents 99.7% confidence.\<br\>  For example, if the given num\_std\_devs = 2 and the returned values are {1000, 990, 1010}\<br\>  that means that with 95% confidence, the true value lies within the range \[990, 1010\].\<br\>Param seed: This is used to confirm that the given sketches were configured with the correct seed. A NULL specifies the default seed = 9001.\<br\>Returns: a STRUCT with three FLOAT64 values as {estimate, lower\_bound, upper\_bound}. |
| [tuple_sketch_int64_jaccard_similarity_seed](../definitions/tuple/tuple_sketch_int64_jaccard_similarity_seed.sqlx) | SCALAR | (sketchA BYTES, sketchB BYTES, seed INT64) -> STRUCT<lower_bound FLOAT64, estimate FLOAT64, upper_bound FLOAT64> | Computes the Jaccard similarity index with upper and lower bounds.\<br\>The Jaccard similarity index J\(A,B\) = \(A ^ B\)/\(A U B\) is used to measure how similar the two sketches are to each other.\<br\>If J = 1.0, the sketches are considered equal. If J = 0, the two sketches are disjoint.\<br\>A Jaccard of .95 means the overlap between the two sets is 95% of the union of the two sets.\<br\>This function only applies to Tuple Sketches with an INT64 summary column.\<br\>\<br\>Param sketchA: the first sketch as bytes. This may not be NULL.\<br\>Param sketchB: the second sketch as bytes. This may not be NULL.\<br\>Param seed: This is used to confirm that the given sketches were configured with the correct seed. A NULL specifies the default seed = 9001.\<br\>Returns: a STRUCT with three FLOAT64 values {lower\_bound, estimate, upper\_bound} of the Jaccard index. |

**Examples:**

```sql

# using defaults
create or replace table `$BQ_DATASET`.tuple_sketch(sketch bytes);

insert into `$BQ_DATASET`.tuple_sketch
(select `$BQ_DATASET`.tuple_sketch_int64_from_theta_sketch(`$BQ_DATASET`.theta_sketch_agg_string(cast(value as string)), 1) from unnest(GENERATE_ARRAY(1, 10000, 1)) as value);
insert into `$BQ_DATASET`.tuple_sketch
(select `$BQ_DATASET`.tuple_sketch_int64_from_theta_sketch(`$BQ_DATASET`.theta_sketch_agg_string(cast(value as string)), 1) from unnest(GENERATE_ARRAY(100000, 110000, 1)) as value);

# expected about 20000
select `$BQ_DATASET`.tuple_sketch_int64_get_estimate(
  `$BQ_DATASET`.tuple_sketch_int64_agg_union(sketch)
) from `$BQ_DATASET`.tuple_sketch;

select `$BQ_DATASET`.tuple_sketch_int64_get_estimate_and_bounds(
  `$BQ_DATASET`.tuple_sketch_int64_agg_union(sketch),
  2
) from `$BQ_DATASET`.tuple_sketch;

select `$BQ_DATASET`.tuple_sketch_int64_get_sum_estimate_and_bounds(
  `$BQ_DATASET`.tuple_sketch_int64_agg_union(sketch),
  2
) from `$BQ_DATASET`.tuple_sketch;

# expected estimate about 20000
select `$BQ_DATASET`.tuple_sketch_int64_to_string(
  `$BQ_DATASET`.tuple_sketch_int64_agg_union(sketch)
) from `$BQ_DATASET`.tuple_sketch;

select `$BQ_DATASET`.tuple_sketch_int64_get_theta(
  `$BQ_DATASET`.tuple_sketch_int64_agg_union(sketch)
) from `$BQ_DATASET`.tuple_sketch;

select `$BQ_DATASET`.tuple_sketch_int64_get_num_retained(
  `$BQ_DATASET`.tuple_sketch_int64_agg_union(sketch)
) from `$BQ_DATASET`.tuple_sketch;

drop table `$BQ_DATASET`.tuple_sketch;

# using full signatures
create or replace table `$BQ_DATASET`.tuple_sketch(sketch bytes);

insert into `$BQ_DATASET`.tuple_sketch
(select `$BQ_DATASET`.tuple_sketch_int64_from_theta_sketch_seed(
  `$BQ_DATASET`.theta_sketch_agg_string_lgk_seed_p(cast(value as string), STRUCT<BYTEINT, INT64, FLOAT64>(10, 111, 0.999)),
  1,
  111
) from unnest(GENERATE_ARRAY(1, 10000, 1)) as value);
insert into `$BQ_DATASET`.tuple_sketch
(select `$BQ_DATASET`.tuple_sketch_int64_from_theta_sketch_seed(
  `$BQ_DATASET`.theta_sketch_agg_string_lgk_seed_p(cast(value as string), STRUCT<BYTEINT, INT64, FLOAT64>(10, 111, 0.999)),
  1,
  111
) from unnest(GENERATE_ARRAY(100000, 110000, 1)) as value);

# expected about 20000
select `$BQ_DATASET`.tuple_sketch_int64_get_estimate_seed(
  `$BQ_DATASET`.tuple_sketch_int64_agg_union_lgk_seed_mode(sketch, STRUCT<BYTEINT, INT64, STRING>(10, 111, "NOP")),
  111
) from `$BQ_DATASET`.tuple_sketch;

select `$BQ_DATASET`.tuple_sketch_int64_get_estimate_and_bounds_seed(
  `$BQ_DATASET`.tuple_sketch_int64_agg_union_lgk_seed_mode(sketch, STRUCT<BYTEINT, INT64, STRING>(10, 111, "NOP")),
  2,
  111
) from `$BQ_DATASET`.tuple_sketch;

select `$BQ_DATASET`.tuple_sketch_int64_get_sum_estimate_and_bounds_seed(
  `$BQ_DATASET`.tuple_sketch_int64_agg_union_lgk_seed_mode(sketch, STRUCT<BYTEINT, INT64, STRING>(10, 111, "NOP")),
  2,
  111
) from `$BQ_DATASET`.tuple_sketch;

# expected estimate about 20000
select `$BQ_DATASET`.tuple_sketch_int64_to_string_seed(
  `$BQ_DATASET`.tuple_sketch_int64_agg_union_lgk_seed_mode(sketch, STRUCT<BYTEINT, INT64, STRING>(10, 111, "NOP")),
  111
) from `$BQ_DATASET`.tuple_sketch;

select `$BQ_DATASET`.tuple_sketch_int64_get_theta_seed(
  `$BQ_DATASET`.tuple_sketch_int64_agg_union_lgk_seed_mode(sketch, STRUCT<BYTEINT, INT64, STRING>(10, 111, "NOP")),
  111
) from `$BQ_DATASET`.tuple_sketch;

select `$BQ_DATASET`.tuple_sketch_int64_get_num_retained_seed(
  `$BQ_DATASET`.tuple_sketch_int64_agg_union_lgk_seed_mode(sketch, STRUCT<BYTEINT, INT64, STRING>(10, 111, "NOP")),
  111
) from `$BQ_DATASET`.tuple_sketch;

drop table `$BQ_DATASET`.tuple_sketch;


# using defaults
# expected 5
select `$BQ_DATASET`.tuple_sketch_int64_get_estimate(
  `$BQ_DATASET`.tuple_sketch_int64_union(
    (select `$BQ_DATASET`.tuple_sketch_int64_agg_int64(key, 1) from unnest([1, 2, 3]) as key),
    (select `$BQ_DATASET`.tuple_sketch_int64_agg_int64(key, 1) from unnest([3, 4, 5]) as key)
  )
);

# using full signatures
# expected 5
select `$BQ_DATASET`.tuple_sketch_int64_get_estimate_seed(
  `$BQ_DATASET`.tuple_sketch_int64_union_lgk_seed_mode(
    (select `$BQ_DATASET`.tuple_sketch_int64_agg_int64_lgk_seed_p_mode(key, 1, STRUCT<BYTEINT, INT64, FLOAT64, STRING>(10, 111, 0.999, "MIN")) from unnest([1, 2, 3]) as key),
    (select `$BQ_DATASET`.tuple_sketch_int64_agg_int64_lgk_seed_p_mode(key, 1, STRUCT<BYTEINT, INT64, FLOAT64, STRING>(10, 111, 0.999, "MIN")) from unnest([3, 4, 5]) as key),
    10,
    111,
    "MIN"
  ),
  111
);

# using defaults
# expected 1
select `$BQ_DATASET`.tuple_sketch_int64_get_estimate(
  `$BQ_DATASET`.tuple_sketch_int64_intersection(
    (select `$BQ_DATASET`.tuple_sketch_int64_agg_string(str, 1) from unnest(["a", "b", "c"]) as str),
    (select `$BQ_DATASET`.tuple_sketch_int64_agg_string(str, 1) from unnest(["c", "d", "e"]) as str)
  )
);

# using full signatures
# expected 1
select `$BQ_DATASET`.tuple_sketch_int64_get_estimate_seed(
  `$BQ_DATASET`.tuple_sketch_int64_intersection_seed_mode(
    (select `$BQ_DATASET`.tuple_sketch_int64_agg_string_lgk_seed_p_mode(str, 1, STRUCT<BYTEINT, INT64, FLOAT64, STRING>(10, 111, 0.999, "MIN")) from unnest(["a", "b", "c"]) as str),
    (select `$BQ_DATASET`.tuple_sketch_int64_agg_string_lgk_seed_p_mode(str, 1, STRUCT<BYTEINT, INT64, FLOAT64, STRING>(10, 111, 0.999, "MIN")) from unnest(["c", "d", "e"]) as str),
    111,
    "MIN"
  ),
  111
);

# using defaults
# expected 2
select `$BQ_DATASET`.tuple_sketch_int64_get_estimate(
  `$BQ_DATASET`.tuple_sketch_int64_a_not_b(
    (select `$BQ_DATASET`.tuple_sketch_int64_agg_string(str, 1) from unnest(["a", "b", "c"]) as str),
    (select `$BQ_DATASET`.tuple_sketch_int64_agg_string(str, 1) from unnest(["c", "d", "e"]) as str)
  )
);

# using full signatures
# expected 2
select `$BQ_DATASET`.tuple_sketch_int64_get_estimate_seed(
  `$BQ_DATASET`.tuple_sketch_int64_a_not_b_seed(
    (select `$BQ_DATASET`.tuple_sketch_int64_agg_string_lgk_seed_p_mode(str, 1, STRUCT<BYTEINT, INT64, FLOAT64, STRING>(10, 111, 0.999, "MIN")) from unnest(["a", "b", "c"]) as str),
    (select `$BQ_DATASET`.tuple_sketch_int64_agg_string_lgk_seed_p_mode(str, 1, STRUCT<BYTEINT, INT64, FLOAT64, STRING>(10, 111, 0.999, "MIN")) from unnest(["c", "d", "e"]) as str),
    111
  ),
  111
);

# using defaults
# expected 0.2
select `$BQ_DATASET`.tuple_sketch_int64_jaccard_similarity(
  (select `$BQ_DATASET`.tuple_sketch_int64_agg_string(str, 1) from unnest(["a", "b", "c"]) as str),
  (select `$BQ_DATASET`.tuple_sketch_int64_agg_string(str, 1) from unnest(["c", "d", "e"]) as str)
);

# using full signatures
# expected 0.2
select `$BQ_DATASET`.tuple_sketch_int64_jaccard_similarity_seed(
  (select `$BQ_DATASET`.tuple_sketch_int64_agg_string_lgk_seed_p_mode(str, 1, STRUCT<BYTEINT, INT64, FLOAT64, STRING>(10, 111, 0.999, "NOP")) from unnest(["a", "b", "c"]) as str),
  (select `$BQ_DATASET`.tuple_sketch_int64_agg_string_lgk_seed_p_mode(str, 1, STRUCT<BYTEINT, INT64, FLOAT64, STRING>(10, 111, 0.999, "NOP")) from unnest(["c", "d", "e"]) as str),
  111
);

# using defaults
# expected 1 entry
select `$BQ_DATASET`.tuple_sketch_int64_to_string(
  `$BQ_DATASET`.tuple_sketch_int64_filter_low_high(
    `$BQ_DATASET`.tuple_sketch_int64_agg_string(key, 1),
    2,
    2
  )
) from unnest(["a", "b", "c", "c"]) as key;

# using full signatures
# expected 1 entry
select `$BQ_DATASET`.tuple_sketch_int64_to_string_seed(
  `$BQ_DATASET`.tuple_sketch_int64_filter_low_high_seed(
    `$BQ_DATASET`.tuple_sketch_int64_agg_string_lgk_seed_p_mode(key, 1, STRUCT<BYTEINT, INT64, FLOAT64, STRING>(10, 111, 0.999, "SUM")),
    2,
    2,
    111
  ),
  111
) from unnest(["a", "b", "c", "c"]) as key;
```
