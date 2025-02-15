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

# Apache DataSketches Theta Sketches for Google BigQuery

Theta sketches are used for distinct counting and set operations like union,
intersection, and difference. They are efficient for estimating the size of
these operations on large datasets, enabling applications like analyzing user
overlap or comparing different groups.

Please visit 
[Theta Sketches](https://datasketches.apache.org/docs/Theta/ThetaSketches.html) 
for more information about this sketch family.

Please visit the main 
[Apache DataSketches website](https://datasketches.apache.org) 
for more information about DataSketches library.

If you are interested in making contributions to this project please see our 
[Community](https://datasketches.apache.org/docs/Community/) 
page for how to contact us.

## Aggregate Functions

### [theta_sketch_agg_int64(value INT64)](../theta/sqlx/theta_sketch_agg_int64.sqlx)
Creates a sketch that represents the cardinality of the given INT64 column.
  
* Param value: the INT64 column of identifiers.
* Defaults: lg\_k = 12, seed = 9001, p = 1.0.
* Returns: a Compact, Compressed Theta Sketch, as BYTES. 

### [theta_sketch_agg_union(sketch BYTES)](../theta/sqlx/theta_sketch_agg_union.sqlx)
Creates a sketch that represents the union of the given column of sketches.

* Param sketch: the column of sketches. Each as BYTES.
* Defaults: lg\_k = 12, seed = 9001.
* Returns: a Compact, Compressed Theta Sketch, as BYTES.

### [theta_sketch_agg_string(str STRING)](../theta/sqlx/theta_sketch_agg_string.sqlx)
Creates a sketch that represents the cardinality of the given STRING column.
  
* Param str: the STRING column of identifiers.
* Defaults: lg\_k = 12, seed = 9001, p = 1.0.
* Returns: a Compact, Compressed Theta Sketch, as BYTES. 

### [theta_sketch_agg_union_lgk_seed(sketch BYTES, params STRUCT<lg_k BYTEINT, seed INT64> NOT AGGREGATE)](../theta/sqlx/theta_sketch_agg_union_lgk_seed.sqlx)
Creates a sketch that represents the union of the given column of sketches.

* Param sketch: the column of sketches. Each as BYTES.
* Param lg\_k: the sketch accuracy/size parameter as a BYTEINT in the range \[4, 26\].
* Param seed: This is used to confirm that the given sketches were configured with the correct seed.
* Returns: a Compact, Compressed Theta Sketch, as BYTES.

### [theta_sketch_agg_int64_lgk_seed_p(value INT64, params STRUCT<lg_k BYTEINT, seed INT64, p FLOAT64> NOT AGGREGATE)](../theta/sqlx/theta_sketch_agg_int64_lgk_seed_p.sqlx)
Creates a sketch that represents the cardinality of the given INT64 column.

* Param value: the INT64 column of identifiers.
* Param lg\_k: the sketch accuracy/size parameter as a BYTEINT in the range \[4, 26\]. A NULL specifies the default of 12.
* Param seed: the seed to be used by the underlying hash function. A NULL specifies the default of 9001.
* Param p: up\-front sampling probability. A NULL specifies the default of 1.0.
* Returns: a Compact, Compressed Theta Sketch, as BYTES.

### [theta_sketch_agg_string_lgk_seed_p(str STRING, params STRUCT<lg_k BYTEINT, seed INT64, p FLOAT64> NOT AGGREGATE)](../theta/sqlx/theta_sketch_agg_string_lgk_seed_p.sqlx)
Creates a sketch that represents the cardinality of the given STRING column.

* Param str: the STRING column of identifiers.
* Param lg\_k: the sketch accuracy/size parameter as a BYTEINT in the range \[4, 26\]. A NULL specifies the default of 12.
* Param seed: the seed to be used by the underlying hash function. A NULL specifies the default of 9001.
* Param p: up\-front sampling probability. A NULL specifies the default of 1.0.
* Returns: a Compact, Compressed Theta Sketch, as BYTES.

## Scalar Functions

### [theta_sketch_get_estimate(sketch BYTES)](../theta/sqlx/theta_sketch_get_estimate.sqlx)
Gets distinct count estimate from a  given sketch.

* Param sketch: The given sketch to query as BYTES.
* Defaults: seed = 9001.
* Returns: distinct count estimate as FLOAT64.

### [theta_sketch_to_string(sketch BYTES)](../theta/sqlx/theta_sketch_to_string.sqlx)
Returns a summary string that represents the state of the given sketch.

* Param sketch: the given sketch as BYTES.
* Defaults: seed = 9001.
* Returns: a STRING that represents the state of the given sketch.

### [theta_sketch_get_num_retained(sketch BYTES)](../theta/sqlx/theta_sketch_get_num_retained.sqlx)
Returns the number of retained entries in the given sketch.
  
* Param sketch: The given sketch to query as BYTES.
* Defaults: seed = 9001.
* Returns: number of retained entries as INT.

### [theta_sketch_get_theta(sketch BYTES)](../theta/sqlx/theta_sketch_get_theta.sqlx)
Returns theta \(effective sampling rate\) as a fraction from 0 to 1.
  
* Param sketch: The given sketch to query as BYTES.
* Defaults: seed = 9001.
* Returns: theta as FLOAT64.

### [theta_sketch_get_num_retained_seed(sketch BYTES, seed INT64)](../theta/sqlx/theta_sketch_get_num_retained_seed.sqlx)
Returns the number of retained entries in the given sketch.
  
* Param sketch: The given sketch to query as BYTES.
* Param seed: This is used to confirm that the given sketch was configured with the correct seed.
* Returns: number of retained entries as INT.

### [theta_sketch_get_estimate_seed(sketch BYTES, seed INT64)](../theta/sqlx/theta_sketch_get_estimate_seed.sqlx)
Gets distinct count estimate from a given sketch.
  
* Param sketch: The given sketch to query as BYTES.
* Param seed: This is used to confirm that the given sketch was configured with the correct seed.
* Returns: distinct count estimate as FLOA64.

### [theta_sketch_to_string_seed(sketch BYTES, seed INT64)](../theta/sqlx/theta_sketch_to_string_seed.sqlx)
Returns a summary string that represents the state of the given sketch.

* Param sketch: the given sketch as BYTES.
* Param seed: This is used to confirm that the given sketch was configured with the correct seed.
* Returns: a STRING that represents the state of the given sketch.

### [theta_sketch_get_theta_seed(sketch BYTES, seed INT64)](../theta/sqlx/theta_sketch_get_theta_seed.sqlx)
Returns theta \(effective sampling rate\) as a fraction from 0 to 1.
  
* Param sketch: The given sketch to query as BYTES.
* Param seed: This is used to confirm that the given sketch was configured with the correct seed.
* Returns: theta as FLOAT64.

### [theta_sketch_intersection(sketchA BYTES, sketchB BYTES)](../theta/sqlx/theta_sketch_intersection.sqlx)
Computes a sketch that represents the scalar intersection of the two given sketches.

* Param sketchA: the first sketch as BYTES.
* Param sketchB: the second sketch as BYTES.
* Defaults: seed = 9001.
* Returns: a Compact, Compressed Theta Sketch, as BYTES.

### [theta_sketch_union(sketchA BYTES, sketchB BYTES)](../theta/sqlx/theta_sketch_union.sqlx)
Computes a sketch that represents the scalar union of the two given sketches.

* Param sketchA: the first sketch as BYTES.
* Param sketchB: the second sketch as BYTES.
* Defaults: lg\_k = 12, seed = 9001.
* Returns: a Compact, Compressed Theta Sketch, as BYTES.

### [theta_sketch_a_not_b(sketchA BYTES, sketchB BYTES)](../theta/sqlx/theta_sketch_a_not_b.sqlx)
Computes a sketch that represents the scalar set difference: sketchA and not sketchB.

* Param sketchA: the first sketch "A" as bytes.
* Param sketchB: the second sketch "B" as bytes.
* Defaults: seed = 9001.
* Returns: a Compact, Compressed Theta Sketch, as BYTES.

### [theta_sketch_get_estimate_and_bounds(sketch BYTES, num_std_devs BYTEINT)](../theta/sqlx/theta_sketch_get_estimate_and_bounds.sqlx)
Gets distinct count estimate and bounds from a given sketch.

* Param sketch: The given sketch to query as BYTES.
* Param num\_std\_devs: The returned bounds will be based on the statistical confidence interval
  determined by the given number of standard deviations from the returned estimate.
  This number may be one of {1,2,3}, where 1 represents 68% confidence,
  2 represents 95% confidence and 3 represents 99.7% confidence.
  For example, if the given num\_std\_devs = 2 and the returned values are {1000, 990, 1010}
  that means that with 95% confidence, the true value lies within the range \[990, 1010\].
* Defaults: seed = 9001.
* Returns: a STRUCT with three FLOAT64 values as {estimate, lower\_bound, upper\_bound}.

### [theta_sketch_jaccard_similarity(sketchA BYTES, sketchB BYTES)](../theta/sqlx/theta_sketch_jaccard_similarity.sqlx)
Computes the Jaccard similarity index with upper and lower bounds.
The Jaccard similarity index J\(A,B\) = \(A ^ B\)/\(A U B\) is used to measure how similar the two sketches are to each other.
If J = 1.0, the sketches are considered equal. If J = 0, the two sketches are disjoint.
A Jaccard of .95 means the overlap between the two sets is 95% of the union of the two sets.

* Param sketchA: the first sketch as bytes.
* Param sketchB: the second sketch as bytes.
* Defaults: seed = 9001.
* Returns: a STRUCT with three FLOAT64 values {lower\_bound, estimate, upper\_bound} of the Jaccard index.

### [theta_sketch_get_estimate_and_bounds_seed(sketch BYTES, num_std_devs BYTEINT, seed INT64)](../theta/sqlx/theta_sketch_get_estimate_and_bounds_seed.sqlx)
Gets distinct count estimate and bounds from a given sketch.

* Param sketch: The given sketch to query as BYTES.
* Param num\_std\_devs: The returned bounds will be based on the statistical confidence interval
  determined by the given number of standard deviations from the returned estimate.
  This number may be one of {1,2,3}, where 1 represents 68% confidence,
  2 represents 95% confidence and 3 represents 99.7% confidence.
  For example, if the given num\_std\_devs = 2 and the returned values are {1000, 990, 1010}
  that means that with 95% confidence, the true value lies within the range \[990, 1010\].
* Param seed: This is used to confirm that the given sketch was configured with the correct seed.
* Returns: a STRUCT with three FLOAT64 values as {estimate, lower\_bound, upper\_bound}.

### [theta_sketch_intersection_seed(sketchA BYTES, sketchB BYTES, seed INT64)](../theta/sqlx/theta_sketch_intersection_seed.sqlx)
Computes a sketch that represents the scalar intersection of the two given sketches.

* Param sketchA: the first sketch as BYTES.
* Param sketchB: the second sketch as BYTES.
* Param seed: This is used to confirm that the given sketches were configured with the correct seed.
* Returns: a Compact, Compressed Theta Sketch, as BYTES.

### [theta_sketch_jaccard_similarity_seed(sketchA BYTES, sketchB BYTES, seed INT64)](../theta/sqlx/theta_sketch_jaccard_similarity_seed.sqlx)
Computes the Jaccard similarity index with upper and lower bounds.
The Jaccard similarity index J\(A,B\) = \(A ^ B\)/\(A U B\) is used to measure how similar the two sketches are to each other.
If J = 1.0, the sketches are considered equal. If J = 0, the two sketches are disjoint.
A Jaccard of .95 means the overlap between the two sets is 95% of the union of the two sets.

* Param sketchA: the first sketch as bytes.
* Param sketchB: the second sketch as bytes.
* Param seed: This is used to confirm that the given sketches were configured with the correct seed.
* Returns: a STRUCT with three FLOAT64 values {lower\_bound, estimate, upper\_bound} of the Jaccard index.

### [theta_sketch_a_not_b_seed(sketchA BYTES, sketchB BYTES, seed INT64)](../theta/sqlx/theta_sketch_a_not_b_seed.sqlx)
Computes a sketch that represents the scalar set difference: sketchA and not sketchB.

* Param sketchA: the first sketch "A" as bytes.
* Param sketchB: the second sketch "B" as bytes.
* Param seed: This is used to confirm that the given sketches were configured with the correct seed.
* Returns: a Compact, Compressed Theta Sketch, as BYTES.

### [theta_sketch_union_lgk_seed(sketchA BYTES, sketchB BYTES, lg_k BYTEINT, seed INT64)](../theta/sqlx/theta_sketch_union_lgk_seed.sqlx)
Computes a sketch that represents the scalar union of the two given sketches.

* Param sketchA: the first sketch as BYTES.
* Param sketchB: the second sketch as BYTES.
* Param lg\_k: the sketch accuracy/size parameter as an integer in the range \[4, 26\].
* Param seed: This is used to confirm that the given sketches were configured with the correct seed.
* Returns: a Compact, Compressed Theta Sketch, as BYTES.

## Examples

### [test/theta_sketch_test.sql](../theta/test/theta_sketch_test.sql)
```sql

# using defaults
create or replace temp table theta_sketch(sketch bytes);

insert into theta_sketch
(select bqutil.datasketches.theta_sketch_agg_int64(value) from unnest(GENERATE_ARRAY(1, 10000, 1)) as value);
insert into theta_sketch
(select bqutil.datasketches.theta_sketch_agg_int64(value) from unnest(GENERATE_ARRAY(100000, 110000, 1)) as value);

# expected about 20000
select bqutil.datasketches.theta_sketch_get_estimate_and_bounds(
  bqutil.datasketches.theta_sketch_agg_union(sketch),
  2
) from theta_sketch;

# expected estimate about 20000
select bqutil.datasketches.theta_sketch_to_string(
  bqutil.datasketches.theta_sketch_agg_union(sketch)
) from theta_sketch;

select bqutil.datasketches.theta_sketch_get_theta(
  bqutil.datasketches.theta_sketch_agg_union(sketch)
) from theta_sketch;

select bqutil.datasketches.theta_sketch_get_num_retained(
  bqutil.datasketches.theta_sketch_agg_union(sketch)
) from theta_sketch;

drop table theta_sketch;

# using full signatures
create or replace temp table theta_sketch(sketch bytes);

insert into theta_sketch
(select bqutil.datasketches.theta_sketch_agg_int64_lgk_seed_p(value, struct<int, int, float64>(14, 111, 0.9)) from unnest(GENERATE_ARRAY(1, 10000, 1)) as value);
insert into theta_sketch
(select bqutil.datasketches.theta_sketch_agg_int64_lgk_seed_p(value, struct<int, int, float64>(14, 111, 0.9)) from unnest(GENERATE_ARRAY(100000, 110000, 1)) as value);

# expected about 20000
select bqutil.datasketches.theta_sketch_get_estimate_and_bounds_seed(
  bqutil.datasketches.theta_sketch_agg_union_lgk_seed(sketch, struct<int, int>(10, 111)),
  2,
  111
) from theta_sketch;

# expected estimate about 20000
select bqutil.datasketches.theta_sketch_to_string_seed(
  bqutil.datasketches.theta_sketch_agg_union_lgk_seed(sketch, struct<int, int>(10, 111)),
  111
) from theta_sketch;

select bqutil.datasketches.theta_sketch_get_theta_seed(
  bqutil.datasketches.theta_sketch_agg_union_lgk_seed(sketch, struct<int, int>(10, 111)),
  111
) from theta_sketch;

select bqutil.datasketches.theta_sketch_get_num_retained_seed(
  bqutil.datasketches.theta_sketch_agg_union_lgk_seed(sketch, struct<int, int>(10, 111)),
  111
) from theta_sketch;

drop table theta_sketch;

# using defaults
# expected 5
select bqutil.datasketches.theta_sketch_get_estimate(
  bqutil.datasketches.theta_sketch_union(
    (select bqutil.datasketches.theta_sketch_agg_string(str) from unnest(["a", "b", "c"]) as str),
    (select bqutil.datasketches.theta_sketch_agg_string(str) from unnest(["c", "d", "e"]) as str)
  )
);

# full signatures
# expected 5
select bqutil.datasketches.theta_sketch_get_estimate_seed(
  bqutil.datasketches.theta_sketch_union_lgk_seed(
    (select bqutil.datasketches.theta_sketch_agg_string_lgk_seed_p(str, struct<int, int, float64>(10, 111, 0.999)) from unnest(["a", "b", "c"]) as str),
    (select bqutil.datasketches.theta_sketch_agg_string_lgk_seed_p(str, struct<int, int, float64>(10, 111, 0.999)) from unnest(["c", "d", "e"]) as str),
    10,
    111
  ),
  111
);

# using defaults
# expected 1
select bqutil.datasketches.theta_sketch_get_estimate(
  bqutil.datasketches.theta_sketch_intersection(
    (select bqutil.datasketches.theta_sketch_agg_string(str) from unnest(["a", "b", "c"]) as str),
    (select bqutil.datasketches.theta_sketch_agg_string(str) from unnest(["c", "d", "e"]) as str)
  )
);

# full signatures
# expected 1
select bqutil.datasketches.theta_sketch_get_estimate_seed(
  bqutil.datasketches.theta_sketch_intersection_seed(
    (select bqutil.datasketches.theta_sketch_agg_string_lgk_seed_p(str, struct<int, int, float64>(10, 111, 0.999)) from unnest(["a", "b", "c"]) as str),
    (select bqutil.datasketches.theta_sketch_agg_string_lgk_seed_p(str, struct<int, int, float64>(10, 111, 0.999)) from unnest(["c", "d", "e"]) as str),
    111
  ),
  111
);

# using defaults
# expected 2
select bqutil.datasketches.theta_sketch_get_estimate(
  bqutil.datasketches.theta_sketch_a_not_b(
    (select bqutil.datasketches.theta_sketch_agg_string(str) from unnest(["a", "b", "c"]) as str),
    (select bqutil.datasketches.theta_sketch_agg_string(str) from unnest(["c", "d", "e"]) as str)
  )
);

# full signatures
# expected 2
select bqutil.datasketches.theta_sketch_get_estimate_seed(
  bqutil.datasketches.theta_sketch_a_not_b_seed(
    (select bqutil.datasketches.theta_sketch_agg_string_lgk_seed_p(str, struct<int, int, float64>(10, 111, 0.999)) from unnest(["a", "b", "c"]) as str),
    (select bqutil.datasketches.theta_sketch_agg_string_lgk_seed_p(str, struct<int, int, float64>(10, 111, 0.999)) from unnest(["c", "d", "e"]) as str),
    111
  ),
  111
);

# using defaults
# expected 0.2
select bqutil.datasketches.theta_sketch_jaccard_similarity(
  (select bqutil.datasketches.theta_sketch_agg_string(str) from unnest(["a", "b", "c"]) as str),
  (select bqutil.datasketches.theta_sketch_agg_string(str) from unnest(["c", "d", "e"]) as str)
);

# using full signatures
# expected 0.2
select bqutil.datasketches.theta_sketch_jaccard_similarity_seed(
  (select bqutil.datasketches.theta_sketch_agg_string_lgk_seed_p(str, struct<int, int, float64>(10, 111, 0.999)) from unnest(["a", "b", "c"]) as str),
  (select bqutil.datasketches.theta_sketch_agg_string_lgk_seed_p(str, struct<int, int, float64>(10, 111, 0.999)) from unnest(["c", "d", "e"]) as str),
  111
);
```
