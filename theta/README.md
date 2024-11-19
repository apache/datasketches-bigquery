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

| Function Name | Function Type | Signature | Description |
|---|---|---|---|
| [theta_sketch_agg_int64](../definitions/theta/theta_sketch_agg_int64.sqlx) | AGGREGATE | (value INT64) -> BYTES | Creates a sketch that represents the cardinality of the given INT64 column.\<br\>  \<br\>Param value: the INT64 column of identifiers.\<br\>Defaults: lg\_k = 12, seed = 9001, p = 1.0.\<br\>Returns: a Compact, Compressed Theta Sketch, as BYTES.  |
| [theta_sketch_agg_union](../definitions/theta/theta_sketch_agg_union.sqlx) | AGGREGATE | (sketch BYTES) -> BYTES | Creates a sketch that represents the union of the given column of sketches.\<br\>\<br\>Param sketch: the column of sketches. Each as BYTES.\<br\>Defaults: lg\_k = 12, seed = 9001.\<br\>Returns: a Compact, Compressed Theta Sketch, as BYTES. |
| [theta_sketch_agg_string](../definitions/theta/theta_sketch_agg_string.sqlx) | AGGREGATE | (str STRING) -> BYTES | Creates a sketch that represents the cardinality of the given STRING column.\<br\>  \<br\>Param str: the STRING column of identifiers.\<br\>Defaults: lg\_k = 12, seed = 9001, p = 1.0.\<br\>Returns: a Compact, Compressed Theta Sketch, as BYTES.  |
| [theta_sketch_agg_union_lgk_seed](../definitions/theta/theta_sketch_agg_union_lgk_seed.sqlx) | AGGREGATE | (sketch BYTES, params STRUCT<lg_k BYTEINT, seed INT64> NOT AGGREGATE) -> BYTES | Creates a sketch that represents the union of the given column of sketches.\<br\>\<br\>Param sketch: the column of sketches. Each as BYTES.\<br\>Param lg\_k: the sketch accuracy/size parameter as a BYTEINT in the range \[4, 26\].\<br\>Param seed: This is used to confirm that the given sketches were configured with the correct seed.\<br\>Returns: a Compact, Compressed Theta Sketch, as BYTES. |
| [theta_sketch_agg_int64_lgk_seed_p](../definitions/theta/theta_sketch_agg_int64_lgk_seed_p.sqlx) | AGGREGATE | (value INT64, params STRUCT<lg_k BYTEINT, seed INT64, p FLOAT64> NOT AGGREGATE) -> BYTES | Creates a sketch that represents the cardinality of the given INT64 column.\<br\>\<br\>Param value: the INT64 column of identifiers.\<br\>Param lg\_k: the sketch accuracy/size parameter as a BYTEINT in the range \[4, 26\]. A NULL specifies the default of 12.\<br\>Param seed: the seed to be used by the underlying hash function. A NULL specifies the default of 9001.\<br\>Param p: up\-front sampling probability. A NULL specifies the default of 1.0.\<br\>Returns: a Compact, Compressed Theta Sketch, as BYTES. |
| [theta_sketch_agg_string_lgk_seed_p](../definitions/theta/theta_sketch_agg_string_lgk_seed_p.sqlx) | AGGREGATE | (str STRING, params STRUCT<lg_k BYTEINT, seed INT64, p FLOAT64> NOT AGGREGATE) -> BYTES | Creates a sketch that represents the cardinality of the given STRING column.\<br\>\<br\>Param str: the STRING column of identifiers.\<br\>Param lg\_k: the sketch accuracy/size parameter as a BYTEINT in the range \[4, 26\]. A NULL specifies the default of 12.\<br\>Param seed: the seed to be used by the underlying hash function. A NULL specifies the default of 9001.\<br\>Param p: up\-front sampling probability. A NULL specifies the default of 1.0.\<br\>Returns: a Compact, Compressed Theta Sketch, as BYTES. |
| [theta_sketch_get_estimate](../definitions/theta/theta_sketch_get_estimate.sqlx) | SCALAR | (sketch BYTES) -> FLOAT64 | Gets cardinality estimate and bounds from given sketch.\<br\>  \<br\>Param sketch: The given sketch to query as BYTES.\<br\>Defaults: seed = 9001.\<br\>Returns: a FLOAT64 value as the cardinality estimate. |
| [theta_sketch_to_string](../definitions/theta/theta_sketch_to_string.sqlx) | SCALAR | (sketch BYTES) -> STRING | Returns a summary string that represents the state of the given sketch.\<br\>\<br\>Param sketch: the given sketch as BYTES.\<br\>Defaults: seed = 9001.\<br\>Returns: a STRING that represents the state of the given sketch. |
| [theta_sketch_get_num_retained](../definitions/theta/theta_sketch_get_num_retained.sqlx) | SCALAR | (sketch BYTES) -> INT | Returns the number of retained entries in the given sketch.\<br\>  \<br\>Param sketch: The given sketch to query as BYTES.\<br\>Defaults: seed = 9001.\<br\>Returns: number of retained entries as INT. |
| [theta_sketch_get_theta](../definitions/theta/theta_sketch_get_theta.sqlx) | SCALAR | (sketch BYTES) -> FLOAT64 | Returns theta \(effective sampling rate\) as a fraction from 0 to 1.\<br\>  \<br\>Param sketch: The given sketch to query as BYTES.\<br\>Defaults: seed = 9001.\<br\>Returns: theta as FLOAT64. |
| [theta_sketch_get_num_retained_seed](../definitions/theta/theta_sketch_get_num_retained_seed.sqlx) | SCALAR | (sketch BYTES, seed INT64) -> INT | Returns the number of retained entries in the given sketch.\<br\>  \<br\>Param sketch: The given sketch to query as BYTES.\<br\>Param seed: This is used to confirm that the given sketch was configured with the correct seed.\<br\>Returns: number of retained entries as INT. |
| [theta_sketch_get_estimate_seed](../definitions/theta/theta_sketch_get_estimate_seed.sqlx) | SCALAR | (sketch BYTES, seed INT64) -> FLOAT64 | Gets cardinality estimate and bounds from given sketch.\<br\>  \<br\>Param sketch: The given sketch to query as BYTES.\<br\>Param seed: This is used to confirm that the given sketch was configured with the correct seed.\<br\>Returns: a FLOAT64 value as the cardinality estimate. |
| [theta_sketch_to_string_seed](../definitions/theta/theta_sketch_to_string_seed.sqlx) | SCALAR | (sketch BYTES, seed INT64) -> STRING | Returns a summary string that represents the state of the given sketch.\<br\>\<br\>Param sketch: the given sketch as BYTES.\<br\>Param seed: This is used to confirm that the given sketch was configured with the correct seed.\<br\>Returns: a STRING that represents the state of the given sketch. |
| [theta_sketch_get_theta_seed](../definitions/theta/theta_sketch_get_theta_seed.sqlx) | SCALAR | (sketch BYTES, seed INT64) -> FLOAT64 | Returns theta \(effective sampling rate\) as a fraction from 0 to 1.\<br\>  \<br\>Param sketch: The given sketch to query as BYTES.\<br\>Param seed: This is used to confirm that the given sketch was configured with the correct seed.\<br\>Returns: theta as FLOAT64. |
| [theta_sketch_intersection](../definitions/theta/theta_sketch_intersection.sqlx) | SCALAR | (sketchA BYTES, sketchB BYTES) -> BYTES | Computes a sketch that represents the scalar intersection of the two given sketches.\<br\>\<br\>Param sketchA: the first sketch as BYTES.\<br\>Param sketchB: the second sketch as BYTES.\<br\>Defaults: seed = 9001.\<br\>Returns: a Compact, Compressed Theta Sketch, as BYTES. |
| [theta_sketch_union](../definitions/theta/theta_sketch_union.sqlx) | SCALAR | (sketchA BYTES, sketchB BYTES) -> BYTES | Computes a sketch that represents the scalar union of the two given sketches.\<br\>\<br\>Param sketchA: the first sketch as BYTES.\<br\>Param sketchB: the second sketch as BYTES.\<br\>Defaults: lg\_k = 12, seed = 9001.\<br\>Returns: a Compact, Compressed Theta Sketch, as BYTES. |
| [theta_sketch_a_not_b](../definitions/theta/theta_sketch_a_not_b.sqlx) | SCALAR | (sketchA BYTES, sketchB BYTES) -> BYTES | Computes a sketch that represents the scalar set difference: sketchA and not sketchB.\<br\>\<br\>Param sketchA: the first sketch "A" as bytes.\<br\>Param sketchB: the second sketch "B" as bytes.\<br\>Defaults: seed = 9001.\<br\>Returns: a Compact, Compressed Theta Sketch, as BYTES. |
| [theta_sketch_intersection_seed](../definitions/theta/theta_sketch_intersection_seed.sqlx) | SCALAR | (sketchA BYTES, sketchB BYTES, seed INT64) -> BYTES | Computes a sketch that represents the scalar intersection of the two given sketches.\<br\>\<br\>Param sketchA: the first sketch as BYTES.\<br\>Param sketchB: the second sketch as BYTES.\<br\>Param seed: This is used to confirm that the given sketches were configured with the correct seed.\<br\>Returns: a Compact, Compressed Theta Sketch, as BYTES. |
| [theta_sketch_a_not_b_seed](../definitions/theta/theta_sketch_a_not_b_seed.sqlx) | SCALAR | (sketchA BYTES, sketchB BYTES, seed INT64) -> BYTES | Computes a sketch that represents the scalar set difference: sketchA and not sketchB.\<br\>\<br\>Param sketchA: the first sketch "A" as bytes.\<br\>Param sketchB: the second sketch "B" as bytes.\<br\>Param seed: This is used to confirm that the given sketches were configured with the correct seed.\<br\>Returns: a Compact, Compressed Theta Sketch, as BYTES. |
| [theta_sketch_union_lgk_seed](../definitions/theta/theta_sketch_union_lgk_seed.sqlx) | SCALAR | (sketchA BYTES, sketchB BYTES, lg_k BYTEINT, seed INT64) -> BYTES | Computes a sketch that represents the scalar union of the two given sketches.\<br\>\<br\>Param sketchA: the first sketch as BYTES.\<br\>Param sketchB: the second sketch as BYTES.\<br\>Param lg\_k: the sketch accuracy/size parameter as an integer in the range \[4, 26\].\<br\>Param seed: This is used to confirm that the given sketches were configured with the correct seed.\<br\>Returns: a Compact, Compressed Theta Sketch, as BYTES. |
| [theta_sketch_get_estimate_and_bounds](../definitions/theta/theta_sketch_get_estimate_and_bounds.sqlx) | SCALAR | (sketch BYTES, num_std_devs BYTEINT) -> STRUCT<estimate FLOAT64, lower_bound FLOAT64, upper_bound FLOAT64> | Gets cardinality estimate and bounds from given sketch.\<br\>\<br\>Param sketch: The given sketch to query as BYTES.\<br\>Param num\_std\_devs: The returned bounds will be based on the statistical confidence interval\<br\>  determined by the given number of standard deviations from the returned estimate.\<br\>  This number may be one of {1,2,3}, where 1 represents 68% confidence,\<br\>  2 represents 95% confidence and 3 represents 99.7% confidence.\<br\>  For example, if the given num\_std\_devs = 2 and the returned values are {1000, 990, 1010}\<br\>  that means that with 95% confidence, the true value lies within the range \[990, 1010\].\<br\>Defaults: seed = 9001.\<br\>Returns: a STRUCT with three FLOAT64 values as {estimate, lower\_bound, upper\_bound}. |
| [theta_sketch_jaccard_similarity](../definitions/theta/theta_sketch_jaccard_similarity.sqlx) | SCALAR | (sketchA BYTES, sketchB BYTES) -> STRUCT<lower_bound FLOAT64, estimate FLOAT64, upper_bound FLOAT64> | Computes the Jaccard similarity index with upper and lower bounds.\<br\>The Jaccard similarity index J\(A,B\) = \(A ^ B\)/\(A U B\) is used to measure how similar the two sketches are to each other.\<br\>If J = 1.0, the sketches are considered equal. If J = 0, the two sketches are disjoint.\<br\>A Jaccard of .95 means the overlap between the two sets is 95% of the union of the two sets.\<br\>\<br\>Param sketchA: the first sketch as bytes.\<br\>Param sketchB: the second sketch as bytes.\<br\>Defaults: seed = 9001.\<br\>Returns: a STRUCT with three FLOAT64 values {lower\_bound, estimate, upper\_bound} of the Jaccard index. |
| [theta_sketch_get_estimate_and_bounds_seed](../definitions/theta/theta_sketch_get_estimate_and_bounds_seed.sqlx) | SCALAR | (sketch BYTES, num_std_devs BYTEINT, seed INT64) -> STRUCT<estimate FLOAT64, lower_bound FLOAT64, upper_bound FLOAT64> | Gets cardinality estimate and bounds from given sketch.\<br\>\<br\>Param sketch: The given sketch to query as BYTES.\<br\>Param num\_std\_devs: The returned bounds will be based on the statistical confidence interval\<br\>  determined by the given number of standard deviations from the returned estimate.\<br\>  This number may be one of {1,2,3}, where 1 represents 68% confidence,\<br\>  2 represents 95% confidence and 3 represents 99.7% confidence.\<br\>  For example, if the given num\_std\_devs = 2 and the returned values are {1000, 990, 1010}\<br\>  that means that with 95% confidence, the true value lies within the range \[990, 1010\].\<br\>Param seed: This is used to confirm that the given sketch was configured with the correct seed.\<br\>Returns: a STRUCT with three FLOAT64 values as {estimate, lower\_bound, upper\_bound}. |
| [theta_sketch_jaccard_similarity_seed](../definitions/theta/theta_sketch_jaccard_similarity_seed.sqlx) | SCALAR | (sketchA BYTES, sketchB BYTES, seed INT64) -> STRUCT<lower_bound FLOAT64, estimate FLOAT64, upper_bound FLOAT64> | Computes the Jaccard similarity index with upper and lower bounds.\<br\>The Jaccard similarity index J\(A,B\) = \(A ^ B\)/\(A U B\) is used to measure how similar the two sketches are to each other.\<br\>If J = 1.0, the sketches are considered equal. If J = 0, the two sketches are disjoint.\<br\>A Jaccard of .95 means the overlap between the two sets is 95% of the union of the two sets.\<br\>\<br\>Param sketchA: the first sketch as bytes.\<br\>Param sketchB: the second sketch as bytes.\<br\>Param seed: This is used to confirm that the given sketches were configured with the correct seed.\<br\>Returns: a STRUCT with three FLOAT64 values {lower\_bound, estimate, upper\_bound} of the Jaccard index. |

