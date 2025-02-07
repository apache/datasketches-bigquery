/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

create or replace temp table kll_sketch(sketch bytes);

# using default
insert into kll_sketch
(select `$BQ_DATASET`.kll_sketch_float_build(value) from unnest([1,2,3,4,5,6,7,8,9,10]) as value);

# using full signature
insert into kll_sketch
(select `$BQ_DATASET`.kll_sketch_float_build_k(value, 100) from unnest([11,12,13,14,15,16,17,18,19,20]) as value);

select `$BQ_DATASET`.kll_sketch_float_to_string(sketch) from kll_sketch;

# using default
select `$BQ_DATASET`.kll_sketch_float_to_string(`$BQ_DATASET`.kll_sketch_float_merge(sketch)) from kll_sketch;

# using full signature
select `$BQ_DATASET`.kll_sketch_float_to_string(`$BQ_DATASET`.kll_sketch_float_merge_k(sketch, 100)) from kll_sketch;

# expected 0.5
select `$BQ_DATASET`.kll_sketch_float_get_rank(`$BQ_DATASET`.kll_sketch_float_merge(sketch), 10, true) from kll_sketch;

# expected 10
select `$BQ_DATASET`.kll_sketch_float_get_quantile(`$BQ_DATASET`.kll_sketch_float_merge(sketch), 0.5, true) from kll_sketch;

# expected 20
select `$BQ_DATASET`.kll_sketch_float_get_n(`$BQ_DATASET`.kll_sketch_float_merge(sketch)) from kll_sketch;

# expected 0.5, 0.5
select `$BQ_DATASET`.kll_sketch_float_get_pmf(`$BQ_DATASET`.kll_sketch_float_merge(sketch), [10.0], true) from kll_sketch;

# expected 0.5, 1
select `$BQ_DATASET`.kll_sketch_float_get_cdf(`$BQ_DATASET`.kll_sketch_float_merge(sketch), [10.0], true) from kll_sketch;

# expected 1
select `$BQ_DATASET`.kll_sketch_float_get_min_value(`$BQ_DATASET`.kll_sketch_float_merge(sketch)) from kll_sketch;

# expected 20
select `$BQ_DATASET`.kll_sketch_float_get_max_value(`$BQ_DATASET`.kll_sketch_float_merge(sketch)) from kll_sketch;

drop table kll_sketch;

# expected about 1.3%
select `$BQ_DATASET`.kll_sketch_float_get_normalized_rank_error(`$BQ_DATASET`.kll_sketch_float_build(value), false) from unnest(generate_array(1, 10000)) as value;

select `$BQ_DATASET`.kll_sketch_float_get_num_retained(`$BQ_DATASET`.kll_sketch_float_build(value)) from unnest(generate_array(1, 10000)) as value;

# expected false
select `$BQ_DATASET`.kll_sketch_float_kolmogorov_smirnov(
  (select `$BQ_DATASET`.kll_sketch_float_build(value) from unnest([1,2,3,4,5,6,7,8,9,10]) as value),
  (select `$BQ_DATASET`.kll_sketch_float_build(value) from unnest([1,2,3,4,5,6,7,8,9,10]) as value),
  0.05
);

# expected true
select `$BQ_DATASET`.kll_sketch_float_kolmogorov_smirnov(
  (select `$BQ_DATASET`.kll_sketch_float_build(value) from unnest([1,2,3,4,5,6,7,8,9,10]) as value),
  (select `$BQ_DATASET`.kll_sketch_float_build(value) from unnest([11,12,13,14,15,16,17,18,19,20]) as value),
  0.05
);
