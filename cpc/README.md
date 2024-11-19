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

# Apache DataSketches CPC Sketches for Google BigQuery

CPC sketches are a compact and efficient way to estimate the
cardinality of a dataset, especially in distributed environments. They provide
accurate estimates with low memory usage and are particularly useful for
applications like counting unique users, analyzing website traffic, or tracking
distinct events.

Please visit 
[CPC Sketches](https://datasketches.apache.org/docs/CPC/CpcSketches.html) 
for more information about this sketch family.

Please visit the main 
[Apache DataSketches website](https://datasketches.apache.org) 
for more information about DataSketches library.

If you are interested in making contributions to this project please see our 
[Community](https://datasketches.apache.org/docs/Community/) 
page for how to contact us.

| Function Name | Function Type | Signature | Description |
|---|---|---|---|
| [cpc_sketch_agg_union](cpc_sketch_agg_union.sqlx) | AGGREGATE | (sketch BYTES) -> BYTES | Creates a sketch that represents the union of the given column of sketches.\<br\>\<br\>Param sketch: the column of sketches. Each as BYTES.\<br\>Defaults: lg\_k = 12, seed = 9001.\<br\>Returns: a Compact, Compressed CPC Sketch, as BYTES. |
| [cpc_sketch_agg_string](cpc_sketch_agg_string.sqlx) | AGGREGATE | (str STRING) -> BYTES | Creates a sketch that represents the cardinality of the given STRING column.\<br\>\<br\>Param str: the STRING column of identifiers.\<br\>Defaults: lg\_k = 12, seed = 9001.\<br\>Returns: a Compact, Compressed CPC Sketch, as BYTES  |
| [cpc_sketch_agg_int64](cpc_sketch_agg_int64.sqlx) | AGGREGATE | (value INT64) -> BYTES | Creates a sketch that represents the cardinality of the given INT64 column.\<br\>\<br\>Param value: the INT64 column of identifiers.\<br\>Defaults: lg\_k = 12, seed = 9001.\<br\>Returns: a Compact, Compressed CPC Sketch, as BYTES  |
| [cpc_sketch_agg_string_lgk_seed](cpc_sketch_agg_string_lgk_seed.sqlx) | AGGREGATE | (str STRING, params STRUCT<lg_k BYTEINT, seed INT64> NOT AGGREGATE) -> BYTES | Creates a sketch that represents the cardinality of the given STRING column.\<br\>\<br\>Param str: the STRING column of identifiers.\<br\>Param lg\_k: the sketch accuracy/size parameter as an integer in the range \[4, 26\].\<br\>Param seed: the seed to be used by the underlying hash function.\<br\>Returns: a Compact, Compressed CPC Sketch, as BYTES  |
| [cpc_sketch_agg_union_lgk_seed](cpc_sketch_agg_union_lgk_seed.sqlx) | AGGREGATE | (sketch BYTES, params STRUCT<lg_k BYTEINT, seed INT64> NOT AGGREGATE) -> BYTES | Creates a sketch that represents the union of the given column of sketches.\<br\>\<br\>Param sketch: the column of sketches. Each as BYTES.\<br\>Param lg\_k: the sketch accuracy/size parameter as an integer in the range \[4, 26\].\<br\>Param seed: This is used to confirm that the given sketches were configured with the correct seed.\<br\>Returns: a Compact, Compressed CPC Sketch, as BYTES. |
| [cpc_sketch_agg_int64_lgk_seed](cpc_sketch_agg_int64_lgk_seed.sqlx) | AGGREGATE | (value INT64, params STRUCT<lg_k BYTEINT, seed INT64> NOT AGGREGATE) -> BYTES | Creates a sketch that represents the cardinality of the given INT64 column.\<br\>\<br\>Param value: the INT64 column of identifiers.\<br\>Param lg\_k: the sketch accuracy/size parameter as an integer in the range \[4, 26\].\<br\>Param seed: the seed to be used by the underlying hash function.\<br\>Returns: a Compact, Compressed CPC Sketch, as BYTES  |
| [cpc_sketch_get_estimate](cpc_sketch_get_estimate.sqlx) | SCALAR | (sketch BYTES) -> FLOAT64 | Gets cardinality estimate and bounds from given sketch.\<br\>\<br\>Param sketch: The given sketch to query as BYTES.\<br\>Defaults: seed = 9001.\<br\>Returns: a FLOAT64 value as the cardinality estimate. |
| [cpc_sketch_to_string](cpc_sketch_to_string.sqlx) | SCALAR | (sketch BYTES) -> STRING | Returns a summary string that represents the state of the given sketch.\<br\>\<br\>Param sketch the given sketch as BYTES.\<br\>Defaults: seed = 9001.\<br\>Returns: a STRING that represents the state of the given sketch. |
| [cpc_sketch_get_estimate_seed](cpc_sketch_get_estimate_seed.sqlx) | SCALAR | (sketch BYTES, seed INT64) -> FLOAT64 | Gets cardinality estimate and bounds from given sketch.\<br\>\<br\>Param sketch: The given sketch to query as BYTES.\<br\>Param seed: This is used to confirm that the given sketch was configured with the correct seed.\<br\>Returns: a FLOAT64 value as the cardinality estimate. |
| [cpc_sketch_to_string_seed](cpc_sketch_to_string_seed.sqlx) | SCALAR | (sketch BYTES, seed INT64) -> STRING | Returns a summary string that represents the state of the given sketch.\<br\>\<br\>Param sketch the given sketch as BYTES.\<br\>Param seed: This is used to confirm that the given sketch was configured with the correct seed.\<br\>Returns: a STRING that represents the state of the given sketch. |
| [cpc_sketch_union](cpc_sketch_union.sqlx) | SCALAR | (sketchA BYTES, sketchB BYTES) -> BYTES | Computes a sketch that represents the scalar union of the two given sketches.\<br\>\<br\>Param sketchA: the first sketch as BYTES.\<br\>Param sketchB: the second sketch as BYTES.\<br\>Defaults: lg\_k = 12, seed = 9001.\<br\>Returns: a CPC Sketch, as BYTES. |
| [cpc_sketch_get_estimate_and_bounds](cpc_sketch_get_estimate_and_bounds.sqlx) | SCALAR | (sketch BYTES, num_std_devs BYTEINT) -> STRUCT<estimate FLOAT64, lower_bound FLOAT64, upper_bound FLOAT64> | Gets cardinality estimate and bounds from given sketch.\<br\>  \<br\>Param sketch: The given sketch to query as bytes.\<br\>Param num\_std\_devs: The returned bounds will be based on the statistical confidence interval determined by the given number of standard deviations\<br\>  from the returned estimate. This number may be one of {1,2,3}, where 1 represents 68% confidence, 2 represents 95% confidence and 3 represents 99.7% confidence.\<br\>  For example, if the given num\_std\_devs = 2 and the returned values are {1000, 990, 1010} that means that with 95% confidence, the true value lies within the range \[990, 1010\].\<br\>Defaults: seed = 9001.\<br\>Returns: a STRUCT with 3 FLOAT64 values as {estimate, lower\_bound, upper\_bound}. |
| [cpc_sketch_union_lgk_seed](cpc_sketch_union_lgk_seed.sqlx) | SCALAR | (sketchA BYTES, sketchB BYTES, lg_k BYTEINT, seed INT64) -> BYTES | Computes a sketch that represents the scalar union of the two given sketches.\<br\>\<br\>Param sketchA: the first sketch as BYTES.\<br\>Param sketchB: the second sketch as BYTES.\<br\>Param lg\_k: the sketch accuracy/size parameter as an integer in the range \[4, 26\].\<br\>Param seed: This is used to confirm that the given sketches were configured with the correct seed.\<br\>Returns: a CPC Sketch, as BYTES. |
| [cpc_sketch_get_estimate_and_bounds_seed](cpc_sketch_get_estimate_and_bounds_seed.sqlx) | SCALAR | (sketch BYTES, num_std_devs BYTEINT, seed INT64) -> STRUCT<estimate FLOAT64, lower_bound FLOAT64, upper_bound FLOAT64> | Gets cardinality estimate and bounds from given sketch.\<br\>  \<br\>Param sketch: The given sketch to query as bytes.\<br\>Param num\_std\_devs: The returned bounds will be based on the statistical confidence interval determined by the given number of standard deviations\<br\>  from the returned estimate. This number may be one of {1,2,3}, where 1 represents 68% confidence, 2 represents 95% confidence and 3 represents 99.7% confidence.\<br\>  For example, if the given num\_std\_devs = 2 and the returned values are {1000, 990, 1010} that means that with 95% confidence, the true value lies within the range \[990, 1010\].\<br\>Param seed: This is used to confirm that the given sketch was configured with the correct seed.\<br\>Returns: a STRUCT with 3 FLOAT64 values as {estimate, lower\_bound, upper\_bound}. |

**Examples:**

```sql

# using defaults
# expected 5
select `$BQ_DATASET`.cpc_sketch_get_estimate(
  `$BQ_DATASET`.cpc_sketch_union(
    (select `$BQ_DATASET`.cpc_sketch_agg_string(str) from unnest(["a", "b", "c"]) as str),
    (select `$BQ_DATASET`.cpc_sketch_agg_string(str) from unnest(["c", "d", "e"]) as str)
  )
);

# using full signatures
# expected 5
select `$BQ_DATASET`.cpc_sketch_get_estimate_seed(
  `$BQ_DATASET`.cpc_sketch_union_lgk_seed(
    (select `$BQ_DATASET`.cpc_sketch_agg_string_lgk_seed(str, struct<byteint, int64>(10, 111)) from unnest(["a", "b", "c"]) as str),
    (select `$BQ_DATASET`.cpc_sketch_agg_string_lgk_seed(str, struct<byteint, int64>(10, 111)) from unnest(["c", "d", "e"]) as str),
    10,
    111
  ),
  111
);

# using defaults
create or replace table `$BQ_DATASET`.cpc_sketch(sketch bytes);

insert into `$BQ_DATASET`.cpc_sketch
(select `$BQ_DATASET`.cpc_sketch_agg_int64(value) from unnest(GENERATE_ARRAY(1, 10000, 1)) as value);
insert into `$BQ_DATASET`.cpc_sketch
(select `$BQ_DATASET`.cpc_sketch_agg_int64(value) from unnest(GENERATE_ARRAY(100000, 110000, 1)) as value);

select `$BQ_DATASET`.cpc_sketch_to_string(sketch) from `$BQ_DATASET`.cpc_sketch;

# expected about 20000
select `$BQ_DATASET`.cpc_sketch_get_estimate(
  `$BQ_DATASET`.cpc_sketch_agg_union(sketch)
) from `$BQ_DATASET`.cpc_sketch;

select `$BQ_DATASET`.cpc_sketch_get_estimate_and_bounds(
  `$BQ_DATASET`.cpc_sketch_agg_union(sketch),
  3
) from `$BQ_DATASET`.cpc_sketch;

drop table `$BQ_DATASET`.cpc_sketch;

# using full signatures
create or replace table `$BQ_DATASET`.cpc_sketch(sketch bytes);

insert into `$BQ_DATASET`.cpc_sketch
(select `$BQ_DATASET`.cpc_sketch_agg_int64_lgk_seed(value, struct<byteint, int64>(10, 111)) from unnest(GENERATE_ARRAY(1, 10000, 1)) as value);
insert into `$BQ_DATASET`.cpc_sketch
(select `$BQ_DATASET`.cpc_sketch_agg_int64_lgk_seed(value, struct<byteint, int64>(10, 111)) from unnest(GENERATE_ARRAY(100000, 110000, 1)) as value);

select `$BQ_DATASET`.cpc_sketch_to_string_seed(sketch, 111) from `$BQ_DATASET`.cpc_sketch;

# expected about 20000
select `$BQ_DATASET`.cpc_sketch_get_estimate_seed(
  `$BQ_DATASET`.cpc_sketch_agg_union_lgk_seed(sketch, struct<byteint, int64>(10, 111)),
  111
) from `$BQ_DATASET`.cpc_sketch;

select `$BQ_DATASET`.cpc_sketch_get_estimate_and_bounds_seed(
  `$BQ_DATASET`.cpc_sketch_agg_union_lgk_seed(sketch, struct<byteint, int64>(10, 111)),
  3,
  111
) from `$BQ_DATASET`.cpc_sketch;

drop table `$BQ_DATASET`.cpc_sketch;
```
