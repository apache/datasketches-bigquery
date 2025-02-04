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

# Apache DataSketches t-digest for Google BigQuery

Estimates distributions of numeric values, provides approximate quantiles and ranks
prioritizing low and high rank accuracy.

Please visit 
[t-digest overview](https://datasketches.apache.org/docs/tdigest/tdigest.html) 
for more information about this sketch family.

Please visit the main 
[Apache DataSketches website](https://datasketches.apache.org) 
for more information about DataSketches library.

If you are interested in making contributions to this project please see our 
[Community](https://datasketches.apache.org/docs/Community/) 
page for how to contact us.

| Function Name | Function Type | Signature | Description |
|---|---|---|---|
| [tdigest_double_build](../tdigest/sqlx/tdigest_double_build.sqlx) | AGGREGATE | (value FLOAT64) -> BYTES | Creates a sketch that represents the distribution of the given column.\<br\>\<br\>Param value: the column of FLOAT64 values.\<br\>Defaults: k = 200.\<br\>Returns: a t\-Digest, as bytes. |
| [tdigest_double_merge](../tdigest/sqlx/tdigest_double_merge.sqlx) | AGGREGATE | (sketch BYTES) -> BYTES | Merges sketches from the given column.\<br\>\<br\>Param sketch: the column of values.\<br\>Defaults: k = 200.\<br\>Returns: a serialized t\-Digest as BYTES. |
| [tdigest_double_merge_k](../tdigest/sqlx/tdigest_double_merge_k.sqlx) | AGGREGATE | (sketch BYTES, k INT NOT AGGREGATE) -> BYTES | Merges sketches from the given column.\<br\>\<br\>Param sketch: the column of values.\<br\>Param k: the sketch accuracy/size parameter as an integer in the range \[10, 65535\].\<br\>Returns: a serialized t\-Digest as BYTES. |
| [tdigest_double_build_k](../tdigest/sqlx/tdigest_double_build_k.sqlx) | AGGREGATE | (value FLOAT64, k INT NOT AGGREGATE) -> BYTES | Creates a sketch that represents the distribution of the given column.\<br\>\<br\>Param value: the column of FLOAT64 values.\<br\>Param k: the sketch accuracy/size parameter as an INT in the range \[10, 65535\].\<br\>Returns: a t\-Digest, as bytes. |
| [tdigest_double_get_max_value](../tdigest/sqlx/tdigest_double_get_max_value.sqlx) | SCALAR | (sketch BYTES) -> FLOAT64 | Returns the maximum value of the input stream.\<br\>\<br\>Param sketch: the given sketch as BYTES.\<br\>Returns: max value as FLOAT64 |
| [tdigest_double_to_string](../tdigest/sqlx/tdigest_double_to_string.sqlx) | SCALAR | (sketch BYTES) -> STRING | Returns a summary string that represents the state of the given sketch.\<br\>\<br\>Param sketch: the given sketch as sketch encoded bytes.\<br\>Returns: a string that represents the state of the given sketch. |
| [tdigest_double_get_total_weight](../tdigest/sqlx/tdigest_double_get_total_weight.sqlx) | SCALAR | (sketch BYTES) -> INT64 | Returns the total weight of the input stream.\<br\>\<br\>Param sketch: the given sketch as BYTES.\<br\>Returns: total weight as INT64 |
| [tdigest_double_get_min_value](../tdigest/sqlx/tdigest_double_get_min_value.sqlx) | SCALAR | (sketch BYTES) -> FLOAT64 | Returns the minimum value of the input stream.\<br\>\<br\>Param sketch: the given sketch as BYTES.\<br\>Returns: min value as FLOAT64 |
| [tdigest_double_get_rank](../tdigest/sqlx/tdigest_double_get_rank.sqlx) | SCALAR | (sketch BYTES, value FLOAT64) -> FLOAT64 | Returns an approximation to the normalized rank, on the interval \[0.0, 1.0\], of the given value.\<br\>\<br\>Param sketch: the given sketch in serialized form.\<br\>Param value: value to be ranked.\<br\>Returns: an approximate rank of the given value. |
| [tdigest_double_get_quantile](../tdigest/sqlx/tdigest_double_get_quantile.sqlx) | SCALAR | (sketch BYTES, rank FLOAT64) -> FLOAT64 | Returns a value from the sketch that is the best approximation to a value from the original stream with the given rank.\<br\>\<br\>Param sketch: the given sketch in serialized form.\<br\>Param rank: rank of a value in the hypothetical sorted stream.\<br\>Returns: an approximate quantile associated with the given rank. |

**Examples:**

```sql

create or replace table `$BQ_DATASET`.tdigest_double(sketch bytes);

# using default
insert into `$BQ_DATASET`.tdigest_double
(select `$BQ_DATASET`.tdigest_double_build(value) from unnest([1,2,3,4,5,6,7,8,9,10]) as value);

# using full signature
insert into `$BQ_DATASET`.tdigest_double
(select `$BQ_DATASET`.tdigest_double_build_k(value, 100) from unnest([11,12,13,14,15,16,17,18,19,20]) as value);

select `$BQ_DATASET`.tdigest_double_to_string(sketch) from `$BQ_DATASET`.tdigest_double;

# using default
select `$BQ_DATASET`.tdigest_double_to_string(`$BQ_DATASET`.tdigest_double_merge(sketch)) from `$BQ_DATASET`.tdigest_double;

# using full signature
select `$BQ_DATASET`.tdigest_double_to_string(`$BQ_DATASET`.tdigest_double_merge_k(sketch, 100)) from `$BQ_DATASET`.tdigest_double;

# expected 0.5
select `$BQ_DATASET`.tdigest_double_get_rank(`$BQ_DATASET`.tdigest_double_merge(sketch), 10) from `$BQ_DATASET`.tdigest_double;

# expected 10
select `$BQ_DATASET`.tdigest_double_get_quantile(`$BQ_DATASET`.tdigest_double_merge(sketch), 0.5) from `$BQ_DATASET`.tdigest_double;

# expected 20
select `$BQ_DATASET`.tdigest_double_get_total_weight(`$BQ_DATASET`.tdigest_double_merge(sketch)) from `$BQ_DATASET`.tdigest_double;

# expected 1
select `$BQ_DATASET`.tdigest_double_get_min_value(`$BQ_DATASET`.tdigest_double_merge(sketch)) from `$BQ_DATASET`.tdigest_double;

# expected 20
select `$BQ_DATASET`.tdigest_double_get_max_value(`$BQ_DATASET`.tdigest_double_merge(sketch)) from `$BQ_DATASET`.tdigest_double;

drop table `$BQ_DATASET`.tdigest_double;
```
