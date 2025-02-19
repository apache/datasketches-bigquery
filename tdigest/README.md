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

## Aggregate Functions

### [tdigest_double_build(value FLOAT64)](../tdigest/sqlx/tdigest_double_build.sqlx)
Creates a sketch that represents the distribution of the given column.

* Param value: the column of FLOAT64 values.
* Defaults: k = 200.
* Returns: a t\-Digest, as bytes.

### [tdigest_double_merge(sketch BYTES)](../tdigest/sqlx/tdigest_double_merge.sqlx)
Merges sketches from the given column.

* Param sketch: the column of values.
* Defaults: k = 200.
* Returns: a serialized t\-Digest as BYTES.

### [tdigest_double_merge_k(sketch BYTES, k INT NOT AGGREGATE)](../tdigest/sqlx/tdigest_double_merge_k.sqlx)
Merges sketches from the given column.

* Param sketch: the column of values.
* Param k: the sketch accuracy/size parameter as an integer in the range \[10, 65535\].
* Returns: a serialized t\-Digest as BYTES.

### [tdigest_double_build_k(value FLOAT64, k INT NOT AGGREGATE)](../tdigest/sqlx/tdigest_double_build_k.sqlx)
Creates a sketch that represents the distribution of the given column.

* Param value: the column of FLOAT64 values.
* Param k: the sketch accuracy/size parameter as an INT in the range \[10, 65535\].
* Returns: a t\-Digest, as bytes.

## Scalar Functions

### [tdigest_double_get_max_value(sketch BYTES)](../tdigest/sqlx/tdigest_double_get_max_value.sqlx)
Returns the maximum value of the input stream.

* Param sketch: the given sketch as BYTES.
* Returns: max value as FLOAT64

### [tdigest_double_to_string(sketch BYTES)](../tdigest/sqlx/tdigest_double_to_string.sqlx)
Returns a summary string that represents the state of the given sketch.

* Param sketch: the given sketch as sketch encoded bytes.
* Returns: a string that represents the state of the given sketch.

### [tdigest_double_get_total_weight(sketch BYTES)](../tdigest/sqlx/tdigest_double_get_total_weight.sqlx)
Returns the total weight of the input stream.

* Param sketch: the given sketch as BYTES.
* Returns: total weight as INT64

### [tdigest_double_get_min_value(sketch BYTES)](../tdigest/sqlx/tdigest_double_get_min_value.sqlx)
Returns the minimum value of the input stream.

* Param sketch: the given sketch as BYTES.
* Returns: min value as FLOAT64

### [tdigest_double_get_rank(sketch BYTES, value FLOAT64)](../tdigest/sqlx/tdigest_double_get_rank.sqlx)
Returns an approximation to the normalized rank, on the interval \[0.0, 1.0\], of the given value.

* Param sketch: the given sketch in serialized form.
* Param value: value to be ranked.
* Returns: an approximate rank of the given value.

### [tdigest_double_get_quantile(sketch BYTES, rank FLOAT64)](../tdigest/sqlx/tdigest_double_get_quantile.sqlx)
Returns a value from the sketch that is the best approximation to a value from the original stream with the given rank.

* Param sketch: the given sketch in serialized form.
* Param rank: rank of a value in the hypothetical sorted stream.
* Returns: an approximate quantile associated with the given rank.

## Examples

### [test/tdigest_double_test.sql](../tdigest/test/tdigest_double_test.sql)
```sql

create or replace temp table tdigest_double(sketch bytes);

# using default
insert into tdigest_double
(select bqutil.datasketches.tdigest_double_build(value) from unnest([1,2,3,4,5,6,7,8,9,10]) as value);

# using full signature
insert into tdigest_double
(select bqutil.datasketches.tdigest_double_build_k(value, 100) from unnest([11,12,13,14,15,16,17,18,19,20]) as value);

select bqutil.datasketches.tdigest_double_to_string(sketch) from tdigest_double;

# using default
select bqutil.datasketches.tdigest_double_to_string(bqutil.datasketches.tdigest_double_merge(sketch)) from tdigest_double;

# using full signature
select bqutil.datasketches.tdigest_double_to_string(bqutil.datasketches.tdigest_double_merge_k(sketch, 100)) from tdigest_double;

# expected 0.5
select bqutil.datasketches.tdigest_double_get_rank(bqutil.datasketches.tdigest_double_merge(sketch), 10) from tdigest_double;

# expected 10
select bqutil.datasketches.tdigest_double_get_quantile(bqutil.datasketches.tdigest_double_merge(sketch), 0.5) from tdigest_double;

# expected 20
select bqutil.datasketches.tdigest_double_get_total_weight(bqutil.datasketches.tdigest_double_merge(sketch)) from tdigest_double;

# expected 1
select bqutil.datasketches.tdigest_double_get_min_value(bqutil.datasketches.tdigest_double_merge(sketch)) from tdigest_double;

# expected 20
select bqutil.datasketches.tdigest_double_get_max_value(bqutil.datasketches.tdigest_double_merge(sketch)) from tdigest_double;

drop table tdigest_double;
```
