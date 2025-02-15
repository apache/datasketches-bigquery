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

## Aggregate Functions

### [req_sketch_float_build(value FLOAT64)](../req/sqlx/req_sketch_float_build.sqlx)
Creates a sketch that represents the distribution of the given column.

* Param value: the column of FLOAT64 values.
* Defaults: k = 12, hra = true.
* Returns: a serialized REQ Sketch as BYTES.

### [req_sketch_float_merge(sketch BYTES)](../req/sqlx/req_sketch_float_merge.sqlx)
Merges sketches from the given column.

* Param sketch: the column of sketches.
* Defaults: k = 12, hra = true.
* Returns: a serialized REQ sketch as BYTES.

### [req_sketch_float_build_k_hra(value FLOAT64, params STRUCT<k INT, hra BOOL> NOT AGGREGATE)](../req/sqlx/req_sketch_float_build_k_hra.sqlx)
Creates a sketch that represents the distribution of the given column.

* Param value: the column of FLOAT64 values.
* Param k: the sketch accuracy/size parameter as an even INT in the range \[4, 65534\].
* Param hra: if true, the high ranks are prioritized for better accuracy. Otherwise the low ranks are prioritized for better accuracy.
* Returns: a serialized REQ Sketch as BYTES.

### [req_sketch_float_merge_k_hra(sketch BYTES, params STRUCT<k INT, hra BOOL> NOT AGGREGATE)](../req/sqlx/req_sketch_float_merge_k_hra.sqlx)
Merges sketches from the given column.

* Param sketch: the column of values.
* Param k: the sketch accuracy/size parameter as an even INT in the range \[4, 65534\].
* Param hra: if true, the high ranks are prioritized for better accuracy. Otherwise the low ranks are prioritized for better accuracy.
* Returns: a serialized REQ sketch as BYTES.

## Scalar Functions

### [req_sketch_float_get_n(sketch BYTES)](../req/sqlx/req_sketch_float_get_n.sqlx)
Returns the length of the input stream.

* Param sketch: the given sketch as BYTES.
* Returns: stream length as INT64

### [req_sketch_float_get_num_retained(sketch BYTES)](../req/sqlx/req_sketch_float_get_num_retained.sqlx)
Returns the number of retained items \(samples\) in the sketch.

* Param sketch: the given sketch as BYTES.
* Returns: number of retained items as INT64

### [req_sketch_float_get_min_value(sketch BYTES)](../req/sqlx/req_sketch_float_get_min_value.sqlx)
Returns the minimum value of the input stream.

* Param sketch: the given sketch as BYTES.
* Returns: min value as FLOAT64

### [req_sketch_float_to_string(sketch BYTES)](../req/sqlx/req_sketch_float_to_string.sqlx)
Returns a summary string that represents the state of the given sketch.

* Param sketch: the given sketch as BYTES.
* Returns: a string that represents the state of the given sketch.

### [req_sketch_float_get_max_value(sketch BYTES)](../req/sqlx/req_sketch_float_get_max_value.sqlx)
Returns the maximum value of the input stream.

* Param sketch: the given sketch as BYTES.
* Returns: max value as FLOAT64

### [req_sketch_float_get_cdf(sketch BYTES, split_points ARRAY<FLOAT64>, inclusive BOOL)](../req/sqlx/req_sketch_float_get_cdf.sqlx)
Returns an approximation to the Cumulative Distribution Function \(CDF\) 
of the input stream as an array of cumulative probabilities defined by the given split\_points.

* Param sketch: the given sketch as BYTES.

* Param split\_points: an array of M unique, monotonically increasing values
  \(of the same type as the input values to the sketch\)
  that divide the input value domain into M\+1 overlapping intervals.
  
  The start of each interval is below the lowest input value retained by the sketch
  \(corresponding to a zero rank or zero probability\).
  
  The end of each interval is the associated split\-point except for the top interval
  where the end is the maximum input value of the stream.

* Param inclusive: if true and the upper boundary of an interval equals a value retained by the sketch, the interval will include that value. 
  If the lower boundary of an interval equals a value retained by the sketch, the interval will exclude that value.

  If false and the upper boundary of an interval equals a value retained by the sketch, the interval will exclude that value. 
  If the lower boundary of an interval equals a value retained by the sketch, the interval will include that value.

