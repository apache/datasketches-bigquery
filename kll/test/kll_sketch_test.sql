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

create or replace table t.kll_sketch(sketch bytes);

insert into t.kll_sketch
(select t.kll_sketch_float_build(value, null) from unnest([1,2,3,4,5,6,7,8,9,10]) as value);
insert into t.kll_sketch
(select t.kll_sketch_float_build(value, null) from unnest([11,12,13,14,15,16,17,18,19,20]) as value);

# expected 0.5
select t.kll_sketch_float_get_rank(t.kll_sketch_float_merge(sketch, null), 10, true) from t.kll_sketch;

# expected 10
select t.kll_sketch_float_get_quantile(t.kll_sketch_float_merge(sketch, null), 0.5, true) from t.kll_sketch;

drop table t.kll_sketch;

# expected false
select t.kll_sketch_float_kolmogorov_smirnov(
  (select t.kll_sketch_float_build(value, null) from unnest([1,2,3,4,5,6,7,8,9,10]) as value),
  (select t.kll_sketch_float_build(value, null) from unnest([1,2,3,4,5,6,7,8,9,10]) as value),
  0.05
);

# expected true
select t.kll_sketch_float_kolmogorov_smirnov(
  (select t.kll_sketch_float_build(value, null) from unnest([1,2,3,4,5,6,7,8,9,10]) as value),
  (select t.kll_sketch_float_build(value, null) from unnest([11,12,13,14,15,16,17,18,19,20]) as value),
  0.05
);
