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

# using defaults
# expected 5
select `$BQ_DATASET`.cpc_sketch_get_estimate(
  `$BQ_DATASET`.cpc_sketch_union(
    (select `$BQ_DATASET`.cpc_sketch_agg_string(str) from unnest(["a", "b", "c"]) as str),
    (select `$BQ_DATASET`.cpc_sketch_agg_string(str) from unnest(["c", "d", "e"]) as str)
  )
);

# using full signatures
# expected 5
select `$BQ_DATASET`.cpc_sketch_get_estimate_seed(
  `$BQ_DATASET`.cpc_sketch_union_lgk_seed(
    (select `$BQ_DATASET`.cpc_sketch_agg_string_lgk_seed(str, struct<byteint, int64>(10, 111)) from unnest(["a", "b", "c"]) as str),
    (select `$BQ_DATASET`.cpc_sketch_agg_string_lgk_seed(str, struct<byteint, int64>(10, 111)) from unnest(["c", "d", "e"]) as str),
    10,
    111
  ),
  111
);

# using defaults
create or replace temp table cpc_sketch(sketch bytes);

insert into cpc_sketch
(select `$BQ_DATASET`.cpc_sketch_agg_int64(value) from unnest(GENERATE_ARRAY(1, 10000, 1)) as value);
insert into cpc_sketch
(select `$BQ_DATASET`.cpc_sketch_agg_int64(value) from unnest(GENERATE_ARRAY(100000, 110000, 1)) as value);

select `$BQ_DATASET`.cpc_sketch_to_string(sketch) from cpc_sketch;

# expected about 20000
select `$BQ_DATASET`.cpc_sketch_get_estimate(
  `$BQ_DATASET`.cpc_sketch_agg_union(sketch)
) from cpc_sketch;

select `$BQ_DATASET`.cpc_sketch_get_estimate_and_bounds(
  `$BQ_DATASET`.cpc_sketch_agg_union(sketch),
  3
) from cpc_sketch;

drop table cpc_sketch;

# using full signatures
create or replace temp table cpc_sketch(sketch bytes);

insert into cpc_sketch
(select `$BQ_DATASET`.cpc_sketch_agg_int64_lgk_seed(value, struct<byteint, int64>(10, 111)) from unnest(GENERATE_ARRAY(1, 10000, 1)) as value);
insert into cpc_sketch
(select `$BQ_DATASET`.cpc_sketch_agg_int64_lgk_seed(value, struct<byteint, int64>(10, 111)) from unnest(GENERATE_ARRAY(100000, 110000, 1)) as value);

select `$BQ_DATASET`.cpc_sketch_to_string_seed(sketch, 111) from cpc_sketch;

# expected about 20000
select `$BQ_DATASET`.cpc_sketch_get_estimate_seed(
  `$BQ_DATASET`.cpc_sketch_agg_union_lgk_seed(sketch, struct<byteint, int64>(10, 111)),
  111
) from cpc_sketch;

select `$BQ_DATASET`.cpc_sketch_get_estimate_and_bounds_seed(
  `$BQ_DATASET`.cpc_sketch_agg_union_lgk_seed(sketch, struct<byteint, int64>(10, 111)),
  3,
  111
) from cpc_sketch;

drop table cpc_sketch;
