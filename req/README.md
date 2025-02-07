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

# Apache DataSketches REQ Sketches for Google BigQuery

Relative Error Quantiles Sketch that rovides extremely high accuracy
at a chosen end of the rank domain: high rank accuracy (HRA) or low
rank accuracy (LRA).
REQ sketches are quantile sketches that provide approximate quantiles
and ranks for a dataset.

Please visit 
[REQ Sketches](https://datasketches.apache.org/docs/REQ/ReqSketch.html) 
for more information about this sketch family.

Please visit the main 
[Apache DataSketches website](https://datasketches.apache.org) 
for more information about DataSketches library.

If you are interested in making contributions to this project please see our 
[Community](https://datasketches.apache.org/docs/Community/) 
page for how to contact us.

| Function Name | Function Type | Signature | Description |
|---|---|---|---|
| [req_sketch_float_build](../req/sqlx/req_sketch_float_build.sqlx) | AGGREGATE | (value FLOAT64) -> BYTES | Creates a sketch that represents the distribution of the given column.<br><br>Param value: the column of FLOAT64 values.<br>Defaults: k = 12, hra = true.<br>Returns: a serialized REQ Sketch as BYTES. |
| [req_sketch_float_merge](../req/sqlx/req_sketch_float_merge.sqlx) | AGGREGATE | (sketch BYTES) -> BYTES | Merges sketches from the given column.<br><br>Param sketch: the column of sketches.<br>Defaults: k = 12, hra = true.<br>Returns: a serialized REQ sketch as BYTES. |
| [req_sketch_float_build_k_hra](../req/sqlx/req_sketch_float_build_k_hra.sqlx) | AGGREGATE | (value FLOAT64, params STRUCT<k INT, hra BOOL> NOT AGGREGATE) -> BYTES | Creates a sketch that represents the distribution of the given column.<br><br>Param value: the column of FLOAT64 values.<br>Param k: the sketch accuracy/size parameter as an even INT in the range \[4, 65534\].<br>Param hra: if true, the high ranks are prioritized for better accuracy. Otherwise the low ranks are prioritized for better accuracy.<br>Returns: a serialized REQ Sketch as BYTES. |
| [req_sketch_float_merge_k_hra](../req/sqlx/req_sketch_float_merge_k_hra.sqlx) | AGGREGATE | (sketch BYTES, params STRUCT<k INT, hra BOOL> NOT AGGREGATE) -> BYTES | Merges sketches from the given column.<br><br>Param sketch: the column of values.<br>Param k: the sketch accuracy/size parameter as an even INT in the range \[4, 65534\].<br>Param hra: if true, the high ranks are prioritized for better accuracy. Otherwise the low ranks are prioritized for better accuracy.<br>Returns: a serialized REQ sketch as BYTES. |
| [req_sketch_float_get_n](../req/sqlx/req_sketch_float_get_n.sqlx) | SCALAR | (sketch BYTES) -> INT64 | Returns the length of the input stream.<br><br>Param sketch: the given sketch as BYTES.<br>Returns: stream length as INT64 |
| [req_sketch_float_get_num_retained](../req/sqlx/req_sketch_float_get_num_retained.sqlx) | SCALAR | (sketch BYTES) -> INT64 | Returns the number of retained items \(samples\) in the sketch.<br><br>Param sketch: the given sketch as BYTES.<br>Returns: number of retained items as INT64 |
| [req_sketch_float_get_min_value](../req/sqlx/req_sketch_float_get_min_value.sqlx) | SCALAR | (sketch BYTES) -> FLOAT64 | Returns the minimum value of the input stream.<br><br>Param sketch: the given sketch as BYTES.<br>Returns: min value as FLOAT64 |
| [req_sketch_float_to_string](../req/sqlx/req_sketch_float_to_string.sqlx) | SCALAR | (sketch BYTES) -> STRING | Returns a summary string that represents the state of the given sketch.<br><br>Param sketch: the given sketch as BYTES.<br>Returns: a string that represents the state of the given sketch. |
| [req_sketch_float_get_max_value](../req/sqlx/req_sketch_float_get_max_value.sqlx) | SCALAR | (sketch BYTES) -> FLOAT64 | Returns the maximum value of the input stream.<br><br>Param sketch: the given sketch as BYTES.<br>Returns: max value as FLOAT64 |
| [req_sketch_float_get_cdf](../req/sqlx/req_sketch_float_get_cdf.sqlx) | SCALAR | (sketch BYTES, split_points ARRAY<FLOAT64>, inclusive BOOL) -> ARRAY<FLOAT64> | Returns an approximation to the Cumulative Distribution Function \(CDF\) <br>of the input stream as an array of cumulative probabilities defined by the given split\_points.<br><br>Param sketch: the given sketch as BYTES.<br><br>Param split\_points: an array of M unique, monotonically increasing values<br>  \(of the same type as the input values to the sketch\)<br>  that divide the input value domain into M\+1 overlapping intervals.<br>  <br>  The start of each interval is below the lowest input value retained by the sketch<br>  \(corresponding to a zero rank or zero probability\).<br>  <br>  The end of each interval is the associated split\-point except for the top interval<br>  where the end is the maximum input value of the stream.<br><br>Param inclusive: if true and the upper boundary of an interval equals a value retained by the sketch, the interval will include that value. <br>  If the lower boundary of an interval equals a value retained by the sketch, the interval will exclude that value.<br><br>  If false and the upper boundary of an interval equals a value retained by the sketch, the interval will exclude that value. <br>  If the lower boundary of an interval equals a value retained by the sketch, the interval will include that value.<br><br>Returns: the CDF as a monotonically increasing FLOAT64 array of M\+1 cumulative probablities on the interval \[0.0, 1.0\].<br>  The top\-most probability of the returned array is always 1.0. |
| [req_sketch_float_get_rank_lower_bound](../req/sqlx/req_sketch_float_get_rank_lower_bound.sqlx) | SCALAR | (sketch BYTES, rank FLOAT64, num_std_dev BYTEINT) -> FLOAT64 | Returns an approximate lower bound of the given normalized rank.<br>Param sketch: the given sketch as BYTES.<br>Param rank: the given rank, a value between 0 and 1.0.<br>Param num\_std\_dev: The returned bounds will be based on the statistical confidence interval determined by the given number of standard deviations<br>  from the returned estimate. This number may be one of {1,2,3}, where 1 represents 68% confidence, 2 represents 95% confidence and 3 represents 99.7% confidence.<br>Returns: an approximate lower bound rank. |
| [req_sketch_float_get_pmf](../req/sqlx/req_sketch_float_get_pmf.sqlx) | SCALAR | (sketch BYTES, split_points ARRAY<FLOAT64>, inclusive BOOL) -> ARRAY<FLOAT64> | Returns an approximation to the Probability Mass Function \(PMF\)<br>of the input stream as an array of probability masses defined by the given split\_points.<br><br>Param sketch: the given sketch as BYTES.<br><br>Param split\_points: an array of M unique, monotonically increasing values <br>  \(of the same type as the input values\)<br>  that divide the input value domain into M\+1 non\-overlapping intervals.<br>  <br>  Each interval except for the end intervals starts with a split\-point and ends with the next split\-point in sequence.<br><br>  The first interval starts below the minimum value of the stream \(corresponding to a zero rank or zero probability\), <br>  and ends with the first split\-point<br><br>  The last \(m\+1\)th interval starts with the last split\-point <br>  and ends above the maximum value of the stream \(corresponding to a rank or probability of 1.0\).<br><br>Param inclusive: if true and the upper boundary of an interval equals a value retained by the sketch, the interval will include that value. <br>  If the lower boundary of an interval equals a value retained by the sketch, the interval will exclude that value.<br><br>  If false and the upper boundary of an interval equals a value retained by the sketch, the interval will exclude that value. <br>  If the lower boundary of an interval equals a value retained by the sketch, the interval will include that value.<br><br>Returns: the PMF as a FLOAT64 array of M\+1 probability masses on the interval \[0.0, 1.0\].<br>  The sum of the probability masses of all \(m\+1\) intervals is 1.0. |
| [req_sketch_float_get_quantile](../req/sqlx/req_sketch_float_get_quantile.sqlx) | SCALAR | (sketch BYTES, rank FLOAT64, inclusive BOOL) -> FLOAT64 | Returns a value from the sketch that is the best approximation to a value from the original stream with the given rank.<br><br>Param sketch: the given sketch in serialized form.<br>Param rank: rank of a value in the hypothetical sorted stream.<br>Param inclusive: if true, the given rank is considered inclusive \(includes weight of a value\)<br>Returns: an approximate quantile associated with the given rank. |
| [req_sketch_float_get_rank_upper_bound](../req/sqlx/req_sketch_float_get_rank_upper_bound.sqlx) | SCALAR | (sketch BYTES, rank FLOAT64, num_std_dev BYTEINT) -> FLOAT64 | Returns an approximate upper bound of the given normalized rank.<br>Param sketch: the given sketch as BYTES.<br>Param rank: the given rank, a value between 0 and 1.0.<br>Param num\_std\_dev: The returned bounds will be based on the statistical confidence interval determined by the given number of standard deviations<br>  from the returned estimate. This number may be one of {1,2,3}, where 1 represents 68% confidence, 2 represents 95% confidence and 3 represents 99.7% confidence.<br>Returns: an approximate upper bound rank. |
| [req_sketch_float_get_rank](../req/sqlx/req_sketch_float_get_rank.sqlx) | SCALAR | (sketch BYTES, value FLOAT64, inclusive BOOL) -> FLOAT64 | Returns an approximation to the normalized rank, on the interval \[0.0, 1.0\], of the given value.<br><br>Param sketch: the given sketch in serialized form.<br>Param value: value to be ranked.<br>Param inclusive: if true the weight of the given value is included into the rank.<br>Returns: an approximate rank of the given value. |

**Examples:**

```sql

# using defaults

create or replace temp table req_sketch(sketch bytes);

insert into req_sketch
(select bqutil.datasketches.req_sketch_float_build(value) from unnest([1,2,3,4,5,6,7,8,9,10]) as value);

insert into req_sketch
(select bqutil.datasketches.req_sketch_float_build(value) from unnest([11,12,13,14,15,16,17,18,19,20]) as value);

select bqutil.datasketches.req_sketch_float_to_string(bqutil.datasketches.req_sketch_float_merge(sketch)) from req_sketch;

# expected 0.5
select bqutil.datasketches.req_sketch_float_get_rank(bqutil.datasketches.req_sketch_float_merge(sketch), 10, true) from req_sketch;

# expected 10
select bqutil.datasketches.req_sketch_float_get_quantile(bqutil.datasketches.req_sketch_float_merge(sketch), 0.5, true) from req_sketch;

# expected 0.5, 0.5
select bqutil.datasketches.req_sketch_float_get_pmf(bqutil.datasketches.req_sketch_float_merge(sketch), [10.0], true) from req_sketch;

# expected 0.5, 1
select bqutil.datasketches.req_sketch_float_get_cdf(bqutil.datasketches.req_sketch_float_merge(sketch), [10.0], true) from req_sketch;

# expected 1
select bqutil.datasketches.req_sketch_float_get_min_value(bqutil.datasketches.req_sketch_float_merge(sketch)) from req_sketch;

# expected 20
select bqutil.datasketches.req_sketch_float_get_max_value(bqutil.datasketches.req_sketch_float_merge(sketch)) from req_sketch;

# expected 20
select bqutil.datasketches.req_sketch_float_get_n(bqutil.datasketches.req_sketch_float_merge(sketch)) from req_sketch;

# expected 20
select bqutil.datasketches.req_sketch_float_get_num_retained(bqutil.datasketches.req_sketch_float_merge(sketch)) from req_sketch;

drop table req_sketch;

# using full signatures

create or replace temp table req_sketch(sketch bytes);

insert into req_sketch
(select bqutil.datasketches.req_sketch_float_build_k_hra(value, struct<int, bool>(10, false)) from unnest([1,2,3,4,5,6,7,8,9,10]) as value);

insert into req_sketch
(select bqutil.datasketches.req_sketch_float_build_k_hra(value, struct<int, bool>(10, false)) from unnest([11,12,13,14,15,16,17,18,19,20]) as value);

select bqutil.datasketches.req_sketch_float_to_string(bqutil.datasketches.req_sketch_float_merge_k_hra(sketch, struct<int, bool>(10, false))) from req_sketch;

drop table req_sketch;
```
