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

# expected 3
select `$BQ_DATASET`.hll_sketch_get_estimate(`$BQ_DATASET`.hll_sketch_agg_string(s)) from unnest(["a", "b", "c"]) as s;

select `$BQ_DATASET`.hll_sketch_to_string(`$BQ_DATASET`.hll_sketch_agg_string(s)) from unnest(["a", "b", "c"]) as s;

# expected 5
select `$BQ_DATASET`.hll_sketch_get_estimate_and_bounds(
  `$BQ_DATASET`.hll_sketch_union_lgk_type(
    (select `$BQ_DATASET`.hll_sketch_agg_string_lgk_type(str, struct<byteint, string>(10, "HLL_8")) from unnest(["a", "b", "c"]) as str),
    (select `$BQ_DATASET`.hll_sketch_agg_string_lgk_type(str, struct<byteint, string>(10, "HLL_8")) from unnest(["c", "d", "e"]) as str),
    10,
    "HLL_8"
  ),
  2
);

select `$BQ_DATASET`.hll_sketch_to_string(
  `$BQ_DATASET`.hll_sketch_union_lgk_type(
    (select `$BQ_DATASET`.hll_sketch_agg_string_lgk_type(str, struct<byteint, string>(10, "HLL_8")) from unnest(["a", "b", "c"]) as str),
    (select `$BQ_DATASET`.hll_sketch_agg_string_lgk_type(str, struct<byteint, string>(10, "HLL_8")) from unnest(["c", "d", "e"]) as str),
    10,
    "HLL_8"
  )
);

create or replace temp table hll_sketch(sketch bytes);

insert into hll_sketch
(select `$BQ_DATASET`.hll_sketch_agg_int64(value) from unnest(GENERATE_ARRAY(1, 10000, 1)) as value);
insert into hll_sketch
(select `$BQ_DATASET`.hll_sketch_agg_int64(value) from unnest(GENERATE_ARRAY(100000, 110000, 1)) as value);

# expected estimate about 20000
select `$BQ_DATASET`.hll_sketch_to_string(
  `$BQ_DATASET`.hll_sketch_agg_union(sketch)
) from hll_sketch;

select `$BQ_DATASET`.hll_sketch_to_string(
  `$BQ_DATASET`.hll_sketch_agg_union_lgk_type(sketch, struct<byteint, string>(10, "HLL_6"))
) from hll_sketch;

drop table hll_sketch;

create or replace temp table hll_sketch(sketch bytes);

insert into hll_sketch
(select `$BQ_DATASET`.hll_sketch_agg_int64_lgk_type(value, struct<int, string>(8, "HLL_6")) from unnest(GENERATE_ARRAY(1, 10000, 1)) as value);
insert into hll_sketch
(select `$BQ_DATASET`.hll_sketch_agg_int64_lgk_type(value, struct<int, string>(8, "HLL_6")) from unnest(GENERATE_ARRAY(100000, 110000, 1)) as value);

# expected estimate about 20000
select `$BQ_DATASET`.hll_sketch_to_string(
  `$BQ_DATASET`.hll_sketch_agg_union_lgk_type(sketch, struct<byteint, string>(8, "HLL_6"))
) from hll_sketch;

drop table hll_sketch;
