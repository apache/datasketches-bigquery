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
The set of all Summary values collected by the sketch represents a uniform random sample over the unique identifiers
subset of all identifiers. This enables the use of common statistical computations of the Summary values, which can be extrapolated to the entire
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
This returns a compact tuple sketch that contains the subset of rows of the give sketch where the
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
This returns a compact tuple sketch that contains the subset of rows of the give sketch where the
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
