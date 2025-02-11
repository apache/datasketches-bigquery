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

# Apache DataSketches KLL Sketches for Google BigQuery

KLL sketches are quantile sketches that provide approximate quantiles
and ranks for a dataset. They are useful for understanding the distribution of
data and calculating percentiles, such as the median or 95th percentile.

Please visit 
[KLL Sketches](https://datasketches.apache.org/docs/KLL/KLLSketch.html) 
for more information about this sketch family.

Please visit the main 
[Apache DataSketches website](https://datasketches.apache.org) 
for more information about DataSketches library.

If you are interested in making contributions to this project please see our 
[Community](https://datasketches.apache.org/docs/Community/) 
page for how to contact us.

## Aggregate Functions
### [kll_sketch_float_build(value FLOAT64)](../kll/sqlx/kll_sketch_float_build.sqlx)
Creates a sketch that represents the distribution of the given column.<br><br>Param value: the column of FLOAT64 values.<br>Defaults: k = 200.<br>Returns: a KLL Sketch, as bytes.
### [kll_sketch_float_merge(sketch BYTES)](../kll/sqlx/kll_sketch_float_merge.sqlx)
Merges sketches from the given column.<br><br>Param sketch: the column of values.<br>Defaluts: k = 200.<br>Returns: a serialized KLL sketch as BYTES.
### [kll_sketch_float_merge_k(sketch BYTES, k INT NOT AGGREGATE)](../kll/sqlx/kll_sketch_float_merge_k.sqlx)
Merges sketches from the given column.<br><br>Param sketch: the column of values.<br>Param k: the sketch accuracy/size parameter as an integer in the range \[8, 65535\].<br>Returns: a serialized KLL sketch as BYTES.
### [kll_sketch_float_build_k(value FLOAT64, k INT NOT AGGREGATE)](../kll/sqlx/kll_sketch_float_build_k.sqlx)
Creates a sketch that represents the distribution of the given column.<br><br>Param value: the column of FLOAT64 values.<br>Param k: the sketch accuracy/size parameter as an INT in the range \[8, 65535\].<br>Returns: a KLL Sketch, as bytes.

## Scalar Functions
### [kll_sketch_float_get_n(sketch BYTES)](../kll/sqlx/kll_sketch_float_get_n.sqlx)
Returns the length of the input stream.<br><br>Param sketch: the given sketch as BYTES.<br>Returns: stream length as INT64
### [kll_sketch_float_get_min_value(sketch BYTES)](../kll/sqlx/kll_sketch_float_get_min_value.sqlx)
Returns the minimum value of the input stream.<br><br>Param sketch: the given sketch as BYTES.<br>Returns: min value as FLOAT64
### [kll_sketch_float_to_string(sketch BYTES)](../kll/sqlx/kll_sketch_float_to_string.sqlx)
Returns a summary string that represents the state of the given sketch.<br><br>Param sketch: the given sketch as sketch encoded bytes.<br>Returns: a string that represents the state of the given sketch.
### [kll_sketch_float_get_num_retained(sketch BYTES)](../kll/sqlx/kll_sketch_float_get_num_retained.sqlx)
Returns the number of retained items \(samples\) in the sketch.<br><br>Param sketch: the given sketch as BYTES.<br>Returns: number of retained items as INT64
### [kll_sketch_float_get_max_value(sketch BYTES)](../kll/sqlx/kll_sketch_float_get_max_value.sqlx)
Returns the maximum value of the input stream.<br><br>Param sketch: the given sketch as BYTES.<br>Returns: max value as FLOAT64
### [kll_sketch_float_get_normalized_rank_error(sketch BYTES, pmf BOOL)](../kll/sqlx/kll_sketch_float_get_normalized_rank_error.sqlx)
Returns the approximate rank error of the given sketch normalized as a fraction between zero and one.<br>Param sketch: the given sketch as BYTES.<br>Param pmf: if true, returns the "double\-sided" normalized rank error for the get\_PMF\(\) function.<br>Otherwise, it is the "single\-sided" normalized rank error for all the other queries.<br>Returns: normalized rank error as FLOAT64
### [kll_sketch_float_get_rank(sketch BYTES, value FLOAT64, inclusive BOOL)](../kll/sqlx/kll_sketch_float_get_rank.sqlx)
Returns an approximation to the normalized rank, on the interval \[0.0, 1.0\], of the given value.<br><br>Param sketch: the given sketch in serialized form.<br>Param value: value to be ranked.<br>Param inclusive: if true the weight of the given value is included into the rank.<br>Returns: an approximate rank of the given value.
### [kll_sketch_float_get_pmf(sketch BYTES, split_points ARRAY<FLOAT64>, inclusive BOOL)](../kll/sqlx/kll_sketch_float_get_pmf.sqlx)
Returns an approximation to the Probability Mass Function \(PMF\)<br>of the input stream as an array of probability masses defined by the given split\_points.<br><br>Param sketch: the given sketch as BYTES.<br><br>Param split\_points: an array of M unique, monotonically increasing values <br>  \(of the same type as the input values\)<br>  that divide the input value domain into M\+1 non\-overlapping intervals.<br>  <br>  Each interval except for the end intervals starts with a split\-point and ends with the next split\-point in sequence.<br><br>  The first interval starts below the minimum value of the stream \(corresponding to a zero rank or zero probability\), <br>  and ends with the first split\-point<br><br>  The last \(m\+1\)th interval starts with the last split\-point <br>  and ends above the maximum value of the stream \(corresponding to a rank or probability of 1.0\).<br><br>Param inclusive: if true and the upper boundary of an interval equals a value retained by the sketch, the interval will include that value. <br>  If the lower boundary of an interval equals a value retained by the sketch, the interval will exclude that value.<br><br>  If false and the upper boundary of an interval equals a value retained by the sketch, the interval will exclude that value. <br>  If the lower boundary of an interval equals a value retained by the sketch, the interval will include that value.<br><br>Returns: the PMF as a FLOAT64 array of M\+1 probability masses on the interval \[0.0, 1.0\].<br>  The sum of the probability masses of all \(m\+1\) intervals is 1.0.
### [kll_sketch_float_kolmogorov_smirnov(sketchA BYTES, sketchB BYTES, pvalue FLOAT64)](../kll/sqlx/kll_sketch_float_kolmogorov_smirnov.sqlx)
Performs the Kolmogorov\-Smirnov Test between two KLL sketches of type FLOAT64.<br>If the given sketches have insufficient data or if the sketch sizes are too small, this will return false.<br><br>Param sketchA: sketch A in serialized form.<br>Param sketchB: sketch B in serialized form.<br>Param pvalue: Target p\-value. Typically 0.001 to 0.1, e.g. 0.05.<br>Returns: boolean indicating whether we can reject the null hypothesis \(that the sketches<br>  reflect the same underlying distribution\) using the provided p\-value.
### [kll_sketch_float_get_cdf(sketch BYTES, split_points ARRAY<FLOAT64>, inclusive BOOL)](../kll/sqlx/kll_sketch_float_get_cdf.sqlx)
Returns an approximation to the Cumulative Distribution Function \(CDF\) <br>of the input stream as an array of cumulative probabilities defined by the given split\_points.<br><br>Param sketch: the given sketch as BYTES.<br><br>Param split\_points: an array of M unique, monotonically increasing values<br>  \(of the same type as the input values to the sketch\)<br>  that divide the input value domain into M\+1 overlapping intervals.<br>  <br>  The start of each interval is below the lowest input value retained by the sketch<br>  \(corresponding to a zero rank or zero probability\).<br>  <br>  The end of each interval is the associated split\-point except for the top interval<br>  where the end is the maximum input value of the stream.<br><br>Param inclusive: if true and the upper boundary of an interval equals a value retained by the sketch, the interval will include that value. <br>  If the lower boundary of an interval equals a value retained by the sketch, the interval will exclude that value.<br><br>  If false and the upper boundary of an interval equals a value retained by the sketch, the interval will exclude that value. <br>  If the lower boundary of an interval equals a value retained by the sketch, the interval will include that value.<br><br>Returns: the CDF as a monotonically increasing FLOAT64 array of M\+1 cumulative probablities on the interval \[0.0, 1.0\].<br>  The top\-most probability of the returned array is always 1.0.
### [kll_sketch_float_get_quantile(sketch BYTES, rank FLOAT64, inclusive BOOL)](../kll/sqlx/kll_sketch_float_get_quantile.sqlx)
Returns a value from the sketch that is the best approximation to a value from the original stream with the given rank.<br><br>Param sketch: the given sketch in serialized form.<br>Param rank: rank of a value in the hypothetical sorted stream.<br>Param inclusive: if true, the given rank is considered inclusive \(includes weight of a value\)<br>Returns: an approximate quantile associated with the given rank.
## Examples
```sql

create or replace temp table kll_sketch(sketch bytes);

# using default
insert into kll_sketch
(select bqutil.datasketches.kll_sketch_float_build(value) from unnest([1,2,3,4,5,6,7,8,9,10]) as value);

# using full signature
insert into kll_sketch
(select bqutil.datasketches.kll_sketch_float_build_k(value, 100) from unnest([11,12,13,14,15,16,17,18,19,20]) as value);

select bqutil.datasketches.kll_sketch_float_to_string(sketch) from kll_sketch;

# using default
select bqutil.datasketches.kll_sketch_float_to_string(bqutil.datasketches.kll_sketch_float_merge(sketch)) from kll_sketch;

# using full signature
select bqutil.datasketches.kll_sketch_float_to_string(bqutil.datasketches.kll_sketch_float_merge_k(sketch, 100)) from kll_sketch;

# expected 0.5
select bqutil.datasketches.kll_sketch_float_get_rank(bqutil.datasketches.kll_sketch_float_merge(sketch), 10, true) from kll_sketch;

# expected 10
select bqutil.datasketches.kll_sketch_float_get_quantile(bqutil.datasketches.kll_sketch_float_merge(sketch), 0.5, true) from kll_sketch;

# expected 20
select bqutil.datasketches.kll_sketch_float_get_n(bqutil.datasketches.kll_sketch_float_merge(sketch)) from kll_sketch;

# expected 0.5, 0.5
select bqutil.datasketches.kll_sketch_float_get_pmf(bqutil.datasketches.kll_sketch_float_merge(sketch), [10.0], true) from kll_sketch;

# expected 0.5, 1
select bqutil.datasketches.kll_sketch_float_get_cdf(bqutil.datasketches.kll_sketch_float_merge(sketch), [10.0], true) from kll_sketch;

# expected 1
select bqutil.datasketches.kll_sketch_float_get_min_value(bqutil.datasketches.kll_sketch_float_merge(sketch)) from kll_sketch;

# expected 20
select bqutil.datasketches.kll_sketch_float_get_max_value(bqutil.datasketches.kll_sketch_float_merge(sketch)) from kll_sketch;

drop table kll_sketch;

# expected about 1.3%
select bqutil.datasketches.kll_sketch_float_get_normalized_rank_error(bqutil.datasketches.kll_sketch_float_build(value), false) from unnest(generate_array(1, 10000)) as value;

select bqutil.datasketches.kll_sketch_float_get_num_retained(bqutil.datasketches.kll_sketch_float_build(value)) from unnest(generate_array(1, 10000)) as value;

# expected false
select bqutil.datasketches.kll_sketch_float_kolmogorov_smirnov(
  (select bqutil.datasketches.kll_sketch_float_build(value) from unnest([1,2,3,4,5,6,7,8,9,10]) as value),
  (select bqutil.datasketches.kll_sketch_float_build(value) from unnest([1,2,3,4,5,6,7,8,9,10]) as value),
  0.05
);

# expected true
select bqutil.datasketches.kll_sketch_float_kolmogorov_smirnov(
  (select bqutil.datasketches.kll_sketch_float_build(value) from unnest([1,2,3,4,5,6,7,8,9,10]) as value),
  (select bqutil.datasketches.kll_sketch_float_build(value) from unnest([11,12,13,14,15,16,17,18,19,20]) as value),
  0.05
);
```
