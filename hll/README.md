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

# Apache DataSketches HLL Sketches for Google BigQuery

HyperLogLog (HLL) sketches are another type of cardinality
estimation sketch. They are known for their high accuracy and low memory
consumption, making them suitable for large datasets and real-time analytics.

Please visit 
[HLL Sketches](https://datasketches.apache.org/docs/HLL/HllSketches.html) 
for more information about this sketch family.

Please visit the main 
[Apache DataSketches website](https://datasketches.apache.org) 
for more information about DataSketches library.

If you are interested in making contributions to this project please see our 
[Community](https://datasketches.apache.org/docs/Community/) 
page for how to contact us.

## Aggregate Functions
| Function Name | Signature | Description |
|---|---|---|
| [hll_sketch_agg_string](../hll/sqlx/hll_sketch_agg_string.sqlx) | (str STRING) -> BYTES | Creates a sketch that represents the cardinality of the given STRING column.<br><br>Param str: the STRING column of identifiers.<br>Defaults: lg\_k = 12, tgt\_type = HLL\_4.<br>Returns: an HLL Sketch, as BYTES. |
| [hll_sketch_agg_union](../hll/sqlx/hll_sketch_agg_union.sqlx) | (sketch BYTES) -> BYTES | Creates a sketch that represents the union of the given column of sketches.<br><br>Param sketch: the column of sketches. Each as BYTES.<br>Defaults: lg\_k = 12, tgt\_type = HLL\_4.<br>Returns: an HLL Sketch, as BYTES. |
| [hll_sketch_agg_int64](../hll/sqlx/hll_sketch_agg_int64.sqlx) | (value INT64) -> BYTES | Creates a sketch that represents the cardinality of the given INT64 column.<br><br>Param value: the INT64 column of identifiers.<br>Defaults: lg\_k = 12, tgt\_type = HLL\_4.<br>Returns: an HLL Sketch, as BYTES. |
| [hll_sketch_agg_string_lgk_type](../hll/sqlx/hll_sketch_agg_string_lgk_type.sqlx) | (str STRING, params STRUCT<lg_k BYTEINT, tgt_type STRING> NOT AGGREGATE) -> BYTES | Creates a sketch that represents the cardinality of the given STRING column.<br><br>Param str: the STRING column of identifiers.<br>Param lg\_k: the sketch accuracy/size parameter as an integer in the range \[4, 21\].<br>Param tgt\_type: The HLL type to use: one of {"HLL\_4", "HLL\_6", "HLL\_8"}.<br>Returns: an HLL Sketch, as BYTES. |
| [hll_sketch_agg_union_lgk_type](../hll/sqlx/hll_sketch_agg_union_lgk_type.sqlx) | (sketch BYTES, params STRUCT<lg_k BYTEINT, tgt_type STRING> NOT AGGREGATE) -> BYTES | Creates a sketch that represents the union of the given column of sketches.<br><br>Param sketch: the column of sketches. Each as BYTES.<br>Param lg\_k: the sketch accuracy/size parameter as an integer in the range \[4, 21\].<br>Param tgt\_type: The HLL type to use: one of {"HLL\_4", "HLL\_6", "HLL\_8"}.<br>Returns: an HLL Sketch, as BYTES. |
| [hll_sketch_agg_int64_lgk_type](../hll/sqlx/hll_sketch_agg_int64_lgk_type.sqlx) | (value INT64, params STRUCT<lg_k BYTEINT, tgt_type STRING> NOT AGGREGATE) -> BYTES | Creates a sketch that represents the cardinality of the given INT64 column.<br><br>Param value: the INT64 column of identifiers.<br>Param lg\_k: the sketch accuracy/size parameter as an integer in the range \[4, 21\].<br>Param tgt\_type: The HLL type to use: one of {"HLL\_4", "HLL\_6", "HLL\_8"}.<br>Returns: an HLL Sketch, as BYTES. |

## Scalar Functions
| Function Name | Signature | Description |
|---|---|---|
| [hll_sketch_get_estimate](../hll/sqlx/hll_sketch_get_estimate.sqlx) | (sketch BYTES) -> FLOAT64 | Returns a summary string that represents the state of the given sketch.<br><br>Param sketch: the given sketch as BYTES.<br>Returns: the cardinality estimate as FLOAT64 value. |
| [hll_sketch_to_string](../hll/sqlx/hll_sketch_to_string.sqlx) | (sketch BYTES) -> STRING | Returns a summary string that represents the state of the given sketch.<br><br>Param sketch: the given sketch as BYTES.<br>Returns: a STRING that represents the state of the given sketch. |
| [hll_sketch_union](../hll/sqlx/hll_sketch_union.sqlx) | (sketchA BYTES, sketchB BYTES) -> BYTES | Computes a sketch that represents the union of the two given sketches.<br><br>Param sketchA: the first sketch as bytes.<br>Param sketchB: the second sketch as bytes.<br>Defaults: lg\_k = 12, tgt\_type = HLL\_4.<br>Returns: an HLL Sketch, as BYTES. |
| [hll_sketch_union_lgk_type](../hll/sqlx/hll_sketch_union_lgk_type.sqlx) | (sketchA BYTES, sketchB BYTES, lg_k BYTEINT, tgt_type STRING) -> BYTES | Computes a sketch that represents the union of the two given sketches.<br><br>Param sketchA: the first sketch as bytes.<br>Param sketchB: the second sketch as bytes.<br>Param lg\_k: the sketch accuracy/size parameter as an integer in the range \[4, 21\].<br>Param tgt\_type: The HLL type to use: one of {"HLL\_4", "HLL\_6", "HLL\_8"}.<br>Returns: an HLL Sketch, as BYTES. |
| [hll_sketch_get_estimate_and_bounds](../hll/sqlx/hll_sketch_get_estimate_and_bounds.sqlx) | (sketch BYTES, num_std_devs BYTEINT) -> STRUCT<estimate FLOAT64, lower_bound FLOAT64, upper_bound FLOAT64> | Gets cardinality estimate and bounds from given sketch.<br><br>Param sketch: The given sketch to query as BYTES.<br>Param num\_std\_devs: The returned bounds will be based on the statistical confidence interval determined by the given number of standard deviations<br>  from the returned estimate. This number may be one of {1,2,3}, where 1 represents 68% confidence, 2 represents 95% confidence and 3 represents 99.7% confidence.<br>  For example, if the given num\_std\_devs = 2 and the returned values are {1000, 990, 1010} that means that with 95% confidence, the true value lies within the range \[990, 1010\].<br>Returns: a struct with 3 FLOAT64 values as {estimate, lower\_bound, upper\_bound}. |

**Examples:**

```sql

# expected 3
select bqutil.datasketches.hll_sketch_get_estimate(bqutil.datasketches.hll_sketch_agg_string(s)) from unnest(["a", "b", "c"]) as s;

select bqutil.datasketches.hll_sketch_to_string(bqutil.datasketches.hll_sketch_agg_string(s)) from unnest(["a", "b", "c"]) as s;

# expected 5
select bqutil.datasketches.hll_sketch_get_estimate_and_bounds(
  bqutil.datasketches.hll_sketch_union_lgk_type(
    (select bqutil.datasketches.hll_sketch_agg_string_lgk_type(str, struct<byteint, string>(10, "HLL_8")) from unnest(["a", "b", "c"]) as str),
    (select bqutil.datasketches.hll_sketch_agg_string_lgk_type(str, struct<byteint, string>(10, "HLL_8")) from unnest(["c", "d", "e"]) as str),
    10,
    "HLL_8"
  ),
  2
);

select bqutil.datasketches.hll_sketch_to_string(
  bqutil.datasketches.hll_sketch_union_lgk_type(
    (select bqutil.datasketches.hll_sketch_agg_string_lgk_type(str, struct<byteint, string>(10, "HLL_8")) from unnest(["a", "b", "c"]) as str),
    (select bqutil.datasketches.hll_sketch_agg_string_lgk_type(str, struct<byteint, string>(10, "HLL_8")) from unnest(["c", "d", "e"]) as str),
    10,
    "HLL_8"
  )
);

create or replace temp table hll_sketch(sketch bytes);

insert into hll_sketch
(select bqutil.datasketches.hll_sketch_agg_int64(value) from unnest(GENERATE_ARRAY(1, 10000, 1)) as value);
insert into hll_sketch
(select bqutil.datasketches.hll_sketch_agg_int64(value) from unnest(GENERATE_ARRAY(100000, 110000, 1)) as value);

# expected estimate about 20000
select bqutil.datasketches.hll_sketch_to_string(
  bqutil.datasketches.hll_sketch_agg_union(sketch)
) from hll_sketch;

select bqutil.datasketches.hll_sketch_to_string(
  bqutil.datasketches.hll_sketch_agg_union_lgk_type(sketch, struct<byteint, string>(10, "HLL_6"))
) from hll_sketch;

drop table hll_sketch;

create or replace temp table hll_sketch(sketch bytes);

insert into hll_sketch
(select bqutil.datasketches.hll_sketch_agg_int64_lgk_type(value, struct<int, string>(8, "HLL_6")) from unnest(GENERATE_ARRAY(1, 10000, 1)) as value);
insert into hll_sketch
(select bqutil.datasketches.hll_sketch_agg_int64_lgk_type(value, struct<int, string>(8, "HLL_6")) from unnest(GENERATE_ARRAY(100000, 110000, 1)) as value);

# expected estimate about 20000
select bqutil.datasketches.hll_sketch_to_string(
  bqutil.datasketches.hll_sketch_agg_union_lgk_type(sketch, struct<byteint, string>(8, "HLL_6"))
) from hll_sketch;

drop table hll_sketch;
```