* Returns: the CDF as a monotonically increasing FLOAT64 array of M\+1 cumulative probablities on the interval \[0.0, 1.0\].
  The top\-most probability of the returned array is always 1.0.

### [req_sketch_float_get_rank_lower_bound(sketch BYTES, rank FLOAT64, num_std_dev BYTEINT)](../req/sqlx/req_sketch_float_get_rank_lower_bound.sqlx)
Returns an approximate lower bound of the given normalized rank.
* Param sketch: the given sketch as BYTES.
* Param rank: the given rank, a value between 0 and 1.0.
* Param num\_std\_dev: The returned bounds will be based on the statistical confidence interval determined by the given number of standard deviations
  from the returned estimate. This number may be one of {1,2,3}, where 1 represents 68% confidence, 2 represents 95% confidence and 3 represents 99.7% confidence.
* Returns: an approximate lower bound rank.

### [req_sketch_float_get_pmf(sketch BYTES, split_points ARRAY<FLOAT64>, inclusive BOOL)](../req/sqlx/req_sketch_float_get_pmf.sqlx)
Returns an approximation to the Probability Mass Function \(PMF\)
of the input stream as an array of probability masses defined by the given split\_points.

* Param sketch: the given sketch as BYTES.

* Param split\_points: an array of M unique, monotonically increasing values 
  \(of the same type as the input values\)
  that divide the input value domain into M\+1 non\-overlapping intervals.
  
  Each interval except for the end intervals starts with a split\-point and ends with the next split\-point in sequence.

  The first interval starts below the minimum value of the stream \(corresponding to a zero rank or zero probability\), 
  and ends with the first split\-point

  The last \(m\+1\)th interval starts with the last split\-point 
  and ends above the maximum value of the stream \(corresponding to a rank or probability of 1.0\).

* Param inclusive: if true and the upper boundary of an interval equals a value retained by the sketch, the interval will include that value. 
  If the lower boundary of an interval equals a value retained by the sketch, the interval will exclude that value.

  If false and the upper boundary of an interval equals a value retained by the sketch, the interval will exclude that value. 
  If the lower boundary of an interval equals a value retained by the sketch, the interval will include that value.

* Returns: the PMF as a FLOAT64 array of M\+1 probability masses on the interval \[0.0, 1.0\].
  The sum of the probability masses of all \(m\+1\) intervals is 1.0.

### [req_sketch_float_get_quantile(sketch BYTES, rank FLOAT64, inclusive BOOL)](../req/sqlx/req_sketch_float_get_quantile.sqlx)
Returns a value from the sketch that is the best approximation to a value from the original stream with the given rank.

* Param sketch: the given sketch in serialized form.
* Param rank: rank of a value in the hypothetical sorted stream.
* Param inclusive: if true, the given rank is considered inclusive \(includes weight of a value\)
* Returns: an approximate quantile associated with the given rank.

### [req_sketch_float_get_rank_upper_bound(sketch BYTES, rank FLOAT64, num_std_dev BYTEINT)](../req/sqlx/req_sketch_float_get_rank_upper_bound.sqlx)
Returns an approximate upper bound of the given normalized rank.
* Param sketch: the given sketch as BYTES.
* Param rank: the given rank, a value between 0 and 1.0.
* Param num\_std\_dev: The returned bounds will be based on the statistical confidence interval determined by the given number of standard deviations
  from the returned estimate. This number may be one of {1,2,3}, where 1 represents 68% confidence, 2 represents 95% confidence and 3 represents 99.7% confidence.
* Returns: an approximate upper bound rank.

### [req_sketch_float_get_rank(sketch BYTES, value FLOAT64, inclusive BOOL)](../req/sqlx/req_sketch_float_get_rank.sqlx)
Returns an approximation to the normalized rank, on the interval \[0.0, 1.0\], of the given value.

* Param sketch: the given sketch in serialized form.
* Param value: value to be ranked.
* Param inclusive: if true the weight of the given value is included into the rank.
* Returns: an approximate rank of the given value.

## Examples

### [test/req_sketch_float_test.sql](../req/test/req_sketch_float_test.sql)
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
