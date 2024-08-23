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

select t.hll_sketch_get_estimate(t.hll_sketch_agg_string(s, struct<int, string>(null, null))) from unnest(["a", "b", "c"]) as s;

select t.hll_sketch_get_estimate(
  t.hll_sketch_scalar_union(
    (select t.hll_sketch_agg_string(str, struct<int, string>(10, "HLL_8")) from unnest(["a", "b", "c"]) as str),
    (select t.hll_sketch_agg_string(str, struct<int, string>(10, "HLL_8")) from unnest(["c", "d", "e"]) as str),
    10,
    "HLL_8"
  )
);

create or replace table t.hll_sketch(sketch bytes);

insert into t.hll_sketch
(select t.hll_sketch_agg_string(cast(value as string), struct<int, string>(null, null)) from unnest(GENERATE_ARRAY(1, 10000, 1)) as value);
insert into t.hll_sketch
(select t.hll_sketch_agg_string(cast(value as string), struct<int, string>(null, null)) from unnest(GENERATE_ARRAY(100000, 110000, 1)) as value);

select t.hll_sketch_to_string(
  t.hll_sketch_agg_union(sketch, struct<int, string>(null, null))
) from t.hll_sketch;

drop table t.hll_sketch;
