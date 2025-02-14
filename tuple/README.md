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

Tuple sketches extend the functionality of Theta sketches by adding a Summary object associated
with each distinct key retained by the sketch. When the identifier of an input pair (identifier, value) matches a unique
key of the sketch, the associated Summary of that key can be modified based on user-defined policy.

The set of all Summary values collected by the sketch represents a uniform random sample of the unique identifiers
as opposed to a uniform random sample of all raw inputs.
This enables the use of common statistical computations of the Summary values, which can be extrapolated to the entire
set of unique identifiers.

The underlying C++ library supports Summary objects of any type (including complex types) and arbitrary policies
of updating Summaries during the sketch building process, and combining these Summaries during union and intersection set operations.

The current set of functions for BigQuery implements Summary objects as INT64 (unsigned in C++) with SUM, MIN, MAX, ONE (constant 1) policies (modes).
This enables calculations like the sum, average, minimum, or maximum of the Summary values associated with the distinct keys.

This implementation can serve as an example of how to implement Tuple sketch with a Summary type and policy of your choice.
We are open to suggestions on what Summary types and policies to consider for inclusion here.

Please visit 
[Tuple Sketches](https://datasketches.apache.org/docs/Tuple/TupleSketches.html) 
for more information about this sketch family.

Please visit the main 
[Apache DataSketches website](https://datasketches.apache.org) 
for more information about DataSketches library.

If you are interested in making contributions to this project please see our 
[Community](https://datasketches.apache.org/docs/Community/) 
page for how to contact us.

## Aggregate Functions

### [tuple_sketch_int64_agg_union(sketch BYTES)](../tuple/sqlx/tuple_sketch_int64_agg_union.sqlx)
Builds a Tuple Sketch that represents the UNION of the given column of Tuple Sketches.
Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.
This function only applies to Tuple Sketches with an INT64 summary column.

* Param sketch: the given column of Tuple Sketches with an INT64 summary column. This may not be NULL.
* Defaults: lg\_k = 12, seed = 9001, mode = SUM.
* Returns: a Compact Tuple Sketch as BYTES. 

### [tuple_sketch_int64_agg_string(key STRING, value INT64)](../tuple/sqlx/tuple_sketch_int64_agg_string.sqlx)
Builds a Tuple Sketch from a STRING Key column and an INT64 value column.
Multiple values for the same key are aggregated using the default mode.
Note that cardinality estimation accuracy, plots, error tables, and sampling probability p are the same as the Theta Sketch.
This function only applies to Tuple Sketches with a STRING Key column and an INT64 summary column.
 
* Param key: the STRING column of identifiers. This may not be NULL.
* Param value: the INT64 value column associated with each key. This may not be NULL.
* Defaults: lg\_k = 12, seed = 9001, p = 1.0, mode = SUM.
* Returns: a Compact Tuple Sketch as BYTES.

### [tuple_sketch_int64_agg_int64(key INT64, value INT64)](../tuple/sqlx/tuple_sketch_int64_agg_int64.sqlx)
Builds a Tuple Sketch from an INT64 Key column and an INT64 value column.
Multiple values for the same key are aggregated using the default mode.
Note that cardinality estimation accuracy, plots, error tables, and sampling probability p are the same as the Theta Sketch.
This function only applies to Tuple Sketches with an INT64 Key column and an INT64 summary column.

* Param key: the INT64 key column of identifiers. This may not be NULL.
* Param value: the INT64 value column associated with each key. This may not be NULL.
* Defaults: lg\_k = 12, seed = 9001, p = 1.0, mode = SUM.
* Returns: a Compact Tuple Sketch as BYTES.

### [tuple_sketch_int64_agg_union_lgk_seed_mode(sketch BYTES, params STRUCT<lg_k BYTEINT, seed INT64, mode STRING> NOT AGGREGATE)](../tuple/sqlx/tuple_sketch_int64_agg_union_lgk_seed_mode.sqlx)
Builds a Tuple Sketch that represents the UNION of the given column of Tuple Sketches.
Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.
This function only applies to Tuple Sketches with an INT64 summary column.

* Param sketch: the given column of Tuple Sketches with an INT64 summary column. This may not be NULL.
* Param lg\_k: the sketch accuracy/size parameter as an integer in the range \[4, 26\]. A NULL specifies the default lg\_k of 12.
* Param seed: the seed to be used by the underlying hash function. A NULL specifies the default seed of 9001.
* Param mode:  aggregation mode for the summary field: one of { SUM, MIN, MAX, ONE \(constant 1\) }. A NULL specifies the default = SUM.
* Returns: a Compact Tuple Sketch as BYTES.

### [tuple_sketch_int64_agg_int64_lgk_seed_p_mode(key INT64, value INT64, params STRUCT<lg_k BYTEINT, seed INT64, p FLOAT64, mode STRING> NOT AGGREGATE)](../tuple/sqlx/tuple_sketch_int64_agg_int64_lgk_seed_p_mode.sqlx)
Builds a Tuple Sketch from an INT64 Key column and an INT64 value column.
Multiple values for the same key are aggregated using one of the selectable operations: { SUM, MIN, MAX, ONE \(constant 1\) }.
Note that cardinality estimation accuracy, plots, error tables, and sampling probability p are the same as the Theta Sketch.
This function only applies to Tuple Sketches with an INT64 Key column and an INT64 summary column.

* Param key: the INT64 key column of identifiers. This may not be NULL.
* Param value: the INT64 value column associated with each key. This may not be NULL.
* Param lg\_k: the sketch accuracy/size parameter as an integer in the range \[4, 26\]. A NULL specifies the default lg\_k of 12.
* Param seed: the seed to be used by the underlying hash function. A NULL specifies the default seed of 9001.
* Param p: up\-front sampling probability. A NULL specifies the default of 1.0.
* Param mode:  aggregation mode for the summary field: one of { SUM, MIN, MAX, ONE \(constant 1\) }. A NULL specifies the default = SUM.
* Returns: a Compact Tuple Sketch as BYTES.

### [tuple_sketch_int64_agg_string_lgk_seed_p_mode(key STRING, value INT64, params STRUCT<lg_k BYTEINT, seed INT64, p FLOAT64, mode STRING> NOT AGGREGATE)](../tuple/sqlx/tuple_sketch_int64_agg_string_lgk_seed_p_mode.sqlx)
Builds a Tuple Sketch from a STRING Key column and an INT64 value column.
Multiple values for the same key are aggregated using one of the selectable operations: SUM, MIN, MAX, ONE.
Note that cardinality estimation accuracy, plots, error tables, and sampling probability p are the same as the Theta Sketch.
This function only applies to Tuple Sketches with a STRING Key column and an INT64 summary column.

* Param key: the STRING key column of identifiers. This may not be NULL.
* Param value: the INT64 value column associated with each key. This may not be NULL.
* Param lg\_k: the sketch accuracy/size parameter as an integer in the range \[4, 26\]. A NULL specifies the default lg\_k of 12.
* Param seed: the seed to be used by the underlying hash function. A NULL specifies the default seed of 9001.
* Param p: up\-front sampling probability. A NULL specifies the default of 1.0.
* Param mode:  aggregation mode for the summary field: one of { SUM, MIN, MAX, ONE \(constant 1\) }. A NULL specifies the default = SUM.
* Returns: a Compact Tuple Sketch as BYTES.

## Scalar Functions

### [tuple_sketch_int64_to_string(sketch BYTES)](../tuple/sqlx/tuple_sketch_int64_to_string.sqlx)
Returns a human readable STRING that is a short summary of the state of this sketch.
  Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.
  This function only applies to Tuple Sketches with an INT64 summary column.

* Param sketch: the sketch to be summarized. This may not be NULL.
* Defaults: seed = 9001.
* Returns: A human readable STRING that is a short summary of the state of this sketch.

### [tuple_sketch_int64_get_estimate(sketch BYTES)](../tuple/sqlx/tuple_sketch_int64_get_estimate.sqlx)
Returns the cardinality estimate of the given Tuple Sketch.
Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.
This function only applies to Tuple Sketches with an INT64 summary column.
  
* Param sketch: the given Tuple Sketch. This may not be NULL.
* Defaults: seed = 9001.
* Returns: the cardinality estimate of the given Tuple Sketch

### [tuple_sketch_int64_get_theta(sketch BYTES)](../tuple/sqlx/tuple_sketch_int64_get_theta.sqlx)
Returns theta \(effective sampling rate\) as a fraction from 0 to 1.
Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.
This function only applies to Tuple Sketches with an INT64 summary column.
  
* Param sketch: the given Tuple Sketch. This may not be NULL.
* Defaults: seed = 9001.
* Returns: theta as FLOAT64.

### [tuple_sketch_int64_get_num_retained(sketch BYTES)](../tuple/sqlx/tuple_sketch_int64_get_num_retained.sqlx)
Returns the number of retained entries in the given sketch.
Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.
This function only applies to Tuple Sketches with an INT64 summary column.
  
* Param sketch: the given Tuple Sketch. This may not be NULL.
* Defaults: seed = 9001.
* Returns: number of retained entries as INT.

### [tuple_sketch_int64_get_theta_seed(sketch BYTES, seed INT64)](../tuple/sqlx/tuple_sketch_int64_get_theta_seed.sqlx)
Returns theta \(effective sampling rate\) as a fraction from 0 to 1.
Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.
This function only applies to Tuple Sketches with an INT64 summary column.
  
* Param sketch: the given Tuple Sketch. This may not be NULL.
* Param seed: This is used to confirm that the given sketches were configured with the correct seed. A NULL specifies the default seed = 9001.
* Returns: theta as FLOAT64.

### [tuple_sketch_int64_get_num_retained_seed(sketch BYTES, seed INT64)](../tuple/sqlx/tuple_sketch_int64_get_num_retained_seed.sqlx)
Returns the number of retained entries in the given sketch.
Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.
This function only applies to Tuple Sketches with an INT64 summary column.
  
* Param sketch: the given Tuple Sketch. This may not be NULL.
* Param seed: This is used to confirm that the given sketches were configured with the correct seed. A NULL specifies the default seed = 9001.
* Returns: number of retained entries as INT.

### [tuple_sketch_int64_to_string_seed(sketch BYTES, seed INT64)](../tuple/sqlx/tuple_sketch_int64_to_string_seed.sqlx)
Returns a human readable STRING that is a short summary of the state of this sketch.
  Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.
  This function only applies to Tuple Sketches with an INT64 summary column.

* Param sketch: the sketch to be summarized. This may not be NULL.
* Param seed: This is used to confirm that the given sketches were configured with the correct seed. A NULL specifies the default seed = 9001.
* Returns: A human readable STRING that is a short summary of the state of this sketch.

### [tuple_sketch_int64_get_estimate_and_bounds(sketch BYTES, num_std_devs BYTEINT)](../tuple/sqlx/tuple_sketch_int64_get_estimate_and_bounds.sqlx)
Returns the cardinality estimate and bounds from the given Tuple Sketch.
Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.
This function only applies to Tuple Sketches with an INT64 summary column.
  
* Param sketch: the given Tuple Sketch. This may not be NULL.
* Param num\_std\_devs: The returned bounds will be based on the statistical confidence interval
  determined by the given number of standard deviations from the returned estimate.
  This number may be one of {1,2,3}, where 1 represents 68% confidence,
  2 represents 95% confidence and 3 represents 99.7% confidence.
  For example, if the given num\_std\_devs = 2 and the returned values are {1000, 990, 1010}
  that means that with 95% confidence, the true value lies within the range \[990, 1010\].
* Defaults: seed = 9001.
* Returns: a STRUCT with three FLOAT64 values as {estimate, lower\_bound, upper\_bound}.

### [tuple_sketch_int64_jaccard_similarity(sketchA BYTES, sketchB BYTES)](../tuple/sqlx/tuple_sketch_int64_jaccard_similarity.sqlx)
Computes the Jaccard similarity index with upper and lower bounds.
The Jaccard similarity index J\(A,B\) = \(A ^ B\)/\(A U B\) is used to measure how similar the two sketches are to each other.
If J = 1.0, the sketches are considered equal. If J = 0, the two sketches are disjoint.
A Jaccard of .95 means the overlap between the two sets is 95% of the union of the two sets.
This function only applies to Tuple Sketches with an INT64 summary column.

* Param sketchA: the first sketch as bytes. This may not be NULL.
* Param sketchB: the second sketch as bytes. This may not be NULL.
* Defaults: seed = 9001.
* Returns: a STRUCT with three FLOAT64 values {lower\_bound, estimate, upper\_bound} of the Jaccard index.

### [tuple_sketch_int64_a_not_b(sketchA BYTES, sketchB BYTES)](../tuple/sqlx/tuple_sketch_int64_a_not_b.sqlx)
Computes a sketch that represents the set difference of sketchA and not sketchB.
Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.
This function only applies to Tuple Sketches with an INT64 summary column. 
  
* Param sketchA: the first sketch "A" as BYTES. This may not be NULL.
* Param sketchB: the second sketch "B" as BYTES. This may not be NULL.
* Defaults: seed = 9001.
* Returns: a Compact Tuple Sketch as BYTES.

### [tuple_sketch_int64_from_theta_sketch(sketch BYTES, value INT64)](../tuple/sqlx/tuple_sketch_int64_from_theta_sketch.sqlx)
Converts the given Theta Sketch into a Tuple Sketch with a INT64 summary column set to the given INT64 value.
Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.

* Param sketch: the given Theta Sketch. This may not be NULL.
* Param value: the given INT64 value. This may not be NULL.
* Defaults: seed = 9001.
* Returns: a Tuple Sketch with an INT64 summary column as BYTES.

### [tuple_sketch_int64_get_sum_estimate_and_bounds(sketch BYTES, num_std_devs BYTEINT)](../tuple/sqlx/tuple_sketch_int64_get_sum_estimate_and_bounds.sqlx)
Returns the estimate and bounds for the sum of the INT64 summary column
scaled to the original population from the given Tuple Sketch.
Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.
This function only applies to Tuple Sketches with an INT64 summary column.
  
* Param sketch: the given Tuple Sketch. This may not be NULL.
* Param num\_std\_devs: The returned bounds will be based on the statistical confidence interval
  determined by the given number of standard deviations from the returned estimate.
  This number may be one of {1,2,3}, where 1 represents 68% confidence,
  2 represents 95% confidence and 3 represents 99.7% confidence.
  For example, if the given num\_std\_devs = 2 and the returned values are {1000, 990, 1010}
  that means that with 95% confidence, the true value lies within the range \[990, 1010\].
* Defaults: seed = 9001.
* Returns: a STRUCT with three FLOAT64 values as {sum\_estimate, sum\_lower\_bound, sum\_upper\_bound}.

### [tuple_sketch_int64_get_estimate_seed(sketch BYTES, seed INT64)](../tuple/sqlx/tuple_sketch_int64_get_estimate_seed.sqlx)
Returns the cardinality estimate of the given Tuple Sketch.
Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.
This function only applies to Tuple Sketches with an INT64 summary column.
  
* Param sketch: the given Tuple Sketch. This may not be NULL.
* Param seed: This is used to confirm that the given sketches were configured with the correct seed. A NULL specifies the default seed = 9001.
* Returns: the cardinality estimate of the given Tuple Sketch

### [tuple_sketch_int64_intersection(sketchA BYTES, sketchB BYTES)](../tuple/sqlx/tuple_sketch_int64_intersection.sqlx)
Computes a sketch that represents the scalar intersection of sketchA and sketchB.
Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.
This function only applies to Tuple Sketches with an INT64 summary column.

* Param sketchA: the first sketch "A" as BYTES.
* Param sketchB: the second sketch "B" as BYTES.
* Defaults: seed = 9001.
* Returns: a Compact Tuple Sketch as BYTES.

### [tuple_sketch_int64_union(sketchA BYTES, sketchB BYTES)](../tuple/sqlx/tuple_sketch_int64_union.sqlx)
Computes a Tuple Sketch that represents the UNION of sketchA and sketchB.
Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.
This function only applies to Tuple Sketches with an INT64 summary column.

* Param sketchA: the first sketch "A" as BYTES. This may not be NULL.
* Param sketchB: the second sketch "B" as BYTES. This may not be NULL.
* Defaults: seed = 9001.
* Returns: a Compact Tuple Sketch as BYTES.

### [tuple_sketch_int64_from_theta_sketch_seed(sketch BYTES, value INT64, seed INT64)](../tuple/sqlx/tuple_sketch_int64_from_theta_sketch_seed.sqlx)
Converts the given Theta Sketch into a Tuple Sketch with a INT64 summary column set to the given INT64 value.
Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.

* Param sketch: the given Theta Sketch. This may not be NULL.
* Param value: the given INT64 value. This may not be NULL.
* Param seed: This is used to confirm that the given sketches were configured with the correct seed. A NULL specifies the default seed = 9001.
* Returns: a Tuple Sketch with an INT64 summary column as BYTES.

### [tuple_sketch_int64_get_sum_estimate_and_bounds_seed(sketch BYTES, num_std_devs BYTEINT, seed INT64)](../tuple/sqlx/tuple_sketch_int64_get_sum_estimate_and_bounds_seed.sqlx)
Returns the estimate and bounds for the sum of the INT64 summary column
scaled to the original population from the given Tuple Sketch.
Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.
This function only applies to Tuple Sketches with an INT64 summary column.

* Param sketch: the given Tuple Sketch. This may not be NULL.
* Param num\_std\_devs: The returned bounds will be based on the statistical confidence interval
  determined by the given number of standard deviations from the returned estimate.
  This number may be one of {1,2,3}, where 1 represents 68% confidence,
  2 represents 95% confidence and 3 represents 99.7% confidence.
  For example, if the given num\_std\_devs = 2 and the returned values are {1000, 990, 1010}
  that means that with 95% confidence, the true value lies within the range \[990, 1010\].
* Param seed: This is used to confirm that the given sketches were configured with the correct seed. A NULL specifies the default seed = 9001.
* Returns: a STRUCT with three FLOAT64 values as {sum\_estimate, sum\_lower\_bound, sum\_upper\_bound}.

### [tuple_sketch_int64_get_estimate_and_bounds_seed(sketch BYTES, num_std_devs BYTEINT, seed INT64)](../tuple/sqlx/tuple_sketch_int64_get_estimate_and_bounds_seed.sqlx)
Returns the cardinality estimate and bounds from the given Tuple Sketch.
Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.
This function only applies to Tuple Sketches with an INT64 summary column.
  
* Param sketch: the given Tuple Sketch. This may not be NULL.
* Param num\_std\_devs: The returned bounds will be based on the statistical confidence interval
  determined by the given number of standard deviations from the returned estimate.
  This number may be one of {1,2,3}, where 1 represents 68% confidence,
  2 represents 95% confidence and 3 represents 99.7% confidence.
  For example, if the given num\_std\_devs = 2 and the returned values are {1000, 990, 1010}
  that means that with 95% confidence, the true value lies within the range \[990, 1010\].
* Param seed: This is used to confirm that the given sketches were configured with the correct seed. A NULL specifies the default seed = 9001.
* Returns: a STRUCT with three FLOAT64 values as {estimate, lower\_bound, upper\_bound}.

### [tuple_sketch_int64_a_not_b_seed(sketchA BYTES, sketchB BYTES, seed INT64)](../tuple/sqlx/tuple_sketch_int64_a_not_b_seed.sqlx)
Computes a sketch that represents the scalar set difference of sketchA and not sketchB.
Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.
This function only applies to Tuple Sketches with an INT64 summary column.

* Param sketchA: the first sketch "A" as BYTES. This may not be NULL.
* Param sketchB: the second sketch "B" as BYTES. This may not be NULL.
* Param seed: This is used to confirm that the given sketches were configured with the correct seed. A NULL specifies the default seed = 9001.
* Returns: a Compact Tuple Sketch as BYTES.

### [tuple_sketch_int64_jaccard_similarity_seed(sketchA BYTES, sketchB BYTES, seed INT64)](../tuple/sqlx/tuple_sketch_int64_jaccard_similarity_seed.sqlx)
Computes the Jaccard similarity index with upper and lower bounds.
The Jaccard similarity index J\(A,B\) = \(A ^ B\)/\(A U B\) is used to measure how similar the two sketches are to each other.
If J = 1.0, the sketches are considered equal. If J = 0, the two sketches are disjoint.
A Jaccard of .95 means the overlap between the two sets is 95% of the union of the two sets.
This function only applies to Tuple Sketches with an INT64 summary column.

* Param sketchA: the first sketch as bytes. This may not be NULL.
* Param sketchB: the second sketch as bytes. This may not be NULL.
* Param seed: This is used to confirm that the given sketches were configured with the correct seed. A NULL specifies the default seed = 9001.
* Returns: a STRUCT with three FLOAT64 values {lower\_bound, estimate, upper\_bound} of the Jaccard index.

### [tuple_sketch_int64_filter_low_high(sketch BYTES, low INT64, high INT64)](../tuple/sqlx/tuple_sketch_int64_filter_low_high.sqlx)
Returns a Tuple Sketch computed from the given sketch filtered by the given low and high values. 
This returns a compact tuple sketch that contains the subset of rows of the given sketch where the
summary column is greater\-than or equal to the given low and less\-than or equal to the given high.
Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.
This function only applies to Tuple Sketches with an INT64 summary column.

* Param sketch: the given Tuple Sketch. This may not be NULL.
* Param low: the given low INT64. This may not be NULL.
* Param high: the given high INT64. This may not be NULL.
* Defaults: seed = 9001.
* Returns: a Compact Tuple Sketch as BYTES.

### [tuple_sketch_int64_filter_low_high_seed(sketch BYTES, low INT64, high INT64, seed INT64)](../tuple/sqlx/tuple_sketch_int64_filter_low_high_seed.sqlx)
Returns a Tuple Sketch computed from the given sketch filtered by the given low and high values. 
This returns a compact tuple sketch that contains the subset of rows of the given sketch where the
summary column is greater\-than or equal to the given low and less\-than or equal to the given high.
Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.
This function only applies to Tuple Sketches with an INT64 summary column.

* Param sketch: the given Tuple Sketch. This may not be NULL.
* Param low: the given low INT64. This may not be NULL.
* Param high: the given high INT64. This may not be NULL.
* Param seed: This is used to confirm that the given sketches were configured with the correct seed. A NULL specifies the default seed = 9001.
* Returns: a Compact Tuple Sketch as BYTES.

### [tuple_sketch_int64_intersection_seed_mode(sketchA BYTES, sketchB BYTES, seed INT64, mode STRING)](../tuple/sqlx/tuple_sketch_int64_intersection_seed_mode.sqlx)
Computes a sketch that represents the scalar intersection of sketchA and sketchB.
Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.
This function only applies to Tuple Sketches with an INT64 summary column.

* Param sketchA: the first sketch "A" as BYTES.
* Param sketchB: the second sketch "B" as BYTES.
* Param seed: This is used to confirm that the given sketches were configured with the correct seed. A NULL specifies the default seed = 9001.
* Returns: a Compact Tuple Sketch as BYTES.

### [tuple_sketch_int64_union_lgk_seed_mode(sketchA BYTES, sketchB BYTES, lg_k BYTEINT, seed INT64, mode STRING)](../tuple/sqlx/tuple_sketch_int64_union_lgk_seed_mode.sqlx)
Computes a Tuple Sketch that represents the UNION of sketchA and sketchB.
Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.
This function only applies to Tuple Sketches with an INT64 summary column.

* Param sketchA: the first sketch "A" as BYTES. This may not be NULL.
* Param sketchB: the second sketch "B" as BYTES. This may not be NULL.
* Param seed: This is used to confirm that the given sketches were configured with the correct seed. A NULL specifies the default seed = 9001.
* Returns: a Compact Tuple Sketch as BYTES.

## Examples

### [test/tuple_sketch_int64_engagement_example.sql](../tuple/test/tuple_sketch_int64_engagement_example.sql)
```sql

# for details see https://datasketches.apache.org/docs/Tuple/TupleEngagementExample.html
declare result_sketch bytes;
create temp table raw_data(day int, id int);
insert into raw_data values
(1, 0), (2, 0), (3, 0), (4, 0), (5, 0), (6, 0), (7, 0), (8, 0), (9, 0), (10, 0), (11, 0), (12, 0), (13, 0), (14, 0), (15, 0),
(16, 0), (17, 0), (18, 0), (19, 0), (20, 0), (21, 0), (22, 0), (23, 0), (24, 0), (25, 0), (26, 0), (27, 0), (28, 0), (29, 0), (30, 0),
(1, 1), (2, 1), (3, 1), (4, 1), (5, 1), (6, 1), (7, 1), (8, 1), (9, 1), (10, 1), (11, 1), (12, 1), (13, 1), (14, 1), (15, 1),
(16, 1), (17, 1), (18, 1), (19, 1), (20, 1), (21, 1), (22, 1), (23, 1), (24, 1), (25, 1), (26, 1), (27, 1),
(1, 2), (2, 2), (3, 2), (4, 2), (5, 2), (6, 2), (7, 2), (8, 2), (9, 2), (10, 2), (11, 2), (12, 2), (13, 2), (14, 2), (15, 2),
(16, 2), (17, 2), (18, 2), (19, 2), (20, 2), (21, 2), (22, 2), (23, 2), (24, 2),
(1, 3), (2, 3), (3, 3), (4, 3), (5, 3), (6, 3), (7, 3), (8, 3), (9, 3), (10, 3), (11, 3), (12, 3), (13, 3), (14, 3), (15, 3),
(16, 3), (17, 3), (18, 3), (19, 3), (20, 3), (21, 3),
(1, 4), (1, 5), (2, 4), (2, 5), (3, 4), (3, 5), (4, 4), (4, 5), (5, 4), (5, 5), (6, 4), (6, 5), (7, 4), (7, 5), (8, 4), (8, 5),
(9, 4), (9, 5), (10, 4), (10, 5), (11, 4), (11, 5), (12, 4), (12, 5), (13, 4), (13, 5), (14, 4), (14, 5), (15, 4), (15, 5),
(16, 4), (16, 5), (17, 4), (17, 5), (18, 4), (18, 5), (19, 4), (19, 5),
(1, 6), (1, 7), (2, 6), (2, 7), (3, 6), (3, 7), (4, 6), (4, 7), (5, 6), (5, 7), (6, 6), (6, 7), (7, 6), (7, 7), (8, 6), (8, 7),
(9, 6), (9, 7), (10, 6), (10, 7), (11, 6), (11, 7), (12, 6), (12, 7), (13, 6), (13, 7), (14, 6), (14, 7), (15, 6), (15, 7),
(16, 6), (16, 7), (17, 6), (17, 7),
(1, 8), (1, 9), (2, 8), (2, 9), (3, 8), (3, 9), (4, 8), (4, 9), (5, 8), (5, 9), (6, 8), (6, 9), (7, 8), (7, 9), (8, 8), (8, 9),
(9, 8), (9, 9), (10, 8), (10, 9), (11, 8), (11, 9), (12, 8), (12, 9), (13, 8), (13, 9), (14, 8), (14, 9), (15, 8), (15, 9),
(1, 10), (1, 11), (2, 10), (2, 11), (3, 10), (3, 11), (4, 10), (4, 11), (5, 10), (5, 11), (6, 10), (6, 11), (7, 10), (7, 11),
(8, 10), (8, 11), (9, 10), (9, 11), (10, 10), (10, 11), (11, 10), (11, 11), (12, 10), (12, 11), (13, 10), (13, 11), (14, 10), (14, 11),
(1, 12), (1, 13), (2, 12), (2, 13), (3, 12), (3, 13), (4, 12), (4, 13), (5, 12), (5, 13), (6, 12), (6, 13), (7, 12), (7, 13),
(8, 12), (8, 13), (9, 12), (9, 13), (10, 12), (10, 13), (11, 12), (11, 13), (12, 12), (12, 13),
(1, 14), (1, 15), (1, 16), (2, 14), (2, 15), (2, 16), (3, 14), (3, 15), (3, 16), (4, 14), (4, 15), (4, 16), (5, 14), (5, 15), (5, 16),
(6, 14), (6, 15), (6, 16), (7, 14), (7, 15), (7, 16), (8, 14), (8, 15), (8, 16), (9, 14), (9, 15), (9, 16), (10, 14), (10, 15), (10, 16),
(11, 14), (11, 15), (11, 16),
(1, 17), (1, 18), (1, 19), (2, 17), (2, 18), (2, 19), (3, 17), (3, 18), (3, 19), (4, 17), (4, 18), (4, 19), (5, 17), (5, 18), (5, 19),
(6, 17), (6, 18), (6, 19), (7, 17), (7, 18), (7, 19), (8, 17), (8, 18), (8, 19), (9, 17), (9, 18), (9, 19), (10, 17), (10, 18), (10, 19),
(1, 20), (1, 21), (1, 22), (2, 20), (2, 21), (2, 22), (3, 20), (3, 21), (3, 22), (4, 20), (4, 21), (4, 22), (5, 20), (5, 21), (5, 22),
(6, 20), (6, 21), (6, 22), (7, 20), (7, 21), (7, 22), (8, 20), (8, 21), (8, 22), (9, 20), (9, 21), (9, 22),
(1, 23), (1, 24), (1, 25), (1, 26), (2, 23), (2, 24), (2, 25), (2, 26), (3, 23), (3, 24), (3, 25), (3, 26), (4, 23), (4, 24), (4, 25), (4, 26),
(5, 23), (5, 24), (5, 25), (5, 26), (6, 23), (6, 24), (6, 25), (6, 26), (7, 23), (7, 24), (7, 25), (7, 26), (8, 23), (8, 24), (8, 25), (8, 26),
(1, 27), (1, 28), (1, 29), (1, 30), (2, 27), (2, 28), (2, 29), (2, 30), (3, 27), (3, 28), (3, 29), (3, 30), (4, 27), (4, 28), (4, 29), (4, 30),
(5, 27), (5, 28), (5, 29), (5, 30), (6, 27), (6, 28), (6, 29), (6, 30), (7, 27), (7, 28), (7, 29), (7, 30),
(1, 31), (1, 32), (1, 33), (1, 34), (1, 35), (2, 31), (2, 32), (2, 33), (2, 34), (2, 35), (3, 31), (3, 32), (3, 33), (3, 34), (3, 35),
(4, 31), (4, 32), (4, 33), (4, 34), (4, 35), (5, 31), (5, 32), (5, 33), (5, 34), (5, 35), (6, 31), (6, 32), (6, 33), (6, 34), (6, 35),
(1, 36), (1, 37), (1, 38), (1, 39), (1, 40), (2, 36), (2, 37), (2, 38), (2, 39), (2, 40), (3, 36), (3, 37), (3, 38), (3, 39), (3, 40),
(4, 36), (4, 37), (4, 38), (4, 39), (4, 40), (5, 36), (5, 37), (5, 38), (5, 39), (5, 40),
(1, 41), (1, 42), (1, 43), (1, 44), (1, 45), (1, 46), (2, 41), (2, 42), (2, 43), (2, 44), (2, 45), (2, 46),
(3, 41), (3, 42), (3, 43), (3, 44), (3, 45), (3, 46), (4, 41), (4, 42), (4, 43), (4, 44), (4, 45), (4, 46),
(5, 41), (5, 42), (5, 43), (5, 44), (5, 45), (5, 46),
(1, 47), (1, 48), (1, 49), (1, 50), (1, 51), (1, 52), (1, 53), (2, 47), (2, 48), (2, 49), (2, 50), (2, 51), (2, 52), (2, 53),
(3, 47), (3, 48), (3, 49), (3, 50), (3, 51), (3, 52), (3, 53), (4, 47), (4, 48), (4, 49), (4, 50), (4, 51), (4, 52), (4, 53),
(1, 54), (1, 55), (1, 56), (1, 57), (1, 58), (1, 59), (1, 60), (1, 61), (2, 54), (2, 55), (2, 56), (2, 57), (2, 58), (2, 59), (2, 60), (2, 61),
(3, 54), (3, 55), (3, 56), (3, 57), (3, 58), (3, 59), (3, 60), (3, 61), (4, 54), (4, 55), (4, 56), (4, 57), (4, 58), (4, 59), (4, 60), (4, 61),
(1, 62), (1, 63), (1, 64), (1, 65), (1, 66), (1, 67), (1, 68), (1, 69), (1, 70), (2, 62), (2, 63), (2, 64), (2, 65), (2, 66), (2, 67), (2, 68),
(2, 69), (2, 70), (3, 62), (3, 63), (3, 64), (3, 65), (3, 66), (3, 67), (3, 68), (3, 69), (3, 70),
(1, 71), (1, 72), (1, 73), (1, 74), (1, 75), (1, 76), (1, 77), (1, 78), (1, 79), (1, 80), (2, 71), (2, 72), (2, 73), (2, 74), (2, 75), (2, 76),
(2, 77), (2, 78), (2, 79), (2, 80), (3, 71), (3, 72), (3, 73), (3, 74), (3, 75), (3, 76), (3, 77), (3, 78), (3, 79), (3, 80),
(1, 81), (1, 82), (1, 83), (1, 84), (1, 85), (1, 86), (1, 87), (1, 88), (1, 89), (1, 90), (1, 91), (2, 81), (2, 82), (2, 83), (2, 84), (2, 85),
(2, 86), (2, 87), (2, 88), (2, 89), (2, 90), (2, 91), (3, 81), (3, 82), (3, 83), (3, 84), (3, 85), (3, 86), (3, 87), (3, 88), (3, 89), (3, 90), (3, 91),
(1, 92), (1, 93), (1, 94), (1, 95), (1, 96), (1, 97), (1, 98), (1, 99), (1, 100), (1, 101), (1, 102), (1, 103),
(2, 92), (2, 93), (2, 94), (2, 95), (2, 96), (2, 97), (2, 98), (2, 99), (2, 100), (2, 101), (2, 102), (2, 103),
(1, 104), (1, 105), (1, 106), (1, 107), (1, 108), (1, 109), (1, 110), (1, 111), (1, 112), (1, 113), (1, 114), (1, 115), (1, 116), (1, 117),
(2, 104), (2, 105), (2, 106), (2, 107), (2, 108), (2, 109), (2, 110), (2, 111), (2, 112), (2, 113), (2, 114), (2, 115), (2, 116), (2, 117),
(1, 118), (1, 119), (1, 120), (1, 121), (1, 122), (1, 123), (1, 124), (1, 125), (1, 126), (1, 127), (1, 128), (1, 129), (1, 130), (1, 131), (1, 132),
(2, 118), (2, 119), (2, 120), (2, 121), (2, 122), (2, 123), (2, 124), (2, 125), (2, 126), (2, 127), (2, 128), (2, 129), (2, 130), (2, 131), (2, 132),
(1, 133), (1, 134), (1, 135), (1, 136), (1, 137), (1, 138), (1, 139), (1, 140), (1, 141), (1, 142), (1, 143), (1, 144), (1, 145), (1, 146), (1, 147),
(1, 148), (1, 149), (2, 133), (2, 134), (2, 135), (2, 136), (2, 137), (2, 138), (2, 139), (2, 140), (2, 141), (2, 142), (2, 143), (2, 144), (2, 145),
(2, 146), (2, 147), (2, 148), (2, 149),
(1, 150), (1, 151), (1, 152), (1, 153), (1, 154), (1, 155), (1, 156), (1, 157), (1, 158), (1, 159), (1, 160), (1, 161), (1, 162), (1, 163), (1, 164),
(1, 165), (1, 166), (1, 167), (1, 168), (2, 150), (2, 151), (2, 152), (2, 153), (2, 154), (2, 155), (2, 156), (2, 157), (2, 158), (2, 159), (2, 160),
(2, 161), (2, 162), (2, 163), (2, 164), (2, 165), (2, 166), (2, 167), (2, 168),
(1, 169), (1, 170), (1, 171), (1, 172), (1, 173), (1, 174), (1, 175), (1, 176), (1, 177), (1, 178), (1, 179), (1, 180), (1, 181), (1, 182), (1, 183),
(1, 184), (1, 185), (1, 186), (1, 187), (1, 188), (1, 189), (1, 190), (1, 191), (1, 192), (1, 193), (1, 194), (1, 195), (1, 196), (1, 197), (1, 198),
(1, 199), (1, 200), (1, 201), (1, 202), (1, 203), (1, 204), (1, 205), (1, 206), (1, 207), (1, 208), (1, 209), (1, 210), (1, 211), (1, 212), (1, 213),
(1, 214), (1, 215), (1, 216), (1, 217), (1, 218), (1, 219), (1, 220), (1, 221), (1, 222), (1, 223), (1, 224), (1, 225), (1, 226), (1, 227), (1, 228),
(1, 229), (1, 230), (1, 231), (1, 232), (1, 233), (1, 234), (1, 235), (1, 236), (1, 237), (1, 238), (1, 239), (1, 240), (1, 241), (1, 242), (1, 243),
(1, 244), (1, 245), (1, 246), (1, 247), (1, 248), (1, 249), (1, 250), (1, 251), (1, 252), (1, 253), (1, 254), (1, 255), (1, 256), (1, 257), (1, 258),
(1, 259), (1, 260), (1, 261), (1, 262), (1, 263), (1, 264), (1, 265), (1, 266), (1, 267), (1, 268), (1, 269), (1, 270);

# this shows how to aggregate per day first and then union across days
set result_sketch = (
  with daily_agg as (
    select day, bqutil.datasketches.tuple_sketch_int64_agg_int64_lgk_seed_p_mode(id, 1, struct<int, int, float64, string>(8, null, null, "ONE")) as sketch from raw_data group by day
  )
  select bqutil.datasketches.tuple_sketch_int64_agg_union_lgk_seed_mode(sketch, struct<int, int, string>(8, null, "SUM")) as sketch from daily_agg
);

# engagement histogram with bounds
select
  n as days_visited,
  bqutil.datasketches.tuple_sketch_int64_get_estimate_and_bounds(bqutil.datasketches.tuple_sketch_int64_filter_low_high(result_sketch, n, n), 2) as visitors
from unnest(generate_array(1, 30)) as n;

# total estimated number of visitors with bounds
select bqutil.datasketches.tuple_sketch_int64_get_estimate_and_bounds(result_sketch, 2);

# total estimated number of visits with bounds
select bqutil.datasketches.tuple_sketch_int64_get_sum_estimate_and_bounds(result_sketch, 2);
```

### [test/tuple_sketch_int64_test.sql](../tuple/test/tuple_sketch_int64_test.sql)
```sql

# using defaults
create or replace temp table tuple_sketch(sketch bytes);

insert into tuple_sketch
(select bqutil.datasketches.tuple_sketch_int64_from_theta_sketch(bqutil.datasketches.theta_sketch_agg_string(cast(value as string)), 1) from unnest(GENERATE_ARRAY(1, 10000, 1)) as value);
insert into tuple_sketch
(select bqutil.datasketches.tuple_sketch_int64_from_theta_sketch(bqutil.datasketches.theta_sketch_agg_string(cast(value as string)), 1) from unnest(GENERATE_ARRAY(100000, 110000, 1)) as value);

# expected about 20000
select bqutil.datasketches.tuple_sketch_int64_get_estimate(
  bqutil.datasketches.tuple_sketch_int64_agg_union(sketch)
) from tuple_sketch;

select bqutil.datasketches.tuple_sketch_int64_get_estimate_and_bounds(
  bqutil.datasketches.tuple_sketch_int64_agg_union(sketch),
  2
) from tuple_sketch;

select bqutil.datasketches.tuple_sketch_int64_get_sum_estimate_and_bounds(
  bqutil.datasketches.tuple_sketch_int64_agg_union(sketch),
  2
) from tuple_sketch;

# expected estimate about 20000
select bqutil.datasketches.tuple_sketch_int64_to_string(
  bqutil.datasketches.tuple_sketch_int64_agg_union(sketch)
) from tuple_sketch;

select bqutil.datasketches.tuple_sketch_int64_get_theta(
  bqutil.datasketches.tuple_sketch_int64_agg_union(sketch)
) from tuple_sketch;

select bqutil.datasketches.tuple_sketch_int64_get_num_retained(
  bqutil.datasketches.tuple_sketch_int64_agg_union(sketch)
) from tuple_sketch;

drop table tuple_sketch;

# using full signatures
create or replace temp table tuple_sketch(sketch bytes);

insert into tuple_sketch
(select bqutil.datasketches.tuple_sketch_int64_from_theta_sketch_seed(
  bqutil.datasketches.theta_sketch_agg_string_lgk_seed_p(cast(value as string), STRUCT<BYTEINT, INT64, FLOAT64>(10, 111, 0.999)),
  1,
  111
) from unnest(GENERATE_ARRAY(1, 10000, 1)) as value);
insert into tuple_sketch
(select bqutil.datasketches.tuple_sketch_int64_from_theta_sketch_seed(
  bqutil.datasketches.theta_sketch_agg_string_lgk_seed_p(cast(value as string), STRUCT<BYTEINT, INT64, FLOAT64>(10, 111, 0.999)),
  1,
  111
) from unnest(GENERATE_ARRAY(100000, 110000, 1)) as value);

# expected about 20000
select bqutil.datasketches.tuple_sketch_int64_get_estimate_seed(
  bqutil.datasketches.tuple_sketch_int64_agg_union_lgk_seed_mode(sketch, STRUCT<BYTEINT, INT64, STRING>(10, 111, "NOP")),
  111
) from tuple_sketch;

select bqutil.datasketches.tuple_sketch_int64_get_estimate_and_bounds_seed(
  bqutil.datasketches.tuple_sketch_int64_agg_union_lgk_seed_mode(sketch, STRUCT<BYTEINT, INT64, STRING>(10, 111, "NOP")),
  2,
  111
) from tuple_sketch;

select bqutil.datasketches.tuple_sketch_int64_get_sum_estimate_and_bounds_seed(
  bqutil.datasketches.tuple_sketch_int64_agg_union_lgk_seed_mode(sketch, STRUCT<BYTEINT, INT64, STRING>(10, 111, "NOP")),
  2,
  111
) from tuple_sketch;

# expected estimate about 20000
select bqutil.datasketches.tuple_sketch_int64_to_string_seed(
  bqutil.datasketches.tuple_sketch_int64_agg_union_lgk_seed_mode(sketch, STRUCT<BYTEINT, INT64, STRING>(10, 111, "NOP")),
  111
) from tuple_sketch;

select bqutil.datasketches.tuple_sketch_int64_get_theta_seed(
  bqutil.datasketches.tuple_sketch_int64_agg_union_lgk_seed_mode(sketch, STRUCT<BYTEINT, INT64, STRING>(10, 111, "NOP")),
  111
) from tuple_sketch;

select bqutil.datasketches.tuple_sketch_int64_get_num_retained_seed(
  bqutil.datasketches.tuple_sketch_int64_agg_union_lgk_seed_mode(sketch, STRUCT<BYTEINT, INT64, STRING>(10, 111, "NOP")),
  111
) from tuple_sketch;

drop table tuple_sketch;

# using defaults
# expected 5
select bqutil.datasketches.tuple_sketch_int64_get_estimate(
  bqutil.datasketches.tuple_sketch_int64_union(
    (select bqutil.datasketches.tuple_sketch_int64_agg_int64(key, 1) from unnest([1, 2, 3]) as key),
    (select bqutil.datasketches.tuple_sketch_int64_agg_int64(key, 1) from unnest([3, 4, 5]) as key)
  )
);

# using full signatures
# expected 5
select bqutil.datasketches.tuple_sketch_int64_get_estimate_seed(
  bqutil.datasketches.tuple_sketch_int64_union_lgk_seed_mode(
    (select bqutil.datasketches.tuple_sketch_int64_agg_int64_lgk_seed_p_mode(key, 1, STRUCT<BYTEINT, INT64, FLOAT64, STRING>(10, 111, 0.999, "MIN")) from unnest([1, 2, 3]) as key),
    (select bqutil.datasketches.tuple_sketch_int64_agg_int64_lgk_seed_p_mode(key, 1, STRUCT<BYTEINT, INT64, FLOAT64, STRING>(10, 111, 0.999, "MIN")) from unnest([3, 4, 5]) as key),
    10,
    111,
    "MIN"
  ),
  111
);

# using defaults
# expected 1
select bqutil.datasketches.tuple_sketch_int64_get_estimate(
  bqutil.datasketches.tuple_sketch_int64_intersection(
    (select bqutil.datasketches.tuple_sketch_int64_agg_string(str, 1) from unnest(["a", "b", "c"]) as str),
    (select bqutil.datasketches.tuple_sketch_int64_agg_string(str, 1) from unnest(["c", "d", "e"]) as str)
  )
);

# using full signatures
# expected 1
select bqutil.datasketches.tuple_sketch_int64_get_estimate_seed(
  bqutil.datasketches.tuple_sketch_int64_intersection_seed_mode(
    (select bqutil.datasketches.tuple_sketch_int64_agg_string_lgk_seed_p_mode(str, 1, STRUCT<BYTEINT, INT64, FLOAT64, STRING>(10, 111, 0.999, "MIN")) from unnest(["a", "b", "c"]) as str),
    (select bqutil.datasketches.tuple_sketch_int64_agg_string_lgk_seed_p_mode(str, 1, STRUCT<BYTEINT, INT64, FLOAT64, STRING>(10, 111, 0.999, "MIN")) from unnest(["c", "d", "e"]) as str),
    111,
    "MIN"
  ),
  111
);

# using defaults
# expected 2
select bqutil.datasketches.tuple_sketch_int64_get_estimate(
  bqutil.datasketches.tuple_sketch_int64_a_not_b(
    (select bqutil.datasketches.tuple_sketch_int64_agg_string(str, 1) from unnest(["a", "b", "c"]) as str),
    (select bqutil.datasketches.tuple_sketch_int64_agg_string(str, 1) from unnest(["c", "d", "e"]) as str)
  )
);

# using full signatures
# expected 2
select bqutil.datasketches.tuple_sketch_int64_get_estimate_seed(
  bqutil.datasketches.tuple_sketch_int64_a_not_b_seed(
    (select bqutil.datasketches.tuple_sketch_int64_agg_string_lgk_seed_p_mode(str, 1, STRUCT<BYTEINT, INT64, FLOAT64, STRING>(10, 111, 0.999, "MIN")) from unnest(["a", "b", "c"]) as str),
    (select bqutil.datasketches.tuple_sketch_int64_agg_string_lgk_seed_p_mode(str, 1, STRUCT<BYTEINT, INT64, FLOAT64, STRING>(10, 111, 0.999, "MIN")) from unnest(["c", "d", "e"]) as str),
    111
  ),
  111
);

# using defaults
# expected 0.2
select bqutil.datasketches.tuple_sketch_int64_jaccard_similarity(
  (select bqutil.datasketches.tuple_sketch_int64_agg_string(str, 1) from unnest(["a", "b", "c"]) as str),
  (select bqutil.datasketches.tuple_sketch_int64_agg_string(str, 1) from unnest(["c", "d", "e"]) as str)
);

# using full signatures
# expected 0.2
select bqutil.datasketches.tuple_sketch_int64_jaccard_similarity_seed(
  (select bqutil.datasketches.tuple_sketch_int64_agg_string_lgk_seed_p_mode(str, 1, STRUCT<BYTEINT, INT64, FLOAT64, STRING>(10, 111, 0.999, "NOP")) from unnest(["a", "b", "c"]) as str),
  (select bqutil.datasketches.tuple_sketch_int64_agg_string_lgk_seed_p_mode(str, 1, STRUCT<BYTEINT, INT64, FLOAT64, STRING>(10, 111, 0.999, "NOP")) from unnest(["c", "d", "e"]) as str),
  111
);

# using defaults
# expected 1 entry
select bqutil.datasketches.tuple_sketch_int64_to_string(
  bqutil.datasketches.tuple_sketch_int64_filter_low_high(
    bqutil.datasketches.tuple_sketch_int64_agg_string(key, 1),
    2,
    2
  )
) from unnest(["a", "b", "c", "c"]) as key;

# using full signatures
# expected 1 entry
select bqutil.datasketches.tuple_sketch_int64_to_string_seed(
  bqutil.datasketches.tuple_sketch_int64_filter_low_high_seed(
    bqutil.datasketches.tuple_sketch_int64_agg_string_lgk_seed_p_mode(key, 1, STRUCT<BYTEINT, INT64, FLOAT64, STRING>(10, 111, 0.999, "SUM")),
    2,
    2,
    111
  ),
  111
) from unnest(["a", "b", "c", "c"]) as key;
```
