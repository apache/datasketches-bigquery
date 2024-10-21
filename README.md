
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

# Apache DataSketches library functions for Google BigQuery

[User-Defined Aggregate Functions (UDAFs)](https://cloud.google.com/bigquery/docs/user-defined-aggregates) and
[non-aggregate (scalar) functions (UDFs)](https://cloud.google.com/bigquery/docs/user-defined-functions) for BigQuery SQL engine.

Please visit the main
[Apache DataSketches website](https://datasketches.apache.org)
for more information about DataSketches library.

If you are interested in making contributions to this project please see our
[Community](https://datasketches.apache.org/docs/Community/)
page for how to contact us.

## Requirements

- Requires [Emscripten (emcc compiler)](https://emscripten.org/)
- Requires a link to **/datasketches-cpp** in this repository
- Requires make utility
- Requires [Google Cloud CLI](https://cloud.google.com/sdk/docs/install)


## Building, Installing, and Testing

- Requires setting environment variables
    - JS_BUCKET: to hold compiled artifacts
    - BQ_PROJECT: location of stored SQL functions (routines)
    - BQ_DATASET: location of stored SQL functions (routines)

```
make          # performs compilation
make install  # upload to $JS_BUCKET & create functions in $BQ_PROJECT.$BQ_DATASET
make test     # runs predefined tests in BQ
```

The above steps can be executed in the root directory to install everything, or can be run from an individual sketch directory to install only that particular sketch.

## BigQuery Sketch Functions

DataSketches are probabilistic data structures that can process massive
amounts of data and return very accurate results with a small memory footprint.
Because of this, DataSketches are particularly useful for "big data" use cases
such as streaming analytics and data warehousing.

This package includes BigQuery UD(A)Fs for the following Sketch types:

| Sketch Type                                       | Description |
|---------------------------------------------------|---|
| [**Frequent Items Sketch**](#fi-sketch-functions) | Estimates the frequency of items in a stream to find the most frequent ones (e.g., top-selling products, most active users). |
| [**CPC Sketch**](#cpc-sketch-functions)           | A very compact sketch for estimating the number of unique items, especially in distributed environments. |
| [**HLL Sketch**](#hll-sketch-functions)           |  Memory-efficient sketch for estimating the number of unique items, optimized for high accuracy. |
| [**KLL Sketch**](#kll-sketch-functions)           |  Estimates the distribution of values, allowing you to find quantiles (like median, percentiles) without storing all the data. |
| [**Theta Sketch**](#theta-sketch-functions)       |  Estimates unique items and supports set operations (union, intersection, difference) on those items. |
| [**Tuple Sketch**](#tuple-sketch-functions)       |  Similar to Theta Sketch but allows associating values with each unique item, enabling operations like sum, min, max on those values. |

## CPC Sketch Functions

**Description:** CPC sketches are a compact and efficient way to estimate the
cardinality of a dataset, especially in distributed environments. They provide
accurate estimates with low memory usage and are particularly useful for
applications like counting unique users, analyzing website traffic, or tracking
distinct events.

| Function Name | Function Type | Signature | Description |
|---|---|---|---|
| [cpc_sketch_agg_union](cpc/sqlx/cpc_sketch_agg_union.sqlx) | AGGREGATE | (sketch BYTES) -> BYTES | Creates a sketch that represents the union of the given column of sketches.<br><br>Param sketch: the column of sketches. Each as BYTES.<br>Defaults: lg\_k = 12, seed = 9001.<br>Returns: a Compact, Compressed CPC Sketch, as BYTES.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/CPC/CpcSketches.html |
| [cpc_sketch_agg_string](cpc/sqlx/cpc_sketch_agg_string.sqlx) | AGGREGATE | (str STRING) -> BYTES | Creates a sketch that represents the cardinality of the given STRING column.<br><br>Param str: the STRING column of identifiers.<br>Defaults: lg\_k = 12, seed = 9001.<br>Returns: a Compact, Compressed CPC Sketch, as BYTES <br><br>For more information:<br> \- https://datasketches.apache.org/docs/CPC/CpcSketches.html |
| [cpc_sketch_agg_int64](cpc/sqlx/cpc_sketch_agg_int64.sqlx) | AGGREGATE | (value INT64) -> BYTES | Creates a sketch that represents the cardinality of the given INT64 column.<br><br>Param value: the INT64 column of identifiers.<br>Defaults: lg\_k = 12, seed = 9001.<br>Returns: a Compact, Compressed CPC Sketch, as BYTES <br><br>For more information:<br> \- https://datasketches.apache.org/docs/CPC/CpcSketches.html |
| [cpc_sketch_agg_string_lgk_seed](cpc/sqlx/cpc_sketch_agg_string_lgk_seed.sqlx) | AGGREGATE | (str STRING, params STRUCT<lg_k BYTEINT, seed INT64> NOT AGGREGATE) -> BYTES | Creates a sketch that represents the cardinality of the given STRING column.<br><br>Param str: the STRING column of identifiers.<br>Param lg\_k: the sketch accuracy/size parameter as an integer in the range \[4, 26\].<br>Param seed: the seed to be used by the underlying hash function.<br>Returns: a Compact, Compressed CPC Sketch, as BYTES <br><br>For more information:<br> \- https://datasketches.apache.org/docs/CPC/CpcSketches.html |
| [cpc_sketch_agg_union_lgk_seed](cpc/sqlx/cpc_sketch_agg_union_lgk_seed.sqlx) | AGGREGATE | (sketch BYTES, params STRUCT<lg_k BYTEINT, seed INT64> NOT AGGREGATE) -> BYTES | Creates a sketch that represents the union of the given column of sketches.<br><br>Param sketch: the column of sketches. Each as BYTES.<br>Param lg\_k: the sketch accuracy/size parameter as an integer in the range \[4, 26\].<br>Param seed: This is used to confirm that the given sketches were configured with the correct seed.<br>Returns: a Compact, Compressed CPC Sketch, as BYTES.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/CPC/CpcSketches.html |
| [cpc_sketch_agg_int64_lgk_seed](cpc/sqlx/cpc_sketch_agg_int64_lgk_seed.sqlx) | AGGREGATE | (value INT64, params STRUCT<lg_k BYTEINT, seed INT64> NOT AGGREGATE) -> BYTES | Creates a sketch that represents the cardinality of the given INT64 column.<br><br>Param value: the INT64 column of identifiers.<br>Param lg\_k: the sketch accuracy/size parameter as an integer in the range \[4, 26\].<br>Param seed: the seed to be used by the underlying hash function.<br>Returns: a Compact, Compressed CPC Sketch, as BYTES <br><br>For more information:<br> \- https://datasketches.apache.org/docs/CPC/CpcSketches.html |
| [cpc_sketch_get_estimate](cpc/sqlx/cpc_sketch_get_estimate.sqlx) | SCALAR | (sketch BYTES) -> FLOAT64 | Gets cardinality estimate and bounds from given sketch.<br><br>Param sketch: The given sketch to query as BYTES.<br>Defaults: seed = 9001.<br>Returns: a FLOAT64 value as the cardinality estimate.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/CPC/CpcSketches.html |
| [cpc_sketch_to_string](cpc/sqlx/cpc_sketch_to_string.sqlx) | SCALAR | (sketch BYTES) -> STRING | Returns a summary string that represents the state of the given sketch.<br><br>Param sketch the given sketch as BYTES.<br>Defaults: seed = 9001.<br>Returns: a STRING that represents the state of the given sketch.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/CPC/CpcSketches.html |
| [cpc_sketch_get_estimate_seed](cpc/sqlx/cpc_sketch_get_estimate_seed.sqlx) | SCALAR | (sketch BYTES, seed INT64) -> FLOAT64 | Gets cardinality estimate and bounds from given sketch.<br><br>Param sketch: The given sketch to query as BYTES.<br>Param seed: This is used to confirm that the given sketch was configured with the correct seed.<br>Returns: a FLOAT64 value as the cardinality estimate.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/CPC/CpcSketches.html |
| [cpc_sketch_to_string_seed](cpc/sqlx/cpc_sketch_to_string_seed.sqlx) | SCALAR | (sketch BYTES, seed INT64) -> STRING | Returns a summary string that represents the state of the given sketch.<br><br>Param sketch the given sketch as BYTES.<br>Param seed: This is used to confirm that the given sketch was configured with the correct seed.<br>Returns: a STRING that represents the state of the given sketch.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/CPC/CpcSketches.html |
| [cpc_sketch_union](cpc/sqlx/cpc_sketch_union.sqlx) | SCALAR | (sketchA BYTES, sketchB BYTES) -> BYTES | Computes a sketch that represents the scalar union of the two given sketches.<br><br>Param sketchA: the first sketch as BYTES.<br>Param sketchB: the second sketch as BYTES.<br>Defaults: lg\_k = 12, seed = 9001.<br>Returns: a CPC Sketch, as BYTES.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/CPC/CpcSketches.html |
| [cpc_sketch_get_estimate_and_bounds](cpc/sqlx/cpc_sketch_get_estimate_and_bounds.sqlx) | SCALAR | (sketch BYTES, num_std_devs BYTEINT) -> STRUCT<estimate FLOAT64, lower_bound FLOAT64, upper_bound FLOAT64> | Gets cardinality estimate and bounds from given sketch.<br>  <br>Param sketch: The given sketch to query as bytes.<br>Param num\_std\_devs: The returned bounds will be based on the statistical confidence interval determined by the given number of standard deviations<br>  from the returned estimate. This number may be one of {1,2,3}, where 1 represents 68% confidence, 2 represents 95% confidence and 3 represents 99.7% confidence.<br>  For example, if the given num\_std\_devs = 2 and the returned values are {1000, 990, 1010} that means that with 95% confidence, the true value lies within the range \[990, 1010\].<br>Defaults: seed = 9001.<br>Returns: a STRUCT with 3 FLOAT64 values as {estimate, lower\_bound, upper\_bound}.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/CPC/CpcSketches.html |
| [cpc_sketch_union_lgk_seed](cpc/sqlx/cpc_sketch_union_lgk_seed.sqlx) | SCALAR | (sketchA BYTES, sketchB BYTES, lg_k BYTEINT, seed INT64) -> BYTES | Computes a sketch that represents the scalar union of the two given sketches.<br><br>Param sketchA: the first sketch as BYTES.<br>Param sketchB: the second sketch as BYTES.<br>Param lg\_k: the sketch accuracy/size parameter as an integer in the range \[4, 26\].<br>Param seed: This is used to confirm that the given sketches were configured with the correct seed.<br>Returns: a CPC Sketch, as BYTES.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/CPC/CpcSketches.html |
| [cpc_sketch_get_estimate_and_bounds_seed](cpc/sqlx/cpc_sketch_get_estimate_and_bounds_seed.sqlx) | SCALAR | (sketch BYTES, num_std_devs BYTEINT, seed INT64) -> STRUCT<estimate FLOAT64, lower_bound FLOAT64, upper_bound FLOAT64> | Gets cardinality estimate and bounds from given sketch.<br>  <br>Param sketch: The given sketch to query as bytes.<br>Param num\_std\_devs: The returned bounds will be based on the statistical confidence interval determined by the given number of standard deviations<br>  from the returned estimate. This number may be one of {1,2,3}, where 1 represents 68% confidence, 2 represents 95% confidence and 3 represents 99.7% confidence.<br>  For example, if the given num\_std\_devs = 2 and the returned values are {1000, 990, 1010} that means that with 95% confidence, the true value lies within the range \[990, 1010\].<br>Param seed: This is used to confirm that the given sketch was configured with the correct seed.<br>Returns: a STRUCT with 3 FLOAT64 values as {estimate, lower\_bound, upper\_bound}.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/CPC/CpcSketches.html |

**Examples:**

```sql

# using defaults
# expected 5
select $BQ_DATASET.cpc_sketch_get_estimate(
  $BQ_DATASET.cpc_sketch_union(
    (select $BQ_DATASET.cpc_sketch_agg_string(str) from unnest(["a", "b", "c"]) as str),
    (select $BQ_DATASET.cpc_sketch_agg_string(str) from unnest(["c", "d", "e"]) as str)
  )
);

# using full signatures
# expected 5
select $BQ_DATASET.cpc_sketch_get_estimate_seed(
  $BQ_DATASET.cpc_sketch_union_lgk_seed(
    (select $BQ_DATASET.cpc_sketch_agg_string_lgk_seed(str, struct<byteint, int64>(10, 111)) from unnest(["a", "b", "c"]) as str),
    (select $BQ_DATASET.cpc_sketch_agg_string_lgk_seed(str, struct<byteint, int64>(10, 111)) from unnest(["c", "d", "e"]) as str),
    10,
    111
  ),
  111
);

# using defaults
create or replace table $BQ_DATASET.cpc_sketch(sketch bytes);

insert into $BQ_DATASET.cpc_sketch
(select $BQ_DATASET.cpc_sketch_agg_int64(value) from unnest(GENERATE_ARRAY(1, 10000, 1)) as value);
insert into $BQ_DATASET.cpc_sketch
(select $BQ_DATASET.cpc_sketch_agg_int64(value) from unnest(GENERATE_ARRAY(100000, 110000, 1)) as value);

select $BQ_DATASET.cpc_sketch_to_string(sketch) from $BQ_DATASET.cpc_sketch;

# expected about 20000
select $BQ_DATASET.cpc_sketch_get_estimate(
  $BQ_DATASET.cpc_sketch_agg_union(sketch)
) from $BQ_DATASET.cpc_sketch;

select $BQ_DATASET.cpc_sketch_get_estimate_and_bounds(
  $BQ_DATASET.cpc_sketch_agg_union(sketch),
  3
) from $BQ_DATASET.cpc_sketch;

drop table $BQ_DATASET.cpc_sketch;

# using full signatures
create or replace table $BQ_DATASET.cpc_sketch(sketch bytes);

insert into $BQ_DATASET.cpc_sketch
(select $BQ_DATASET.cpc_sketch_agg_int64_lgk_seed(value, struct<byteint, int64>(10, 111)) from unnest(GENERATE_ARRAY(1, 10000, 1)) as value);
insert into $BQ_DATASET.cpc_sketch
(select $BQ_DATASET.cpc_sketch_agg_int64_lgk_seed(value, struct<byteint, int64>(10, 111)) from unnest(GENERATE_ARRAY(100000, 110000, 1)) as value);

select $BQ_DATASET.cpc_sketch_to_string_seed(sketch, 111) from $BQ_DATASET.cpc_sketch;

# expected about 20000
select $BQ_DATASET.cpc_sketch_get_estimate_seed(
  $BQ_DATASET.cpc_sketch_agg_union_lgk_seed(sketch, struct<byteint, int64>(10, 111)),
  111
) from $BQ_DATASET.cpc_sketch;

select $BQ_DATASET.cpc_sketch_get_estimate_and_bounds_seed(
  $BQ_DATASET.cpc_sketch_agg_union_lgk_seed(sketch, struct<byteint, int64>(10, 111)),
  3,
  111
) from $BQ_DATASET.cpc_sketch;

drop table $BQ_DATASET.cpc_sketch;
```


## FI Sketch Functions

**Description:** Frequent Items (FI) sketches are used to estimate the
frequencies of items in a dataset. They are effective for identifying the most
frequent items, such as the top products purchased or the most popular search
queries.

| Function Name | Function Type | Signature | Description |
|---|---|---|---|
| [frequent_strings_sketch_merge](fi/sqlx/frequent_strings_sketch_merge.sqlx) | AGGREGATE | (sketch BYTES, lg_max_map_size BYTEINT NOT AGGREGATE) -> BYTES | Merges sketches from the given column.<br><br>Param sketch: the column of values.<br>Param lg\_max\_map\_size: the sketch accuracy/size parameter as an integer not less than 3.<br>Returns: a serialized Frequent Strings sketch as BYTES.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/Frequency/FrequencySketches.html |
| [frequent_strings_sketch_build](fi/sqlx/frequent_strings_sketch_build.sqlx) | AGGREGATE | (item STRING, weight INT64, lg_max_map_size BYTEINT NOT AGGREGATE) -> BYTES | Creates a sketch that represents frequencies of the given column.<br><br>Param item: the column of STRING values.<br>Param weight: the amount by which the weight of the item should be increased.<br>Param lg\_max\_map\_size: the sketch accuracy/size parameter as a BYTEINT not less than 3.<br>Returns: a Frequent Strings Sketch, as bytes.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/Frequency/FrequencySketches.html |
| [frequent_strings_sketch_to_string](fi/sqlx/frequent_strings_sketch_to_string.sqlx) | SCALAR | (sketch BYTES) -> STRING | Returns a summary string that represents the state of the given sketch.<br><br>Param sketch: the given sketch as sketch encoded bytes.<br>Returns: a string that represents the state of the given sketch.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/Frequency/FrequencySketches.html |
| [frequent_strings_sketch_get_result](fi/sqlx/frequent_strings_sketch_get_result.sqlx) | SCALAR | (sketch BYTES, error_type STRING, threshold INT64) -> ARRAY<STRUCT<item STRING, estimate INT64, lower_bound INT64, upper_bound INT64>> | Returns an array of rows that include frequent items, estimates, lower and upper bounds<br>given an error\_type and a threshold.<br><br>Param sketch: the given sketch as sketch encoded bytes.<br>Param error\_type: determines whether no false positives or no false negatives are desired.<br>Param threshold: a threshold to include items in the result list.<br>If NULL, the maximum error of the sketch is used as a threshold.<br>Returns: an array of frequent items with frequency estimates, lower and upper bounds.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/Frequency/FrequencySketches.html |

**Examples:**

```sql

select $BQ_DATASET.frequent_strings_sketch_to_string($BQ_DATASET.frequent_strings_sketch_build(str, 1, 5)) from unnest(["a", "b", "c"]) as str;

create or replace table $BQ_DATASET.fs_sketch(sketch bytes);

insert into $BQ_DATASET.fs_sketch
(select $BQ_DATASET.frequent_strings_sketch_build(str, 1, 5) from unnest(["a", "b", "c", "d"]) as str);

insert into $BQ_DATASET.fs_sketch
(select $BQ_DATASET.frequent_strings_sketch_build(str, 1, 5) from unnest(["a", "a", "c"]) as str);

select $BQ_DATASET.frequent_strings_sketch_get_result($BQ_DATASET.frequent_strings_sketch_merge(sketch, 5), "NO_FALSE_NEGATIVES", null) from $BQ_DATASET.fs_sketch;

drop table $BQ_DATASET.fs_sketch;
```


## HLL Sketch Functions

**Description:** HyperLogLog (HLL) sketches are another type of cardinality
estimation sketch. They are known for their high accuracy and low memory
consumption, making them suitable for large datasets and real-time analytics.

| Function Name | Function Type | Signature | Description |
|---|---|---|---|
| [hll_sketch_agg_string](hll/sqlx/hll_sketch_agg_string.sqlx) | AGGREGATE | (str STRING) -> BYTES | Creates a sketch that represents the cardinality of the given STRING column.<br><br>Param str: the STRING column of identifiers.<br>Defaults: lg\_k = 12, tgt\_type = HLL\_4.<br>Returns: an HLL Sketch, as BYTES.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/HLL/HllSketches.html |
| [hll_sketch_agg_union](hll/sqlx/hll_sketch_agg_union.sqlx) | AGGREGATE | (sketch BYTES) -> BYTES | Creates a sketch that represents the union of the given column of sketches.<br><br>Param sketch: the column of sketches. Each as BYTES.<br>Defaults: lg\_k = 12, tgt\_type = HLL\_4.<br>Returns: an HLL Sketch, as BYTES.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/HLL/HllSketches.html |
| [hll_sketch_agg_int64](hll/sqlx/hll_sketch_agg_int64.sqlx) | AGGREGATE | (value INT64) -> BYTES | Creates a sketch that represents the cardinality of the given INT64 column.<br><br>Param value: the INT64 column of identifiers.<br>Defaults: lg\_k = 12, tgt\_type = HLL\_4.<br>Returns: an HLL Sketch, as BYTES.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/HLL/HllSketches.html |
| [hll_sketch_agg_string_lgk_type](hll/sqlx/hll_sketch_agg_string_lgk_type.sqlx) | AGGREGATE | (str STRING, params STRUCT<lg_k BYTEINT, tgt_type STRING> NOT AGGREGATE) -> BYTES | Creates a sketch that represents the cardinality of the given STRING column.<br><br>Param str: the STRING column of identifiers.<br>Param lg\_k: the sketch accuracy/size parameter as an integer in the range \[4, 21\].<br>Param tgt\_type: The HLL type to use: one of {"HLL\_4", "HLL\_6", "HLL\_8"}.<br>Returns: an HLL Sketch, as BYTES.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/HLL/HllSketches.html |
| [hll_sketch_agg_union_lgk_type](hll/sqlx/hll_sketch_agg_union_lgk_type.sqlx) | AGGREGATE | (sketch BYTES, params STRUCT<lg_k BYTEINT, tgt_type STRING> NOT AGGREGATE) -> BYTES | Creates a sketch that represents the union of the given column of sketches.<br><br>Param sketch: the column of sketches. Each as BYTES.<br>Param lg\_k: the sketch accuracy/size parameter as an integer in the range \[4, 21\].<br>Param tgt\_type: The HLL type to use: one of {"HLL\_4", "HLL\_6", "HLL\_8"}.<br>Returns: an HLL Sketch, as BYTES.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/HLL/HllSketches.html |
| [hll_sketch_agg_int64_lgk_type](hll/sqlx/hll_sketch_agg_int64_lgk_type.sqlx) | AGGREGATE | (value INT64, params STRUCT<lg_k BYTEINT, tgt_type STRING> NOT AGGREGATE) -> BYTES | Creates a sketch that represents the cardinality of the given INT64 column.<br><br>Param value: the INT64 column of identifiers.<br>Param lg\_k: the sketch accuracy/size parameter as an integer in the range \[4, 21\].<br>Param tgt\_type: The HLL type to use: one of {"HLL\_4", "HLL\_6", "HLL\_8"}.<br>Returns: an HLL Sketch, as BYTES.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/HLL/HllSketches.html |
| [hll_sketch_get_estimate](hll/sqlx/hll_sketch_get_estimate.sqlx) | SCALAR | (sketch BYTES) -> FLOAT64 | Returns a summary string that represents the state of the given sketch.<br><br>Param sketch: the given sketch as BYTES.<br>Returns: the cardinality estimate as FLOAT64 value.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/HLL/HllSketches.html |
| [hll_sketch_to_string](hll/sqlx/hll_sketch_to_string.sqlx) | SCALAR | (sketch BYTES) -> STRING | Returns a summary string that represents the state of the given sketch.<br><br>Param sketch: the given sketch as BYTES.<br>Returns: a STRING that represents the state of the given sketch.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/HLL/HllSketches.html |
| [hll_sketch_union](hll/sqlx/hll_sketch_union.sqlx) | SCALAR | (sketchA BYTES, sketchB BYTES) -> BYTES | Computes a sketch that represents the union of the two given sketches.<br><br>Param sketchA: the first sketch as bytes.<br>Param sketchB: the second sketch as bytes.<br>Defaults: lg\_k = 12, tgt\_type = HLL\_4.<br>Returns: an HLL Sketch, as BYTES.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/HLL/HllSketches.html |
| [hll_sketch_union_lgk_type](hll/sqlx/hll_sketch_union_lgk_type.sqlx) | SCALAR | (sketchA BYTES, sketchB BYTES, lg_k BYTEINT, tgt_type STRING) -> BYTES | Computes a sketch that represents the union of the two given sketches.<br><br>Param sketchA: the first sketch as bytes.<br>Param sketchB: the second sketch as bytes.<br>Param lg\_k: the sketch accuracy/size parameter as an integer in the range \[4, 21\].<br>Param tgt\_type: The HLL type to use: one of {"HLL\_4", "HLL\_6", "HLL\_8"}.<br>Returns: an HLL Sketch, as BYTES.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/HLL/HllSketches.html |
| [hll_sketch_get_estimate_and_bounds](hll/sqlx/hll_sketch_get_estimate_and_bounds.sqlx) | SCALAR | (sketch BYTES, num_std_devs BYTEINT) -> STRUCT<estimate FLOAT64, lower_bound FLOAT64, upper_bound FLOAT64> | Gets cardinality estimate and bounds from given sketch.<br><br>Param sketch: The given sketch to query as BYTES.<br>Param num\_std\_devs: The returned bounds will be based on the statistical confidence interval determined by the given number of standard deviations<br>  from the returned estimate. This number may be one of {1,2,3}, where 1 represents 68% confidence, 2 represents 95% confidence and 3 represents 99.7% confidence.<br>  For example, if the given num\_std\_devs = 2 and the returned values are {1000, 990, 1010} that means that with 95% confidence, the true value lies within the range \[990, 1010\].<br>Returns: a struct with 3 FLOAT64 values as {estimate, lower\_bound, upper\_bound}.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/HLL/HllSketches.html |

**Examples:**

```sql

# expected 3
select $BQ_DATASET.hll_sketch_get_estimate($BQ_DATASET.hll_sketch_agg_string(s)) from unnest(["a", "b", "c"]) as s;

select $BQ_DATASET.hll_sketch_to_string($BQ_DATASET.hll_sketch_agg_string(s)) from unnest(["a", "b", "c"]) as s;

# expected 5
select $BQ_DATASET.hll_sketch_get_estimate_and_bounds(
  $BQ_DATASET.hll_sketch_union_lgk_type(
    (select $BQ_DATASET.hll_sketch_agg_string_lgk_type(str, struct<byteint, string>(10, "HLL_8")) from unnest(["a", "b", "c"]) as str),
    (select $BQ_DATASET.hll_sketch_agg_string_lgk_type(str, struct<byteint, string>(10, "HLL_8")) from unnest(["c", "d", "e"]) as str),
    10,
    "HLL_8"
  ),
  2
);

select $BQ_DATASET.hll_sketch_to_string(
  $BQ_DATASET.hll_sketch_union_lgk_type(
    (select $BQ_DATASET.hll_sketch_agg_string_lgk_type(str, struct<byteint, string>(10, "HLL_8")) from unnest(["a", "b", "c"]) as str),
    (select $BQ_DATASET.hll_sketch_agg_string_lgk_type(str, struct<byteint, string>(10, "HLL_8")) from unnest(["c", "d", "e"]) as str),
    10,
    "HLL_8"
  )
);

create or replace table $BQ_DATASET.hll_sketch(sketch bytes);

insert into $BQ_DATASET.hll_sketch
(select $BQ_DATASET.hll_sketch_agg_int64(value) from unnest(GENERATE_ARRAY(1, 10000, 1)) as value);
insert into $BQ_DATASET.hll_sketch
(select $BQ_DATASET.hll_sketch_agg_int64(value) from unnest(GENERATE_ARRAY(100000, 110000, 1)) as value);

# expected estimate about 20000
select $BQ_DATASET.hll_sketch_to_string(
  $BQ_DATASET.hll_sketch_agg_union(sketch)
) from $BQ_DATASET.hll_sketch;

select $BQ_DATASET.hll_sketch_to_string(
  $BQ_DATASET.hll_sketch_agg_union_lgk_type(sketch, struct<byteint, string>(10, "HLL_6"))
) from $BQ_DATASET.hll_sketch;

drop table $BQ_DATASET.hll_sketch;

create or replace table $BQ_DATASET.hll_sketch(sketch bytes);

insert into $BQ_DATASET.hll_sketch
(select $BQ_DATASET.hll_sketch_agg_int64_lgk_type(value, struct<int, string>(8, "HLL_6")) from unnest(GENERATE_ARRAY(1, 10000, 1)) as value);
insert into $BQ_DATASET.hll_sketch
(select $BQ_DATASET.hll_sketch_agg_int64_lgk_type(value, struct<int, string>(8, "HLL_6")) from unnest(GENERATE_ARRAY(100000, 110000, 1)) as value);

# expected estimate about 20000
select $BQ_DATASET.hll_sketch_to_string(
  $BQ_DATASET.hll_sketch_agg_union_lgk_type(sketch, struct<byteint, string>(8, "HLL_6"))
) from $BQ_DATASET.hll_sketch;

drop table $BQ_DATASET.hll_sketch;
```


## KLL Sketch Functions

**Description:** KLL sketches are quantile sketches that provide approximate
quantiles for a dataset. They are useful for understanding the distribution of
data and calculating percentiles, such as the median or 95th percentile.

| Function Name | Function Type | Signature | Description |
|---|---|---|---|
| [kll_sketch_float_build](kll/sqlx/kll_sketch_float_build.sqlx) | AGGREGATE | (value FLOAT64, k INT NOT AGGREGATE) -> BYTES | Creates a sketch that represents the distribution of the given column.<br><br>Param value: the column of FLOAT64 values.<br>Param k: the sketch accuracy/size parameter as an INT in the range \[8, 65535\].<br>Returns: a KLL Sketch, as bytes.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/KLL/KLLSketch.html |
| [kll_sketch_float_merge](kll/sqlx/kll_sketch_float_merge.sqlx) | AGGREGATE | (sketch BYTES, k INT NOT AGGREGATE) -> BYTES | Merges sketches from the given column.<br><br>Param sketch: the column of values.<br>Param k: the sketch accuracy/size parameter as an integer in the range \[8, 65535\].<br>Returns: a serialized KLL sketch as BYTES.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/KLL/KLLSketch.html |
| [kll_sketch_float_get_n](kll/sqlx/kll_sketch_float_get_n.sqlx) | SCALAR | (sketch BYTES) -> INT64 | Returns the length of the input stream.<br><br>Param sketch: the given sketch as BYTES.<br>Returns: stream length as INT64<br><br>For more information:<br> \- https://datasketches.apache.org/docs/KLL/KLLSketch.html |
| [kll_sketch_float_get_min_value](kll/sqlx/kll_sketch_float_get_min_value.sqlx) | SCALAR | (sketch BYTES) -> FLOAT64 | Returns the minimum value of the input stream.<br><br>Param sketch: the given sketch as BYTES.<br>Returns: min value as FLOAT64<br><br>For more information:<br> \- https://datasketches.apache.org/docs/KLL/KLLSketch.html |
| [kll_sketch_float_to_string](kll/sqlx/kll_sketch_float_to_string.sqlx) | SCALAR | (sketch BYTES) -> STRING | Returns a summary string that represents the state of the given sketch.<br><br>Param sketch: the given sketch as sketch encoded bytes.<br>Returns: a string that represents the state of the given sketch.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/KLL/KLLSketch.html |
| [kll_sketch_float_get_num_retained](kll/sqlx/kll_sketch_float_get_num_retained.sqlx) | SCALAR | (sketch BYTES) -> INT64 | Returns the number of retained items \(samples\) in the sketch.<br><br>Param sketch: the given sketch as BYTES.<br>Returns: number of retained items as INT64<br><br>For more information:<br> \- https://datasketches.apache.org/docs/KLL/KLLSketch.html |
| [kll_sketch_float_get_max_value](kll/sqlx/kll_sketch_float_get_max_value.sqlx) | SCALAR | (sketch BYTES) -> FLOAT64 | Returns the maximum value of the input stream.<br><br>Param sketch: the given sketch as BYTES.<br>Returns: max value as FLOAT64<br><br>For more information:<br> \- https://datasketches.apache.org/docs/KLL/KLLSketch.html |
| [kll_sketch_float_get_normalized_rank_error](kll/sqlx/kll_sketch_float_get_normalized_rank_error.sqlx) | SCALAR | (sketch BYTES, pmf BOOL) -> FLOAT64 | Returns the approximate rank error of the given sketch normalized as a fraction between zero and one.<br>Param sketch: the given sketch as BYTES.<br>Param pmf: if true, returns the "double\-sided" normalized rank error for the get\_PMF\(\) function.<br>Otherwise, it is the "single\-sided" normalized rank error for all the other queries.<br>Returns: normalized rank error as FLOAT64<br><br>For more information:<br> \- https://datasketches.apache.org/docs/KLL/KLLSketch.html |
| [kll_sketch_float_get_rank](kll/sqlx/kll_sketch_float_get_rank.sqlx) | SCALAR | (sketch BYTES, value FLOAT64, inclusive BOOL) -> FLOAT64 | Returns an approximation to the normalized rank, on the interval \[0.0, 1.0\], of the given value.<br><br>Param sketch: the given sketch in serialized form.<br>Param value: value to be ranked.<br>Param inclusive: if true the weight of the given value is included into the rank.<br>Returns: an approximate rank of the given value.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/KLL/KLLSketch.html |
| [kll_sketch_float_get_pmf](kll/sqlx/kll_sketch_float_get_pmf.sqlx) | SCALAR | (sketch BYTES, split_points ARRAY<FLOAT64>, inclusive BOOL) -> ARRAY<FLOAT64> | Returns an approximation to the Probability Mass Function \(PMF\)<br>of the input stream as an array of probability masses defined by the given split\_points.<br><br>Param sketch: the given sketch as BYTES.<br><br>Param split\_points: an array of M unique, monotonically increasing values <br>  \(of the same type as the input values\)<br>  that divide the input value domain into M\+1 non\-overlapping intervals.<br>  <br>  Each interval except for the end intervals starts with a split\-point and ends with the next split\-point in sequence.<br><br>  The first interval starts below the minimum value of the stream \(corresponding to a zero rank or zero probability\), <br>  and ends with the first split\-point<br><br>  The last \(m\+1\)th interval starts with the last split\-point <br>  and ends above the maximum value of the stream \(corresponding to a rank or probability of 1.0\).<br><br>Param inclusive: if true and the upper boundary of an interval equals a value retained by the sketch, the interval will include that value. <br>  If the lower boundary of an interval equals a value retained by the sketch, the interval will exclude that value.<br><br>  If false and the upper boundary of an interval equals a value retained by the sketch, the interval will exclude that value. <br>  If the lower boundary of an interval equals a value retained by the sketch, the interval will include that value.<br><br>Returns: the PMF as a FLOAT64 array of M\+1 probability masses on the interval \[0.0, 1.0\].<br>  The sum of the probability masses of all \(m\+1\) intervals is 1.0.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/KLL/KLLSketch.html |
| [kll_sketch_float_kolmogorov_smirnov](kll/sqlx/kll_sketch_float_kolmogorov_smirnov.sqlx) | SCALAR | (sketchA BYTES, sketchB BYTES, pvalue FLOAT64) -> BOOL | Performs the Kolmogorov\-Smirnov Test between two KLL sketches of type FLOAT64.<br>If the given sketches have insufficient data or if the sketch sizes are too small, this will return false.<br><br>Param sketchA: sketch A in serialized form.<br>Param sketchB: sketch B in serialized form.<br>Param pvalue: Target p\-value. Typically 0.001 to 0.1, e.g. 0.05.<br>Returns: boolean indicating whether we can reject the null hypothesis \(that the sketches<br>  reflect the same underlying distribution\) using the provided p\-value.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/KLL/KLLSketch.html |
| [kll_sketch_float_get_cdf](kll/sqlx/kll_sketch_float_get_cdf.sqlx) | SCALAR | (sketch BYTES, split_points ARRAY<FLOAT64>, inclusive BOOL) -> ARRAY<FLOAT64> | Returns an approximation to the Cumulative Distribution Function \(CDF\) <br>of the input stream as an array of cumulative probabilities defined by the given split\_points.<br><br>Param sketch: the given sketch as BYTES.<br><br>Param split\_points: an array of M unique, monotonically increasing values<br>  \(of the same type as the input values to the sketch\)<br>  that divide the input value domain into M\+1 overlapping intervals.<br>  <br>  The start of each interval is below the lowest input value retained by the sketch<br>  \(corresponding to a zero rank or zero probability\).<br>  <br>  The end of each interval is the associated split\-point except for the top interval<br>  where the end is the maximum input value of the stream.<br><br>Param inclusive: if true and the upper boundary of an interval equals a value retained by the sketch, the interval will include that value. <br>  If the lower boundary of an interval equals a value retained by the sketch, the interval will exclude that value.<br><br>  If false and the upper boundary of an interval equals a value retained by the sketch, the interval will exclude that value. <br>  If the lower boundary of an interval equals a value retained by the sketch, the interval will include that value.<br><br>Returns: the CDF as a monotonically increasing FLOAT64 array of M\+1 cumulative probablities on the interval \[0.0, 1.0\].<br>  The top\-most probability of the returned array is always 1.0.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/KLL/KLLSketch.html |
| [kll_sketch_float_get_quantile](kll/sqlx/kll_sketch_float_get_quantile.sqlx) | SCALAR | (sketch BYTES, rank FLOAT64, inclusive BOOL) -> FLOAT64 | Returns a value from the sketch that is the best approximation to a value from the original stream with the given rank.<br><br>Param sketch: the given sketch in serialized form.<br>Param rank: rank of a value in the hypothetical sorted stream.<br>Param inclusive: if true, the given rank is considered inclusive \(includes weight of a value\)<br>Returns: an approximate quantile associated with the given rank.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/KLL/KLLSketch.html |

**Examples:**

```sql

create or replace table $BQ_DATASET.kll_sketch(sketch bytes);

insert into $BQ_DATASET.kll_sketch
(select $BQ_DATASET.kll_sketch_float_build(value, 200) from unnest([1,2,3,4,5,6,7,8,9,10]) as value);
insert into $BQ_DATASET.kll_sketch
(select $BQ_DATASET.kll_sketch_float_build(value, 200) from unnest([11,12,13,14,15,16,17,18,19,20]) as value);

select $BQ_DATASET.kll_sketch_float_to_string(sketch) from $BQ_DATASET.kll_sketch;

# expected 0.5
select $BQ_DATASET.kll_sketch_float_get_rank($BQ_DATASET.kll_sketch_float_merge(sketch, null), 10, true) from $BQ_DATASET.kll_sketch;

# expected 10
select $BQ_DATASET.kll_sketch_float_get_quantile($BQ_DATASET.kll_sketch_float_merge(sketch, null), 0.5, true) from $BQ_DATASET.kll_sketch;

# expected 20
select $BQ_DATASET.kll_sketch_float_get_n($BQ_DATASET.kll_sketch_float_merge(sketch, null)) from $BQ_DATASET.kll_sketch;

# expected 0.5, 0.5
select $BQ_DATASET.kll_sketch_float_get_pmf($BQ_DATASET.kll_sketch_float_merge(sketch, null), [10.0], true) from $BQ_DATASET.kll_sketch;

# expected 0.5, 1
select $BQ_DATASET.kll_sketch_float_get_cdf($BQ_DATASET.kll_sketch_float_merge(sketch, null), [10.0], true) from $BQ_DATASET.kll_sketch;

# expected 1
select $BQ_DATASET.kll_sketch_float_get_min_value($BQ_DATASET.kll_sketch_float_merge(sketch, null)) from $BQ_DATASET.kll_sketch;

# expected 20
select $BQ_DATASET.kll_sketch_float_get_max_value($BQ_DATASET.kll_sketch_float_merge(sketch, null)) from $BQ_DATASET.kll_sketch;

drop table $BQ_DATASET.kll_sketch;

# expected about 1.3%
select $BQ_DATASET.kll_sketch_float_get_normalized_rank_error($BQ_DATASET.kll_sketch_float_build(value, null), false) from unnest(generate_array(1, 10000)) as value;

select $BQ_DATASET.kll_sketch_float_get_num_retained($BQ_DATASET.kll_sketch_float_build(value, null)) from unnest(generate_array(1, 10000)) as value;

# expected false
select $BQ_DATASET.kll_sketch_float_kolmogorov_smirnov(
  (select $BQ_DATASET.kll_sketch_float_build(value, null) from unnest([1,2,3,4,5,6,7,8,9,10]) as value),
  (select $BQ_DATASET.kll_sketch_float_build(value, null) from unnest([1,2,3,4,5,6,7,8,9,10]) as value),
  0.05
);

# expected true
select $BQ_DATASET.kll_sketch_float_kolmogorov_smirnov(
  (select $BQ_DATASET.kll_sketch_float_build(value, null) from unnest([1,2,3,4,5,6,7,8,9,10]) as value),
  (select $BQ_DATASET.kll_sketch_float_build(value, null) from unnest([11,12,13,14,15,16,17,18,19,20]) as value),
  0.05
);
```


## THETA Sketch Functions

**Description:** Theta sketches are used for set operations like union,
intersection, and difference. They are efficient for estimating the size of
these operations on large datasets, enabling applications like analyzing user
overlap or comparing different groups.

| Function Name | Function Type | Signature | Description |
|---|---|---|---|
| [theta_sketch_agg_int64](theta/sqlx/theta_sketch_agg_int64.sqlx) | AGGREGATE | (value INT64) -> BYTES | Creates a sketch that represents the cardinality of the given INT64 column.<br>  <br>Param value: the INT64 column of identifiers.<br>Defaults: lg\_k = 12, seed = 9001, p = 1.0.<br>Returns: a Compact, Compressed Theta Sketch, as BYTES. <br><br>For more information:<br> \- https://datasketches.apache.org/docs/Theta/ThetaSketches.html |
| [theta_sketch_agg_union](theta/sqlx/theta_sketch_agg_union.sqlx) | AGGREGATE | (sketch BYTES) -> BYTES | Creates a sketch that represents the union of the given column of sketches.<br><br>Param sketch: the column of sketches. Each as BYTES.<br>Defaults: lg\_k = 12, seed = 9001.<br>Returns: a Compact, Compressed Theta Sketch, as BYTES.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/Theta/ThetaSketches.html |
| [theta_sketch_agg_string](theta/sqlx/theta_sketch_agg_string.sqlx) | AGGREGATE | (str STRING) -> BYTES | Creates a sketch that represents the cardinality of the given STRING column.<br>  <br>Param str: the STRING column of identifiers.<br>Defaults: lg\_k = 12, seed = 9001, p = 1.0.<br>Returns: a Compact, Compressed Theta Sketch, as BYTES. <br><br>For more information:<br> \- https://datasketches.apache.org/docs/Theta/ThetaSketches.html |
| [theta_sketch_agg_union_lgk_seed](theta/sqlx/theta_sketch_agg_union_lgk_seed.sqlx) | AGGREGATE | (sketch BYTES, params STRUCT<lg_k BYTEINT, seed INT64> NOT AGGREGATE) -> BYTES | Creates a sketch that represents the union of the given column of sketches.<br><br>Param sketch: the column of sketches. Each as BYTES.<br>Param lg\_k: the sketch accuracy/size parameter as a BYTEINT in the range \[4, 26\].<br>Param seed: This is used to confirm that the given sketches were configured with the correct seed.<br>Returns: a Compact, Compressed Theta Sketch, as BYTES.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/Theta/ThetaSketches.html |
| [theta_sketch_agg_int64_lgk_seed_p](theta/sqlx/theta_sketch_agg_int64_lgk_seed_p.sqlx) | AGGREGATE | (value INT64, params STRUCT<lg_k BYTEINT, seed INT64, p FLOAT64> NOT AGGREGATE) -> BYTES | Creates a sketch that represents the cardinality of the given INT64 column.<br><br>Param value: the INT64 column of identifiers.<br>Param lg\_k: the sketch accuracy/size parameter as a BYTEINT in the range \[4, 26\]. A NULL specifies the default of 12.<br>Param seed: the seed to be used by the underlying hash function. A NULL specifies the default of 9001.<br>Param p: up\-front sampling probability. A NULL specifies the default of 1.0.<br>Returns: a Compact, Compressed Theta Sketch, as BYTES.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/Theta/ThetaSketches.html |
| [theta_sketch_agg_string_lgk_seed_p](theta/sqlx/theta_sketch_agg_string_lgk_seed_p.sqlx) | AGGREGATE | (str STRING, params STRUCT<lg_k BYTEINT, seed INT64, p FLOAT64> NOT AGGREGATE) -> BYTES | Creates a sketch that represents the cardinality of the given STRING column.<br><br>Param str: the STRING column of identifiers.<br>Param lg\_k: the sketch accuracy/size parameter as a BYTEINT in the range \[4, 26\]. A NULL specifies the default of 12.<br>Param seed: the seed to be used by the underlying hash function. A NULL specifies the default of 9001.<br>Param p: up\-front sampling probability. A NULL specifies the default of 1.0.<br>Returns: a Compact, Compressed Theta Sketch, as BYTES.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/Theta/ThetaSketches.html |
| [theta_sketch_get_estimate](theta/sqlx/theta_sketch_get_estimate.sqlx) | SCALAR | (sketch BYTES) -> FLOAT64 | Gets cardinality estimate and bounds from given sketch.<br>  <br>Param sketch: The given sketch to query as BYTES.<br>Defaults: seed = 9001.<br>Returns: a FLOAT64 value as the cardinality estimate.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/Theta/ThetaSketches.html |
| [theta_sketch_to_string](theta/sqlx/theta_sketch_to_string.sqlx) | SCALAR | (sketch BYTES) -> STRING | Returns a summary string that represents the state of the given sketch.<br><br>Param sketch: the given sketch as BYTES.<br>Defaults: seed = 9001.<br>Returns: a STRING that represents the state of the given sketch.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/Theta/ThetaSketches.html |
| [theta_sketch_get_num_retained](theta/sqlx/theta_sketch_get_num_retained.sqlx) | SCALAR | (sketch BYTES) -> INT | Returns the number of retained entries in the given sketch.<br>  <br>Param sketch: The given sketch to query as BYTES.<br>Defaults: seed = 9001.<br>Returns: number of retained entries as INT.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/Theta/ThetaSketches.html |
| [theta_sketch_get_theta](theta/sqlx/theta_sketch_get_theta.sqlx) | SCALAR | (sketch BYTES) -> FLOAT64 | Returns theta \(effective sampling rate\) as a fraction from 0 to 1.<br>  <br>Param sketch: The given sketch to query as BYTES.<br>Defaults: seed = 9001.<br>Returns: theta as FLOAT64.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/Theta/ThetaSketches.html |
| [theta_sketch_get_num_retained_seed](theta/sqlx/theta_sketch_get_num_retained_seed.sqlx) | SCALAR | (sketch BYTES, seed INT64) -> INT | Returns the number of retained entries in the given sketch.<br>  <br>Param sketch: The given sketch to query as BYTES.<br>Param seed: This is used to confirm that the given sketch was configured with the correct seed.<br>Returns: number of retained entries as INT.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/Theta/ThetaSketches.html |
| [theta_sketch_get_estimate_seed](theta/sqlx/theta_sketch_get_estimate_seed.sqlx) | SCALAR | (sketch BYTES, seed INT64) -> FLOAT64 | Gets cardinality estimate and bounds from given sketch.<br>  <br>Param sketch: The given sketch to query as BYTES.<br>Param seed: This is used to confirm that the given sketch was configured with the correct seed.<br>Returns: a FLOAT64 value as the cardinality estimate.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/Theta/ThetaSketches.html |
| [theta_sketch_to_string_seed](theta/sqlx/theta_sketch_to_string_seed.sqlx) | SCALAR | (sketch BYTES, seed INT64) -> STRING | Returns a summary string that represents the state of the given sketch.<br><br>Param sketch: the given sketch as BYTES.<br>Param seed: This is used to confirm that the given sketch was configured with the correct seed.<br>Returns: a STRING that represents the state of the given sketch.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/Theta/ThetaSketches.html |
| [theta_sketch_get_theta_seed](theta/sqlx/theta_sketch_get_theta_seed.sqlx) | SCALAR | (sketch BYTES, seed INT64) -> FLOAT64 | Returns theta \(effective sampling rate\) as a fraction from 0 to 1.<br>  <br>Param sketch: The given sketch to query as BYTES.<br>Param seed: This is used to confirm that the given sketch was configured with the correct seed.<br>Returns: theta as FLOAT64.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/Theta/ThetaSketches.html |
| [theta_sketch_intersection](theta/sqlx/theta_sketch_intersection.sqlx) | SCALAR | (sketchA BYTES, sketchB BYTES) -> BYTES | Computes a sketch that represents the scalar intersection of the two given sketches.<br><br>Param sketchA: the first sketch as BYTES.<br>Param sketchB: the second sketch as BYTES.<br>Defaults: seed = 9001.<br>Returns: a Compact, Compressed Theta Sketch, as BYTES.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/Theta/ThetaSketches.html |
| [theta_sketch_union](theta/sqlx/theta_sketch_union.sqlx) | SCALAR | (sketchA BYTES, sketchB BYTES) -> BYTES | Computes a sketch that represents the scalar union of the two given sketches.<br><br>Param sketchA: the first sketch as BYTES.<br>Param sketchB: the second sketch as BYTES.<br>Defaults: lg\_k = 12, seed = 9001.<br>Returns: a Compact, Compressed Theta Sketch, as BYTES.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/Theta/ThetaSketches.html |
| [theta_sketch_a_not_b](theta/sqlx/theta_sketch_a_not_b.sqlx) | SCALAR | (sketchA BYTES, sketchB BYTES) -> BYTES | Computes a sketch that represents the scalar set difference: sketchA and not sketchB.<br><br>Param sketchA: the first sketch "A" as bytes.<br>Param sketchB: the second sketch "B" as bytes.<br>Defaults: seed = 9001.<br>Returns: a Compact, Compressed Theta Sketch, as BYTES.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/Theta/ThetaSketches.html |
| [theta_sketch_intersection_seed](theta/sqlx/theta_sketch_intersection_seed.sqlx) | SCALAR | (sketchA BYTES, sketchB BYTES, seed INT64) -> BYTES | Computes a sketch that represents the scalar intersection of the two given sketches.<br><br>Param sketchA: the first sketch as BYTES.<br>Param sketchB: the second sketch as BYTES.<br>Param seed: This is used to confirm that the given sketches were configured with the correct seed.<br>Returns: a Compact, Compressed Theta Sketch, as BYTES.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/Theta/ThetaSketches.html |
| [theta_sketch_a_not_b_seed](theta/sqlx/theta_sketch_a_not_b_seed.sqlx) | SCALAR | (sketchA BYTES, sketchB BYTES, seed INT64) -> BYTES | Computes a sketch that represents the scalar set difference: sketchA and not sketchB.<br><br>Param sketchA: the first sketch "A" as bytes.<br>Param sketchB: the second sketch "B" as bytes.<br>Param seed: This is used to confirm that the given sketches were configured with the correct seed.<br>Returns: a Compact, Compressed Theta Sketch, as BYTES.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/Theta/ThetaSketches.html |
| [theta_sketch_union_lgk_seed](theta/sqlx/theta_sketch_union_lgk_seed.sqlx) | SCALAR | (sketchA BYTES, sketchB BYTES, lg_k BYTEINT, seed INT64) -> BYTES | Computes a sketch that represents the scalar union of the two given sketches.<br><br>Param sketchA: the first sketch as BYTES.<br>Param sketchB: the second sketch as BYTES.<br>Param lg\_k: the sketch accuracy/size parameter as an integer in the range \[4, 26\].<br>Param seed: This is used to confirm that the given sketches were configured with the correct seed.<br>Returns: a Compact, Compressed Theta Sketch, as BYTES.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/Theta/ThetaSketches.html |
| [theta_sketch_get_estimate_and_bounds](theta/sqlx/theta_sketch_get_estimate_and_bounds.sqlx) | SCALAR | (sketch BYTES, num_std_devs BYTEINT) -> STRUCT<estimate FLOAT64, lower_bound FLOAT64, upper_bound FLOAT64> | Gets cardinality estimate and bounds from given sketch.<br><br>Param sketch: The given sketch to query as BYTES.<br>Param num\_std\_devs: The returned bounds will be based on the statistical confidence interval<br>  determined by the given number of standard deviations from the returned estimate.<br>  This number may be one of {1,2,3}, where 1 represents 68% confidence,<br>  2 represents 95% confidence and 3 represents 99.7% confidence.<br>  For example, if the given num\_std\_devs = 2 and the returned values are {1000, 990, 1010}<br>  that means that with 95% confidence, the true value lies within the range \[990, 1010\].<br>Defaults: seed = 9001.<br>Returns: a STRUCT with three FLOAT64 values as {estimate, lower\_bound, upper\_bound}.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/Theta/ThetaSketches.html |
| [theta_sketch_jaccard_similarity](theta/sqlx/theta_sketch_jaccard_similarity.sqlx) | SCALAR | (sketchA BYTES, sketchB BYTES) -> STRUCT<lower_bound FLOAT64, estimate FLOAT64, upper_bound FLOAT64> | Computes the Jaccard similarity index with upper and lower bounds.<br>The Jaccard similarity index J\(A,B\) = \(A ^ B\)/\(A U B\) is used to measure how similar the two sketches are to each other.<br>If J = 1.0, the sketches are considered equal. If J = 0, the two sketches are disjoint.<br>A Jaccard of .95 means the overlap between the two sets is 95% of the union of the two sets.<br><br>Param sketchA: the first sketch as bytes.<br>Param sketchB: the second sketch as bytes.<br>Defaults: seed = 9001.<br>Returns: a STRUCT with three FLOAT64 values {lower\_bound, estimate, upper\_bound} of the Jaccard index.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/Theta/ThetaSketches.html |
| [theta_sketch_get_estimate_and_bounds_seed](theta/sqlx/theta_sketch_get_estimate_and_bounds_seed.sqlx) | SCALAR | (sketch BYTES, num_std_devs BYTEINT, seed INT64) -> STRUCT<estimate FLOAT64, lower_bound FLOAT64, upper_bound FLOAT64> | Gets cardinality estimate and bounds from given sketch.<br><br>Param sketch: The given sketch to query as BYTES.<br>Param num\_std\_devs: The returned bounds will be based on the statistical confidence interval<br>  determined by the given number of standard deviations from the returned estimate.<br>  This number may be one of {1,2,3}, where 1 represents 68% confidence,<br>  2 represents 95% confidence and 3 represents 99.7% confidence.<br>  For example, if the given num\_std\_devs = 2 and the returned values are {1000, 990, 1010}<br>  that means that with 95% confidence, the true value lies within the range \[990, 1010\].<br>Param seed: This is used to confirm that the given sketch was configured with the correct seed.<br>Returns: a STRUCT with three FLOAT64 values as {estimate, lower\_bound, upper\_bound}.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/Theta/ThetaSketches.html |
| [theta_sketch_jaccard_similarity_seed](theta/sqlx/theta_sketch_jaccard_similarity_seed.sqlx) | SCALAR | (sketchA BYTES, sketchB BYTES, seed INT64) -> STRUCT<lower_bound FLOAT64, estimate FLOAT64, upper_bound FLOAT64> | Computes the Jaccard similarity index with upper and lower bounds.<br>The Jaccard similarity index J\(A,B\) = \(A ^ B\)/\(A U B\) is used to measure how similar the two sketches are to each other.<br>If J = 1.0, the sketches are considered equal. If J = 0, the two sketches are disjoint.<br>A Jaccard of .95 means the overlap between the two sets is 95% of the union of the two sets.<br><br>Param sketchA: the first sketch as bytes.<br>Param sketchB: the second sketch as bytes.<br>Param seed: This is used to confirm that the given sketches were configured with the correct seed.<br>Returns: a STRUCT with three FLOAT64 values {lower\_bound, estimate, upper\_bound} of the Jaccard index.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/Theta/ThetaSketches.html |

**Examples:**

```sql

# using defaults
create or replace table $BQ_DATASET.theta_sketch(sketch bytes);

insert into $BQ_DATASET.theta_sketch
(select $BQ_DATASET.theta_sketch_agg_int64(value) from unnest(GENERATE_ARRAY(1, 10000, 1)) as value);
insert into $BQ_DATASET.theta_sketch
(select $BQ_DATASET.theta_sketch_agg_int64(value) from unnest(GENERATE_ARRAY(100000, 110000, 1)) as value);

# expected about 20000
select $BQ_DATASET.theta_sketch_get_estimate_and_bounds(
  $BQ_DATASET.theta_sketch_agg_union(sketch),
  2
) from $BQ_DATASET.theta_sketch;

# expected estimate about 20000
select $BQ_DATASET.theta_sketch_to_string(
  $BQ_DATASET.theta_sketch_agg_union(sketch)
) from $BQ_DATASET.theta_sketch;

select $BQ_DATASET.theta_sketch_get_theta(
  $BQ_DATASET.theta_sketch_agg_union(sketch)
) from $BQ_DATASET.theta_sketch;

select $BQ_DATASET.theta_sketch_get_num_retained(
  $BQ_DATASET.theta_sketch_agg_union(sketch)
) from $BQ_DATASET.theta_sketch;

drop table $BQ_DATASET.theta_sketch;

# using full signatures
create or replace table $BQ_DATASET.theta_sketch(sketch bytes);

insert into $BQ_DATASET.theta_sketch
(select $BQ_DATASET.theta_sketch_agg_int64_lgk_seed_p(value, struct<int, int, float64>(14, 111, 0.9)) from unnest(GENERATE_ARRAY(1, 10000, 1)) as value);
insert into $BQ_DATASET.theta_sketch
(select $BQ_DATASET.theta_sketch_agg_int64_lgk_seed_p(value, struct<int, int, float64>(14, 111, 0.9)) from unnest(GENERATE_ARRAY(100000, 110000, 1)) as value);

# expected about 20000
select $BQ_DATASET.theta_sketch_get_estimate_and_bounds_seed(
  $BQ_DATASET.theta_sketch_agg_union_lgk_seed(sketch, struct<int, int>(10, 111)),
  2,
  111
) from $BQ_DATASET.theta_sketch;

# expected estimate about 20000
select $BQ_DATASET.theta_sketch_to_string_seed(
  $BQ_DATASET.theta_sketch_agg_union_lgk_seed(sketch, struct<int, int>(10, 111)),
  111
) from $BQ_DATASET.theta_sketch;

select $BQ_DATASET.theta_sketch_get_theta_seed(
  $BQ_DATASET.theta_sketch_agg_union_lgk_seed(sketch, struct<int, int>(10, 111)),
  111
) from $BQ_DATASET.theta_sketch;

select $BQ_DATASET.theta_sketch_get_num_retained_seed(
  $BQ_DATASET.theta_sketch_agg_union_lgk_seed(sketch, struct<int, int>(10, 111)),
  111
) from $BQ_DATASET.theta_sketch;

drop table $BQ_DATASET.theta_sketch;

# using defaults
# expected 5
select $BQ_DATASET.theta_sketch_get_estimate(
  $BQ_DATASET.theta_sketch_union(
    (select $BQ_DATASET.theta_sketch_agg_string(str) from unnest(["a", "b", "c"]) as str),
    (select $BQ_DATASET.theta_sketch_agg_string(str) from unnest(["c", "d", "e"]) as str)
  )
);

# full signatures
# expected 5
select $BQ_DATASET.theta_sketch_get_estimate_seed(
  $BQ_DATASET.theta_sketch_union_lgk_seed(
    (select $BQ_DATASET.theta_sketch_agg_string_lgk_seed_p(str, struct<int, int, float64>(10, 111, 0.999)) from unnest(["a", "b", "c"]) as str),
    (select $BQ_DATASET.theta_sketch_agg_string_lgk_seed_p(str, struct<int, int, float64>(10, 111, 0.999)) from unnest(["c", "d", "e"]) as str),
    10,
    111
  ),
  111
);

# using defaults
# expected 1
select $BQ_DATASET.theta_sketch_get_estimate(
  $BQ_DATASET.theta_sketch_intersection(
    (select $BQ_DATASET.theta_sketch_agg_string(str) from unnest(["a", "b", "c"]) as str),
    (select $BQ_DATASET.theta_sketch_agg_string(str) from unnest(["c", "d", "e"]) as str)
  )
);

# full signatures
# expected 1
select $BQ_DATASET.theta_sketch_get_estimate_seed(
  $BQ_DATASET.theta_sketch_intersection_seed(
    (select $BQ_DATASET.theta_sketch_agg_string_lgk_seed_p(str, struct<int, int, float64>(10, 111, 0.999)) from unnest(["a", "b", "c"]) as str),
    (select $BQ_DATASET.theta_sketch_agg_string_lgk_seed_p(str, struct<int, int, float64>(10, 111, 0.999)) from unnest(["c", "d", "e"]) as str),
    111
  ),
  111
);

# using defaults
# expected 2
select $BQ_DATASET.theta_sketch_get_estimate(
  $BQ_DATASET.theta_sketch_a_not_b(
    (select $BQ_DATASET.theta_sketch_agg_string(str) from unnest(["a", "b", "c"]) as str),
    (select $BQ_DATASET.theta_sketch_agg_string(str) from unnest(["c", "d", "e"]) as str)
  )
);

# full signatures
# expected 2
select $BQ_DATASET.theta_sketch_get_estimate_seed(
  $BQ_DATASET.theta_sketch_a_not_b_seed(
    (select $BQ_DATASET.theta_sketch_agg_string_lgk_seed_p(str, struct<int, int, float64>(10, 111, 0.999)) from unnest(["a", "b", "c"]) as str),
    (select $BQ_DATASET.theta_sketch_agg_string_lgk_seed_p(str, struct<int, int, float64>(10, 111, 0.999)) from unnest(["c", "d", "e"]) as str),
    111
  ),
  111
);

# using defaults
# expected 0.2
select $BQ_DATASET.theta_sketch_jaccard_similarity(
  (select $BQ_DATASET.theta_sketch_agg_string(str) from unnest(["a", "b", "c"]) as str),
  (select $BQ_DATASET.theta_sketch_agg_string(str) from unnest(["c", "d", "e"]) as str)
);

# using full signatures
# expected 0.2
select $BQ_DATASET.theta_sketch_jaccard_similarity_seed(
  (select $BQ_DATASET.theta_sketch_agg_string_lgk_seed_p(str, struct<int, int, float64>(10, 111, 0.999)) from unnest(["a", "b", "c"]) as str),
  (select $BQ_DATASET.theta_sketch_agg_string_lgk_seed_p(str, struct<int, int, float64>(10, 111, 0.999)) from unnest(["c", "d", "e"]) as str),
  111
);
```


## TUPLE Sketch Functions

**Description:** Tuple sketches extend the functionality of Theta sketches by
allowing you to associate a summary value with each item in the set. This
enables calculations like the sum, minimum, or maximum of values associated with
the distinct items.

| Function Name | Function Type | Signature | Description |
|---|---|---|---|
| [tuple_sketch_int64_agg_union](tuple/sqlx/tuple_sketch_int64_agg_union.sqlx) | AGGREGATE | (sketch BYTES) -> BYTES | Builds a Tuple Sketch that represents the UNION of the given column of Tuple Sketches.<br>Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.<br>This function only applies to Tuple Sketches with an INT64 summary column.<br><br>Param sketch: the given column of Tuple Sketches with an INT64 summary column. This may not be NULL.<br>Defaults: lg\_k = 12, seed = 9001, mode = SUM.<br>Returns: a Compact Tuple Sketch as BYTES. <br><br>For more information:<br> \- https://datasketches.apache.org/docs/Tuple/TupleSketches.html |
| [tuple_sketch_int64_agg_string](tuple/sqlx/tuple_sketch_int64_agg_string.sqlx) | AGGREGATE | (key STRING, value INT64) -> BYTES | Builds a Tuple Sketch from an STRING Key column and an INT64 value column.<br>Multiple values for the same key are aggregated using the default mode.<br>Note that cardinality estimation accuracy, plots, error tables, and sampling probability p are the same as the Theta Sketch.<br>This function only applies to Tuple Sketches with an STRING Key column and an INT64 summary column.<br> <br>Param key: the STRING column of identifiers. This may not be NULL.<br>Param value: the INT64 value column associated with each key. This may not be NULL.<br>Defaults: lg\_k = 12, seed = 9001, p = 1.0, mode = SUM.<br>Returns: a Compact Tuple Sketch as BYTES.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/Tuple/TupleSketches.html |
| [tuple_sketch_int64_agg_int64](tuple/sqlx/tuple_sketch_int64_agg_int64.sqlx) | AGGREGATE | (key INT64, value INT64) -> BYTES | Builds a Tuple Sketch from an INT64 Key column and an INT64 value column.<br>Multiple values for the same key are aggregated using the default mode.<br>Note that cardinality estimation accuracy, plots, error tables, and sampling probability p are the same as the Theta Sketch.<br>This function only applies to Tuple Sketches with an INT64 Key column and an INT64 summary column.<br><br>Param key: the INT64 key column of identifiers. This may not be NULL.<br>Param value: the INT64 value column associated with each key. This may not be NULL.<br>Defaults: lg\_k = 12, seed = 9001, p = 1.0, mode = SUM.<br>Returns: a Compact Tuple Sketch as BYTES.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/Tuple/TupleSketches.html |
| [tuple_sketch_int64_agg_union_lgk_seed_mode](tuple/sqlx/tuple_sketch_int64_agg_union_lgk_seed_mode.sqlx) | AGGREGATE | (sketch BYTES, params STRUCT<lg_k BYTEINT, seed INT64, mode STRING> NOT AGGREGATE) -> BYTES | Builds a Tuple Sketch that represents the UNION of the given column of Tuple Sketches.<br>Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.<br>This function only applies to Tuple Sketches with an INT64 summary column.<br><br>Param sketch: the given column of Tuple Sketches with an INT64 summary column. This may not be NULL.<br>Param lg\_k: the sketch accuracy/size parameter as an integer in the range \[4, 26\]. A NULL specifies the default lg\_k of 12.<br>Param seed: the seed to be used by the underlying hash function. A NULL specifies the default seed of 9001.<br>Param mode:  aggregation mode for the summary field: one of { SUM, MIN, MAX, ONE \(constant 1\) }. A NULL specifies the default = SUM.<br>Returns: a Compact Tuple Sketch as BYTES.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/Tuple/TupleSketches.html |
| [tuple_sketch_int64_agg_int64_lgk_seed_p_mode](tuple/sqlx/tuple_sketch_int64_agg_int64_lgk_seed_p_mode.sqlx) | AGGREGATE | (key INT64, value INT64, params STRUCT<lg_k BYTEINT, seed INT64, p FLOAT64, mode STRING> NOT AGGREGATE) -> BYTES | Builds a Tuple Sketch from an INT64 Key column and an INT64 value column.<br>Multiple values for the same key are aggregated using one of the selectable operations: { SUM, MIN, MAX, ONE \(constant 1\) }.<br>Note that cardinality estimation accuracy, plots, error tables, and sampling probability p are the same as the Theta Sketch.<br>This function only applies to Tuple Sketches with an INT64 Key column and an INT64 summary column.<br><br>Param key: the INT64 key column of identifiers. This may not be NULL.<br>Param value: the INT64 value column associated with each key. This may not be NULL.<br>Param lg\_k: the sketch accuracy/size parameter as an integer in the range \[4, 26\]. A NULL specifies the default lg\_k of 12.<br>Param seed: the seed to be used by the underlying hash function. A NULL specifies the default seed of 9001.<br>Param p: up\-front sampling probability. A NULL specifies the default of 1.0.<br>Param mode:  aggregation mode for the summary field: one of { SUM, MIN, MAX, ONE \(constant 1\) }. A NULL specifies the default = SUM.<br>Returns: a Compact Tuple Sketch as BYTES.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/Tuple/TupleSketches.html |
| [tuple_sketch_int64_agg_string_lgk_seed_p_mode](tuple/sqlx/tuple_sketch_int64_agg_string_lgk_seed_p_mode.sqlx) | AGGREGATE | (key STRING, value INT64, params STRUCT<lg_k BYTEINT, seed INT64, p FLOAT64, mode STRING> NOT AGGREGATE) -> BYTES | Builds a Tuple Sketch from an STRING Key column and an INT64 value column.<br>Multiple values for the same key are aggregated using one of the selectable operations: SUM, MIN, MAX, ONE.<br>Note that cardinality estimation accuracy, plots, error tables, and sampling probability p are the same as the Theta Sketch.<br>This function only applies to Tuple Sketches with an STRING Key column and an INT64 summary column.<br><br>Param key: the STRING key column of identifiers. This may not be NULL.<br>Param value: the INT64 value column associated with each key. This may not be NULL.<br>Param lg\_k: the sketch accuracy/size parameter as an integer in the range \[4, 26\]. A NULL specifies the default lg\_k of 12.<br>Param seed: the seed to be used by the underlying hash function. A NULL specifies the default seed of 9001.<br>Param p: up\-front sampling probability. A NULL specifies the default of 1.0.<br>Param mode:  aggregation mode for the summary field: one of { SUM, MIN, MAX, ONE \(constant 1\) }. A NULL specifies the default = SUM.<br>Returns: a Compact Tuple Sketch as BYTES.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/Tuple/TupleSketches.html |
| [tuple_sketch_int64_to_string](tuple/sqlx/tuple_sketch_int64_to_string.sqlx) | SCALAR | (sketch BYTES) -> STRING | Returns a human readable STRING that is a short summary of the state of this sketch.<br>  Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.<br>  This function only applies to Tuple Sketches with an INT64 summary column.<br><br>Param sketch: the sketch to be summarized. This may not be NULL.<br>Defaults: seed = 9001.<br>Returns: A human readable STRING that is a short summary of the state of this sketch.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/Tuple/TupleSketches.html |
| [tuple_sketch_int64_get_estimate](tuple/sqlx/tuple_sketch_int64_get_estimate.sqlx) | SCALAR | (sketch BYTES) -> FLOAT64 | Returns the cardinality estimate of the given Tuple Sketch.<br>Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.<br>This function only applies to Tuple Sketches with an INT64 summary column.<br>  <br>Param sketch: the given Tuple Sketch. This may not be NULL.<br>Defaults: seed = 9001.<br>Returns: the cardinality estimate of the given Tuple Sketch<br><br>For more information:<br> \- https://datasketches.apache.org/docs/Tuple/TupleSketches.html |
| [tuple_sketch_int64_get_theta](tuple/sqlx/tuple_sketch_int64_get_theta.sqlx) | SCALAR | (sketch BYTES) -> FLOAT64 | Returns theta \(effective sampling rate\) as a fraction from 0 to 1.<br>Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.<br>This function only applies to Tuple Sketches with an INT64 summary column.<br>  <br>Param sketch: the given Tuple Sketch. This may not be NULL.<br>Defaults: seed = 9001.<br>Returns: theta as FLOAT64.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/Tuple/TupleSketches.html |
| [tuple_sketch_int64_get_num_retained](tuple/sqlx/tuple_sketch_int64_get_num_retained.sqlx) | SCALAR | (sketch BYTES) -> INT | Returns the number of retained entries in the given sketch.<br>Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.<br>This function only applies to Tuple Sketches with an INT64 summary column.<br>  <br>Param sketch: the given Tuple Sketch. This may not be NULL.<br>Defaults: seed = 9001.<br>Returns: number of retained entries as INT.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/Tuple/TupleSketches.html |
| [tuple_sketch_int64_get_theta_seed](tuple/sqlx/tuple_sketch_int64_get_theta_seed.sqlx) | SCALAR | (sketch BYTES, seed INT64) -> FLOAT64 | Returns theta \(effective sampling rate\) as a fraction from 0 to 1.<br>Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.<br>This function only applies to Tuple Sketches with an INT64 summary column.<br>  <br>Param sketch: the given Tuple Sketch. This may not be NULL.<br>Param seed: This is used to confirm that the given sketches were configured with the correct seed. A NULL specifies the default seed = 9001.<br>Returns: theta as FLOAT64.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/Tuple/TupleSketches.html |
| [tuple_sketch_int64_get_num_retained_seed](tuple/sqlx/tuple_sketch_int64_get_num_retained_seed.sqlx) | SCALAR | (sketch BYTES, seed INT64) -> INT | Returns the number of retained entries in the given sketch.<br>Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.<br>This function only applies to Tuple Sketches with an INT64 summary column.<br>  <br>Param sketch: the given Tuple Sketch. This may not be NULL.<br>Param seed: This is used to confirm that the given sketches were configured with the correct seed. A NULL specifies the default seed = 9001.<br>Returns: number of retained entries as INT.<br>For more information:<br> \- https://datasketches.apache.org/docs/Tuple/TupleSketches.html |
| [tuple_sketch_int64_to_string_seed](tuple/sqlx/tuple_sketch_int64_to_string_seed.sqlx) | SCALAR | (sketch BYTES, seed INT64) -> STRING | Returns a human readable STRING that is a short summary of the state of this sketch.<br>  Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.<br>  This function only applies to Tuple Sketches with an INT64 summary column.<br><br>Param sketch: the sketch to be summarized. This may not be NULL.<br>Param seed: This is used to confirm that the given sketches were configured with the correct seed. A NULL specifies the default seed = 9001.<br>Returns: A human readable STRING that is a short summary of the state of this sketch.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/Tuple/TupleSketches.html |
| [tuple_sketch_int64_a_not_b](tuple/sqlx/tuple_sketch_int64_a_not_b.sqlx) | SCALAR | (sketchA BYTES, sketchB BYTES) -> BYTES | Computes a sketch that represents the set difference of sketchA and not sketchB.<br>Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.<br>This function only applies to Tuple Sketches with an INT64 summary column. <br>  <br>Param sketchA: the first sketch "A" as BYTES. This may not be NULL.<br>Param sketchB: the second sketch "B" as BYTES. This may not be NULL.<br>Defaults: seed = 9001.<br>Returns: a Compact Tuple Sketch as BYTES.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/Tuple/TupleSketches.html |
| [tuple_sketch_int64_from_theta_sketch](tuple/sqlx/tuple_sketch_int64_from_theta_sketch.sqlx) | SCALAR | (sketch BYTES, value INT64) -> BYTES | Converts the given Theta Sketch into a Tuple Sketch with a INT64 summary column set to the given INT64 value.<br>Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.<br><br>Param sketch: the given Theta Sketch. This may not be NULL.<br>Param value: the given INT64 value. This may not be NULL.<br>Defaults: seed = 9001.<br>Returns: a Tuple Sketch with an INT64 summary column as BYTES.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/Tuple/TupleSketches.html |
| [tuple_sketch_int64_get_estimate_seed](tuple/sqlx/tuple_sketch_int64_get_estimate_seed.sqlx) | SCALAR | (sketch BYTES, seed INT64) -> FLOAT64 | Returns the cardinality estimate of the given Tuple Sketch.<br>Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.<br>This function only applies to Tuple Sketches with an INT64 summary column.<br>  <br>Param sketch: the given Tuple Sketch. This may not be NULL.<br>Param seed: This is used to confirm that the given sketches were configured with the correct seed. A NULL specifies the default seed = 9001.<br>Returns: the cardinality estimate of the given Tuple Sketch<br><br>For more information:<br> \- https://datasketches.apache.org/docs/Tuple/TupleSketches.html |
| [tuple_sketch_int64_intersection](tuple/sqlx/tuple_sketch_int64_intersection.sqlx) | SCALAR | (sketchA BYTES, sketchB BYTES) -> BYTES | Computes a sketch that represents the scalar intersection of sketchA and sketchB.<br>Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.<br>This function only applies to Tuple Sketches with an INT64 summary column.<br><br>Param sketchA: the first sketch "A" as BYTES.<br>Param sketchB: the second sketch "B" as BYTES.<br>Defaults: seed = 9001.<br>Returns: a Compact Tuple Sketch as BYTES.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/Tuple/TupleSketches.html |
| [tuple_sketch_int64_union](tuple/sqlx/tuple_sketch_int64_union.sqlx) | SCALAR | (sketchA BYTES, sketchB BYTES) -> BYTES | Computes a Tuple Sketch that represents the UNION of sketchA and sketchB.<br>Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.<br>This function only applies to Tuple Sketches with an INT64 summary column.<br><br>Param sketchA: the first sketch "A" as BYTES. This may not be NULL.<br>Param sketchB: the second sketch "B" as BYTES. This may not be NULL.<br>Defaults: seed = 9001.<br>Returns: a Compact Tuple Sketch as BYTES.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/Tuple/TupleSketches.html |
| [tuple_sketch_int64_from_theta_sketch_seed](tuple/sqlx/tuple_sketch_int64_from_theta_sketch_seed.sqlx) | SCALAR | (sketch BYTES, value INT64, seed INT64) -> BYTES | Converts the given Theta Sketch into a Tuple Sketch with a INT64 summary column set to the given INT64 value.<br>Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.<br><br>Param sketch: the given Theta Sketch. This may not be NULL.<br>Param value: the given INT64 value. This may not be NULL.<br>Param seed: This is used to confirm that the given sketches were configured with the correct seed. A NULL specifies the default seed = 9001.<br>Returns: a Tuple Sketch with an INT64 summary column as BYTES.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/Tuple/TupleSketches.html |
| [tuple_sketch_int64_a_not_b_seed](tuple/sqlx/tuple_sketch_int64_a_not_b_seed.sqlx) | SCALAR | (sketchA BYTES, sketchB BYTES, seed INT64) -> BYTES | Computes a sketch that represents the scalar set difference of sketchA and not sketchB.<br>Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.<br>This function only applies to Tuple Sketches with an INT64 summary column.<br><br>Param sketchA: the first sketch "A" as BYTES. This may not be NULL.<br>Param sketchB: the second sketch "B" as BYTES. This may not be NULL.<br>Param seed: This is used to confirm that the given sketches were configured with the correct seed. A NULL specifies the default seed = 9001.<br>Returns: a Compact Tuple Sketch as BYTES.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/Tuple/TupleSketches.html |
| [tuple_sketch_int64_filter_low_high](tuple/sqlx/tuple_sketch_int64_filter_low_high.sqlx) | SCALAR | (sketch BYTES, low INT64, high INT64) -> BYTES | Returns a Tuple Sketch computed from the given sketch filtered by the given low and high values. <br>This returns a compact tuple sketch that contains the subset of rows of the give sketch where the<br>summary column is greater\-than or equal to the given low and less\-than or equal to the given high.<br>Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.<br>This function only applies to Tuple Sketches with an INT64 summary column.<br><br>Param sketch: the given Tuple Sketch. This may not be NULL.<br>Param low: the given low INT64. This may not be NULL.<br>Param high: the given high INT64. This may not be NULL.<br>Defaults: seed = 9001.<br>Returns: a Compact Tuple Sketch as BYTES.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/Tuple/TupleSketches.html |
| [tuple_sketch_int64_get_estimate_and_bounds](tuple/sqlx/tuple_sketch_int64_get_estimate_and_bounds.sqlx) | SCALAR | (sketch BYTES, num_std_devs BYTEINT) -> STRUCT<estimate FLOAT64, lower_bound FLOAT64, upper_bound FLOAT64> | Returns the cardinality estimate and bounds from the given Tuple Sketch.<br>Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.<br>This function only applies to Tuple Sketches with an INT64 summary column.<br>  <br>Param sketch: the given Tuple Sketch. This may not be NULL.<br>Param num\_std\_devs: The returned bounds will be based on the statistical confidence interval<br>  determined by the given number of standard deviations from the returned estimate.<br>  This number may be one of {1,2,3}, where 1 represents 68% confidence,<br>  2 represents 95% confidence and 3 represents 99.7% confidence.<br>  For example, if the given num\_std\_devs = 2 and the returned values are {1000, 990, 1010}<br>  that means that with 95% confidence, the true value lies within the range \[990, 1010\].<br>Defaults: seed = 9001.<br>Returns: a STRUCT with three FLOAT64 values as {estimate, lower\_bound, upper\_bound}.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/Tuple/TupleSketches.html |
| [tuple_sketch_int64_filter_low_high_seed](tuple/sqlx/tuple_sketch_int64_filter_low_high_seed.sqlx) | SCALAR | (sketch BYTES, low INT64, high INT64, seed INT64) -> BYTES | Returns a Tuple Sketch computed from the given sketch filtered by the given low and high values. <br>This returns a compact tuple sketch that contains the subset of rows of the give sketch where the<br>summary column is greater\-than or equal to the given low and less\-than or equal to the given high.<br>Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.<br>This function only applies to Tuple Sketches with an INT64 summary column.<br><br>Param sketch: the given Tuple Sketch. This may not be NULL.<br>Param low: the given low INT64. This may not be NULL.<br>Param high: the given high INT64. This may not be NULL.<br>Param seed: This is used to confirm that the given sketches were configured with the correct seed. A NULL specifies the default seed = 9001.<br>Returns: a Compact Tuple Sketch as BYTES.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/Tuple/TupleSketches.html |
| [tuple_sketch_int64_jaccard_similarity](tuple/sqlx/tuple_sketch_int64_jaccard_similarity.sqlx) | SCALAR | (sketchA BYTES, sketchB BYTES) -> STRUCT<lower_bound FLOAT64, estimate FLOAT64, upper_bound FLOAT64> | Computes the Jaccard similarity index with upper and lower bounds.<br>The Jaccard similarity index J\(A,B\) = \(A ^ B\)/\(A U B\) is used to measure how similar the two sketches are to each other.<br>If J = 1.0, the sketches are considered equal. If J = 0, the two sketches are disjoint.<br>A Jaccard of .95 means the overlap between the two sets is 95% of the union of the two sets.<br>This function only applies to Tuple Sketches with an INT64 summary column.<br><br>Param sketchA: the first sketch as bytes. This may not be NULL.<br>Param sketchB: the second sketch as bytes. This may not be NULL.<br>Defaults: seed = 9001.<br>Returns: a STRUCT with three FLOAT64 values {lower\_bound, estimate, upper\_bound} of the Jaccard index.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/Tuple/TupleSketches.html |
| [tuple_sketch_int64_get_sum_estimate_and_bounds](tuple/sqlx/tuple_sketch_int64_get_sum_estimate_and_bounds.sqlx) | SCALAR | (sketch BYTES, num_std_devs BYTEINT) -> STRUCT<sum_estimate FLOAT64, sum_lower_bound FLOAT64, sum_upper_bound FLOAT64> | Returns the estimate and bounds for the sum of the INT64 summary column<br>scaled to the original population from the given Tuple Sketch.<br>Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.<br>This function only applies to Tuple Sketches with an INT64 summary column.<br>  <br>Param sketch: the given Tuple Sketch. This may not be NULL.<br>Param num\_std\_devs: The returned bounds will be based on the statistical confidence interval<br>  determined by the given number of standard deviations from the returned estimate.<br>  This number may be one of {1,2,3}, where 1 represents 68% confidence,<br>  2 represents 95% confidence and 3 represents 99.7% confidence.<br>  For example, if the given num\_std\_devs = 2 and the returned values are {1000, 990, 1010}<br>  that means that with 95% confidence, the true value lies within the range \[990, 1010\].<br>Defaults: seed = 9001.<br>Returns: a STRUCT with three FLOAT64 values as {sum\_estimate, sum\_lower\_bound, sum\_upper\_bound}.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/Tuple/TupleSketches.html |
| [tuple_sketch_int64_intersection_seed_mode](tuple/sqlx/tuple_sketch_int64_intersection_seed_mode.sqlx) | SCALAR | (sketchA BYTES, sketchB BYTES, seed INT64, mode STRING) -> BYTES | Computes a sketch that represents the scalar intersection of sketchA and sketchB.<br>Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.<br>This function only applies to Tuple Sketches with an INT64 summary column.<br><br>Param sketchA: the first sketch "A" as BYTES.<br>Param sketchB: the second sketch "B" as BYTES.<br>Param seed: This is used to confirm that the given sketches were configured with the correct seed. A NULL specifies the default seed = 9001.<br>Returns: a Compact Tuple Sketch as BYTES.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/Tuple/TupleSketches.html |
| [tuple_sketch_int64_get_sum_estimate_and_bounds_seed](tuple/sqlx/tuple_sketch_int64_get_sum_estimate_and_bounds_seed.sqlx) | SCALAR | (sketch BYTES, num_std_devs BYTEINT, seed INT64) -> STRUCT<sum_estimate FLOAT64, sum_lower_bound FLOAT64, sum_upper_bound FLOAT64> | Returns the estimate and bounds for the sum of the INT64 summary column<br>scaled to the original population from the given Tuple Sketch.<br>Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.<br>This function only applies to Tuple Sketches with an INT64 summary column.<br><br>Param sketch: the given Tuple Sketch. This may not be NULL.<br>Param num\_std\_devs: The returned bounds will be based on the statistical confidence interval<br>  determined by the given number of standard deviations from the returned estimate.<br>  This number may be one of {1,2,3}, where 1 represents 68% confidence,<br>  2 represents 95% confidence and 3 represents 99.7% confidence.<br>  For example, if the given num\_std\_devs = 2 and the returned values are {1000, 990, 1010}<br>  that means that with 95% confidence, the true value lies within the range \[990, 1010\].<br>Param seed: This is used to confirm that the given sketches were configured with the correct seed. A NULL specifies the default seed = 9001.<br>Returns: a STRUCT with three FLOAT64 values as {sum\_estimate, sum\_lower\_bound, sum\_upper\_bound}.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/Tuple/TupleSketches.html |
| [tuple_sketch_int64_union_lgk_seed_mode](tuple/sqlx/tuple_sketch_int64_union_lgk_seed_mode.sqlx) | SCALAR | (sketchA BYTES, sketchB BYTES, lg_k BYTEINT, seed INT64, mode STRING) -> BYTES | Computes a Tuple Sketch that represents the UNION of sketchA and sketchB.<br>Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.<br>This function only applies to Tuple Sketches with an INT64 summary column.<br><br>Param sketchA: the first sketch "A" as BYTES. This may not be NULL.<br>Param sketchB: the second sketch "B" as BYTES. This may not be NULL.<br>Param seed: This is used to confirm that the given sketches were configured with the correct seed. A NULL specifies the default seed = 9001.<br>Returns: a Compact Tuple Sketch as BYTES.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/Tuple/TupleSketches.html |
| [tuple_sketch_int64_get_estimate_and_bounds_seed](tuple/sqlx/tuple_sketch_int64_get_estimate_and_bounds_seed.sqlx) | SCALAR | (sketch BYTES, num_std_devs BYTEINT, seed INT64) -> STRUCT<estimate FLOAT64, lower_bound FLOAT64, upper_bound FLOAT64> | Returns the cardinality estimate and bounds from the given Tuple Sketch.<br>Note that cardinality estimation accuracy, plots, and error tables are the same as the Theta Sketch.<br>This function only applies to Tuple Sketches with an INT64 summary column.<br>  <br>Param sketch: the given Tuple Sketch. This may not be NULL.<br>Param num\_std\_devs: The returned bounds will be based on the statistical confidence interval<br>  determined by the given number of standard deviations from the returned estimate.<br>  This number may be one of {1,2,3}, where 1 represents 68% confidence,<br>  2 represents 95% confidence and 3 represents 99.7% confidence.<br>  For example, if the given num\_std\_devs = 2 and the returned values are {1000, 990, 1010}<br>  that means that with 95% confidence, the true value lies within the range \[990, 1010\].<br>Param seed: This is used to confirm that the given sketches were configured with the correct seed. A NULL specifies the default seed = 9001.<br>Returns: a STRUCT with three FLOAT64 values as {estimate, lower\_bound, upper\_bound}.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/Tuple/TupleSketches.html |
| [tuple_sketch_int64_jaccard_similarity_seed](tuple/sqlx/tuple_sketch_int64_jaccard_similarity_seed.sqlx) | SCALAR | (sketchA BYTES, sketchB BYTES, seed INT64) -> STRUCT<lower_bound FLOAT64, estimate FLOAT64, upper_bound FLOAT64> | Computes the Jaccard similarity index with upper and lower bounds.<br>The Jaccard similarity index J\(A,B\) = \(A ^ B\)/\(A U B\) is used to measure how similar the two sketches are to each other.<br>If J = 1.0, the sketches are considered equal. If J = 0, the two sketches are disjoint.<br>A Jaccard of .95 means the overlap between the two sets is 95% of the union of the two sets.<br>This function only applies to Tuple Sketches with an INT64 summary column.<br><br>Param sketchA: the first sketch as bytes. This may not be NULL.<br>Param sketchB: the second sketch as bytes. This may not be NULL.<br>Param seed: This is used to confirm that the given sketches were configured with the correct seed. A NULL specifies the default seed = 9001.<br>Returns: a STRUCT with three FLOAT64 values {lower\_bound, estimate, upper\_bound} of the Jaccard index.<br><br>For more information:<br> \- https://datasketches.apache.org/docs/Tuple/TupleSketches.html |

**Examples:**

```sql

# using defaults
create or replace table $BQ_DATASET.tuple_sketch(sketch bytes);

insert into $BQ_DATASET.tuple_sketch
(select $BQ_DATASET.tuple_sketch_int64_from_theta_sketch($BQ_DATASET.theta_sketch_agg_string(cast(value as string)), 1) from unnest(GENERATE_ARRAY(1, 10000, 1)) as value);
insert into $BQ_DATASET.tuple_sketch
(select $BQ_DATASET.tuple_sketch_int64_from_theta_sketch($BQ_DATASET.theta_sketch_agg_string(cast(value as string)), 1) from unnest(GENERATE_ARRAY(100000, 110000, 1)) as value);

# expected about 20000
select $BQ_DATASET.tuple_sketch_int64_get_estimate(
  $BQ_DATASET.tuple_sketch_int64_agg_union(sketch)
) from $BQ_DATASET.tuple_sketch;

select $BQ_DATASET.tuple_sketch_int64_get_estimate_and_bounds(
  $BQ_DATASET.tuple_sketch_int64_agg_union(sketch),
  2
) from $BQ_DATASET.tuple_sketch;

select $BQ_DATASET.tuple_sketch_int64_get_sum_estimate_and_bounds(
  $BQ_DATASET.tuple_sketch_int64_agg_union(sketch),
  2
) from $BQ_DATASET.tuple_sketch;

# expected estimate about 20000
select $BQ_DATASET.tuple_sketch_int64_to_string(
  $BQ_DATASET.tuple_sketch_int64_agg_union(sketch)
) from $BQ_DATASET.tuple_sketch;

select $BQ_DATASET.tuple_sketch_int64_get_theta(
  $BQ_DATASET.tuple_sketch_int64_agg_union(sketch)
) from $BQ_DATASET.tuple_sketch;

select $BQ_DATASET.tuple_sketch_int64_get_num_retained(
  $BQ_DATASET.tuple_sketch_int64_agg_union(sketch)
) from $BQ_DATASET.tuple_sketch;

drop table $BQ_DATASET.tuple_sketch;

# using full signatures
create or replace table $BQ_DATASET.tuple_sketch(sketch bytes);

insert into $BQ_DATASET.tuple_sketch
(select $BQ_DATASET.tuple_sketch_int64_from_theta_sketch_seed(
  $BQ_DATASET.theta_sketch_agg_string_lgk_seed_p(cast(value as string), STRUCT<BYTEINT, INT64, FLOAT64>(10, 111, 0.999)),
  1,
  111
) from unnest(GENERATE_ARRAY(1, 10000, 1)) as value);
insert into $BQ_DATASET.tuple_sketch
(select $BQ_DATASET.tuple_sketch_int64_from_theta_sketch_seed(
  $BQ_DATASET.theta_sketch_agg_string_lgk_seed_p(cast(value as string), STRUCT<BYTEINT, INT64, FLOAT64>(10, 111, 0.999)),
  1,
  111
) from unnest(GENERATE_ARRAY(100000, 110000, 1)) as value);

# expected about 20000
select $BQ_DATASET.tuple_sketch_int64_get_estimate_seed(
  $BQ_DATASET.tuple_sketch_int64_agg_union_lgk_seed_mode(sketch, STRUCT<BYTEINT, INT64, STRING>(10, 111, "NOP")),
  111
) from $BQ_DATASET.tuple_sketch;

select $BQ_DATASET.tuple_sketch_int64_get_estimate_and_bounds_seed(
  $BQ_DATASET.tuple_sketch_int64_agg_union_lgk_seed_mode(sketch, STRUCT<BYTEINT, INT64, STRING>(10, 111, "NOP")),
  2,
  111
) from $BQ_DATASET.tuple_sketch;

select $BQ_DATASET.tuple_sketch_int64_get_sum_estimate_and_bounds_seed(
  $BQ_DATASET.tuple_sketch_int64_agg_union_lgk_seed_mode(sketch, STRUCT<BYTEINT, INT64, STRING>(10, 111, "NOP")),
  2,
  111
) from $BQ_DATASET.tuple_sketch;

# expected estimate about 20000
select $BQ_DATASET.tuple_sketch_int64_to_string_seed(
  $BQ_DATASET.tuple_sketch_int64_agg_union_lgk_seed_mode(sketch, STRUCT<BYTEINT, INT64, STRING>(10, 111, "NOP")),
  111
) from $BQ_DATASET.tuple_sketch;

select $BQ_DATASET.tuple_sketch_int64_get_theta_seed(
  $BQ_DATASET.tuple_sketch_int64_agg_union_lgk_seed_mode(sketch, STRUCT<BYTEINT, INT64, STRING>(10, 111, "NOP")),
  111
) from $BQ_DATASET.tuple_sketch;

select $BQ_DATASET.tuple_sketch_int64_get_num_retained_seed(
  $BQ_DATASET.tuple_sketch_int64_agg_union_lgk_seed_mode(sketch, STRUCT<BYTEINT, INT64, STRING>(10, 111, "NOP")),
  111
) from $BQ_DATASET.tuple_sketch;

drop table $BQ_DATASET.tuple_sketch;


# using defaluts
# expected 5
select $BQ_DATASET.tuple_sketch_int64_get_estimate(
  $BQ_DATASET.tuple_sketch_int64_union(
    (select $BQ_DATASET.tuple_sketch_int64_agg_int64(key, 1) from unnest([1, 2, 3]) as key),
    (select $BQ_DATASET.tuple_sketch_int64_agg_int64(key, 1) from unnest([3, 4, 5]) as key)
  )
);

# using full signatures
# expected 5
select $BQ_DATASET.tuple_sketch_int64_get_estimate_seed(
  $BQ_DATASET.tuple_sketch_int64_union_lgk_seed_mode(
    (select $BQ_DATASET.tuple_sketch_int64_agg_int64_lgk_seed_p_mode(key, 1, STRUCT<BYTEINT, INT64, FLOAT64, STRING>(10, 111, 0.999, "MIN")) from unnest([1, 2, 3]) as key),
    (select $BQ_DATASET.tuple_sketch_int64_agg_int64_lgk_seed_p_mode(key, 1, STRUCT<BYTEINT, INT64, FLOAT64, STRING>(10, 111, 0.999, "MIN")) from unnest([3, 4, 5]) as key),
    10,
    111,
    "MIN"
  ),
  111
);

# using defaluts
# expected 1
select $BQ_DATASET.tuple_sketch_int64_get_estimate(
  $BQ_DATASET.tuple_sketch_int64_intersection(
    (select $BQ_DATASET.tuple_sketch_int64_agg_string(str, 1) from unnest(["a", "b", "c"]) as str),
    (select $BQ_DATASET.tuple_sketch_int64_agg_string(str, 1) from unnest(["c", "d", "e"]) as str)
  )
);

# using full signatures
# expected 1
select $BQ_DATASET.tuple_sketch_int64_get_estimate_seed(
  $BQ_DATASET.tuple_sketch_int64_intersection_seed_mode(
    (select $BQ_DATASET.tuple_sketch_int64_agg_string_lgk_seed_p_mode(str, 1, STRUCT<BYTEINT, INT64, FLOAT64, STRING>(10, 111, 0.999, "MIN")) from unnest(["a", "b", "c"]) as str),
    (select $BQ_DATASET.tuple_sketch_int64_agg_string_lgk_seed_p_mode(str, 1, STRUCT<BYTEINT, INT64, FLOAT64, STRING>(10, 111, 0.999, "MIN")) from unnest(["c", "d", "e"]) as str),
    111,
    "MIN"
  ),
  111
);

# using defaluts
# expected 2
select $BQ_DATASET.tuple_sketch_int64_get_estimate(
  $BQ_DATASET.tuple_sketch_int64_a_not_b(
    (select $BQ_DATASET.tuple_sketch_int64_agg_string(str, 1) from unnest(["a", "b", "c"]) as str),
    (select $BQ_DATASET.tuple_sketch_int64_agg_string(str, 1) from unnest(["c", "d", "e"]) as str)
  )
);

# using full signatures
# expected 2
select $BQ_DATASET.tuple_sketch_int64_get_estimate_seed(
  $BQ_DATASET.tuple_sketch_int64_a_not_b_seed(
    (select $BQ_DATASET.tuple_sketch_int64_agg_string_lgk_seed_p_mode(str, 1, STRUCT<BYTEINT, INT64, FLOAT64, STRING>(10, 111, 0.999, "MIN")) from unnest(["a", "b", "c"]) as str),
    (select $BQ_DATASET.tuple_sketch_int64_agg_string_lgk_seed_p_mode(str, 1, STRUCT<BYTEINT, INT64, FLOAT64, STRING>(10, 111, 0.999, "MIN")) from unnest(["c", "d", "e"]) as str),
    111
  ),
  111
);

# using defaluts
# expected 0.2
select $BQ_DATASET.tuple_sketch_int64_jaccard_similarity(
  (select $BQ_DATASET.tuple_sketch_int64_agg_string(str, 1) from unnest(["a", "b", "c"]) as str),
  (select $BQ_DATASET.tuple_sketch_int64_agg_string(str, 1) from unnest(["c", "d", "e"]) as str)
);

# using full signatures
# expected 0.2
select $BQ_DATASET.tuple_sketch_int64_jaccard_similarity_seed(
  (select $BQ_DATASET.tuple_sketch_int64_agg_string_lgk_seed_p_mode(str, 1, STRUCT<BYTEINT, INT64, FLOAT64, STRING>(10, 111, 0.999, "NOP")) from unnest(["a", "b", "c"]) as str),
  (select $BQ_DATASET.tuple_sketch_int64_agg_string_lgk_seed_p_mode(str, 1, STRUCT<BYTEINT, INT64, FLOAT64, STRING>(10, 111, 0.999, "NOP")) from unnest(["c", "d", "e"]) as str),
  111
);

# using defaults
# expected 1 entry
select $BQ_DATASET.tuple_sketch_int64_to_string(
  $BQ_DATASET.tuple_sketch_int64_filter_low_high(
    $BQ_DATASET.tuple_sketch_int64_agg_string(key, 1),
    2,
    2
  )
) from unnest(["a", "b", "c", "c"]) as key;

# using full signatures
# expected 1 entry
select $BQ_DATASET.tuple_sketch_int64_to_string_seed(
  $BQ_DATASET.tuple_sketch_int64_filter_low_high_seed(
    $BQ_DATASET.tuple_sketch_int64_agg_string_lgk_seed_p_mode(key, 1, STRUCT<BYTEINT, INT64, FLOAT64, STRING>(10, 111, 0.999, "SUM")),
    2,
    2,
    111
  ),
  111
) from unnest(["a", "b", "c", "c"]) as key;
```