**Examples:**

```sql

# using defaults
create or replace table `$BQ_DATASET`.theta_sketch(sketch bytes);

insert into `$BQ_DATASET`.theta_sketch
(select `$BQ_DATASET`.theta_sketch_agg_int64(value) from unnest(GENERATE_ARRAY(1, 10000, 1)) as value);
insert into `$BQ_DATASET`.theta_sketch
(select `$BQ_DATASET`.theta_sketch_agg_int64(value) from unnest(GENERATE_ARRAY(100000, 110000, 1)) as value);

# expected about 20000
select `$BQ_DATASET`.theta_sketch_get_estimate_and_bounds(
  `$BQ_DATASET`.theta_sketch_agg_union(sketch),
  2
) from `$BQ_DATASET`.theta_sketch;

# expected estimate about 20000
select `$BQ_DATASET`.theta_sketch_to_string(
  `$BQ_DATASET`.theta_sketch_agg_union(sketch)
) from `$BQ_DATASET`.theta_sketch;

select `$BQ_DATASET`.theta_sketch_get_theta(
  `$BQ_DATASET`.theta_sketch_agg_union(sketch)
) from `$BQ_DATASET`.theta_sketch;

select `$BQ_DATASET`.theta_sketch_get_num_retained(
  `$BQ_DATASET`.theta_sketch_agg_union(sketch)
) from `$BQ_DATASET`.theta_sketch;

drop table `$BQ_DATASET`.theta_sketch;

# using full signatures
create or replace table `$BQ_DATASET`.theta_sketch(sketch bytes);

insert into `$BQ_DATASET`.theta_sketch
(select `$BQ_DATASET`.theta_sketch_agg_int64_lgk_seed_p(value, struct<int, int, float64>(14, 111, 0.9)) from unnest(GENERATE_ARRAY(1, 10000, 1)) as value);
insert into `$BQ_DATASET`.theta_sketch
(select `$BQ_DATASET`.theta_sketch_agg_int64_lgk_seed_p(value, struct<int, int, float64>(14, 111, 0.9)) from unnest(GENERATE_ARRAY(100000, 110000, 1)) as value);

# expected about 20000
select `$BQ_DATASET`.theta_sketch_get_estimate_and_bounds_seed(
  `$BQ_DATASET`.theta_sketch_agg_union_lgk_seed(sketch, struct<int, int>(10, 111)),
  2,
  111
) from `$BQ_DATASET`.theta_sketch;

# expected estimate about 20000
select `$BQ_DATASET`.theta_sketch_to_string_seed(
  `$BQ_DATASET`.theta_sketch_agg_union_lgk_seed(sketch, struct<int, int>(10, 111)),
  111
) from `$BQ_DATASET`.theta_sketch;

select `$BQ_DATASET`.theta_sketch_get_theta_seed(
  `$BQ_DATASET`.theta_sketch_agg_union_lgk_seed(sketch, struct<int, int>(10, 111)),
  111
) from `$BQ_DATASET`.theta_sketch;

select `$BQ_DATASET`.theta_sketch_get_num_retained_seed(
  `$BQ_DATASET`.theta_sketch_agg_union_lgk_seed(sketch, struct<int, int>(10, 111)),
  111
) from `$BQ_DATASET`.theta_sketch;

drop table `$BQ_DATASET`.theta_sketch;

# using defaults
# expected 5
select `$BQ_DATASET`.theta_sketch_get_estimate(
  `$BQ_DATASET`.theta_sketch_union(
    (select `$BQ_DATASET`.theta_sketch_agg_string(str) from unnest(["a", "b", "c"]) as str),
    (select `$BQ_DATASET`.theta_sketch_agg_string(str) from unnest(["c", "d", "e"]) as str)
  )
);

# full signatures
# expected 5
select `$BQ_DATASET`.theta_sketch_get_estimate_seed(
  `$BQ_DATASET`.theta_sketch_union_lgk_seed(
    (select `$BQ_DATASET`.theta_sketch_agg_string_lgk_seed_p(str, struct<int, int, float64>(10, 111, 0.999)) from unnest(["a", "b", "c"]) as str),
    (select `$BQ_DATASET`.theta_sketch_agg_string_lgk_seed_p(str, struct<int, int, float64>(10, 111, 0.999)) from unnest(["c", "d", "e"]) as str),
    10,
    111
  ),
  111
);

# using defaults
# expected 1
select `$BQ_DATASET`.theta_sketch_get_estimate(
  `$BQ_DATASET`.theta_sketch_intersection(
    (select `$BQ_DATASET`.theta_sketch_agg_string(str) from unnest(["a", "b", "c"]) as str),
    (select `$BQ_DATASET`.theta_sketch_agg_string(str) from unnest(["c", "d", "e"]) as str)
  )
);

# full signatures
# expected 1
select `$BQ_DATASET`.theta_sketch_get_estimate_seed(
  `$BQ_DATASET`.theta_sketch_intersection_seed(
    (select `$BQ_DATASET`.theta_sketch_agg_string_lgk_seed_p(str, struct<int, int, float64>(10, 111, 0.999)) from unnest(["a", "b", "c"]) as str),
    (select `$BQ_DATASET`.theta_sketch_agg_string_lgk_seed_p(str, struct<int, int, float64>(10, 111, 0.999)) from unnest(["c", "d", "e"]) as str),
    111
  ),
  111
);

# using defaults
# expected 2
select `$BQ_DATASET`.theta_sketch_get_estimate(
  `$BQ_DATASET`.theta_sketch_a_not_b(
    (select `$BQ_DATASET`.theta_sketch_agg_string(str) from unnest(["a", "b", "c"]) as str),
    (select `$BQ_DATASET`.theta_sketch_agg_string(str) from unnest(["c", "d", "e"]) as str)
  )
);

# full signatures
# expected 2
select `$BQ_DATASET`.theta_sketch_get_estimate_seed(
  `$BQ_DATASET`.theta_sketch_a_not_b_seed(
    (select `$BQ_DATASET`.theta_sketch_agg_string_lgk_seed_p(str, struct<int, int, float64>(10, 111, 0.999)) from unnest(["a", "b", "c"]) as str),
    (select `$BQ_DATASET`.theta_sketch_agg_string_lgk_seed_p(str, struct<int, int, float64>(10, 111, 0.999)) from unnest(["c", "d", "e"]) as str),
    111
  ),
  111
);

# using defaults
# expected 0.2
select `$BQ_DATASET`.theta_sketch_jaccard_similarity(
  (select `$BQ_DATASET`.theta_sketch_agg_string(str) from unnest(["a", "b", "c"]) as str),
  (select `$BQ_DATASET`.theta_sketch_agg_string(str) from unnest(["c", "d", "e"]) as str)
);

# using full signatures
# expected 0.2
select `$BQ_DATASET`.theta_sketch_jaccard_similarity_seed(
  (select `$BQ_DATASET`.theta_sketch_agg_string_lgk_seed_p(str, struct<int, int, float64>(10, 111, 0.999)) from unnest(["a", "b", "c"]) as str),
  (select `$BQ_DATASET`.theta_sketch_agg_string_lgk_seed_p(str, struct<int, int, float64>(10, 111, 0.999)) from unnest(["c", "d", "e"]) as str),
  111
);
```
