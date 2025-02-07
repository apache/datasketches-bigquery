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
create or replace temp table tuple_sketch(sketch bytes);

insert into tuple_sketch
(select `$BQ_DATASET`.tuple_sketch_int64_from_theta_sketch(`$BQ_DATASET`.theta_sketch_agg_string(cast(value as string)), 1) from unnest(GENERATE_ARRAY(1, 10000, 1)) as value);
insert into tuple_sketch
(select `$BQ_DATASET`.tuple_sketch_int64_from_theta_sketch(`$BQ_DATASET`.theta_sketch_agg_string(cast(value as string)), 1) from unnest(GENERATE_ARRAY(100000, 110000, 1)) as value);

# expected about 20000
select `$BQ_DATASET`.tuple_sketch_int64_get_estimate(
  `$BQ_DATASET`.tuple_sketch_int64_agg_union(sketch)
) from tuple_sketch;

select `$BQ_DATASET`.tuple_sketch_int64_get_estimate_and_bounds(
  `$BQ_DATASET`.tuple_sketch_int64_agg_union(sketch),
  2
) from tuple_sketch;

select `$BQ_DATASET`.tuple_sketch_int64_get_sum_estimate_and_bounds(
  `$BQ_DATASET`.tuple_sketch_int64_agg_union(sketch),
  2
) from tuple_sketch;

# expected estimate about 20000
select `$BQ_DATASET`.tuple_sketch_int64_to_string(
  `$BQ_DATASET`.tuple_sketch_int64_agg_union(sketch)
) from tuple_sketch;

select `$BQ_DATASET`.tuple_sketch_int64_get_theta(
  `$BQ_DATASET`.tuple_sketch_int64_agg_union(sketch)
) from tuple_sketch;

select `$BQ_DATASET`.tuple_sketch_int64_get_num_retained(
  `$BQ_DATASET`.tuple_sketch_int64_agg_union(sketch)
) from tuple_sketch;

drop table tuple_sketch;

# using full signatures
create or replace temp table tuple_sketch(sketch bytes);

insert into tuple_sketch
(select `$BQ_DATASET`.tuple_sketch_int64_from_theta_sketch_seed(
  `$BQ_DATASET`.theta_sketch_agg_string_lgk_seed_p(cast(value as string), STRUCT<BYTEINT, INT64, FLOAT64>(10, 111, 0.999)),
  1,
  111
) from unnest(GENERATE_ARRAY(1, 10000, 1)) as value);
insert into tuple_sketch
(select `$BQ_DATASET`.tuple_sketch_int64_from_theta_sketch_seed(
  `$BQ_DATASET`.theta_sketch_agg_string_lgk_seed_p(cast(value as string), STRUCT<BYTEINT, INT64, FLOAT64>(10, 111, 0.999)),
  1,
  111
) from unnest(GENERATE_ARRAY(100000, 110000, 1)) as value);

# expected about 20000
select `$BQ_DATASET`.tuple_sketch_int64_get_estimate_seed(
  `$BQ_DATASET`.tuple_sketch_int64_agg_union_lgk_seed_mode(sketch, STRUCT<BYTEINT, INT64, STRING>(10, 111, "NOP")),
  111
) from tuple_sketch;

select `$BQ_DATASET`.tuple_sketch_int64_get_estimate_and_bounds_seed(
  `$BQ_DATASET`.tuple_sketch_int64_agg_union_lgk_seed_mode(sketch, STRUCT<BYTEINT, INT64, STRING>(10, 111, "NOP")),
  2,
  111
) from tuple_sketch;

select `$BQ_DATASET`.tuple_sketch_int64_get_sum_estimate_and_bounds_seed(
  `$BQ_DATASET`.tuple_sketch_int64_agg_union_lgk_seed_mode(sketch, STRUCT<BYTEINT, INT64, STRING>(10, 111, "NOP")),
  2,
  111
) from tuple_sketch;

# expected estimate about 20000
select `$BQ_DATASET`.tuple_sketch_int64_to_string_seed(
  `$BQ_DATASET`.tuple_sketch_int64_agg_union_lgk_seed_mode(sketch, STRUCT<BYTEINT, INT64, STRING>(10, 111, "NOP")),
  111
) from tuple_sketch;

select `$BQ_DATASET`.tuple_sketch_int64_get_theta_seed(
  `$BQ_DATASET`.tuple_sketch_int64_agg_union_lgk_seed_mode(sketch, STRUCT<BYTEINT, INT64, STRING>(10, 111, "NOP")),
  111
) from tuple_sketch;

select `$BQ_DATASET`.tuple_sketch_int64_get_num_retained_seed(
  `$BQ_DATASET`.tuple_sketch_int64_agg_union_lgk_seed_mode(sketch, STRUCT<BYTEINT, INT64, STRING>(10, 111, "NOP")),
  111
) from tuple_sketch;

drop table tuple_sketch;

# using defaults
# expected 5
select `$BQ_DATASET`.tuple_sketch_int64_get_estimate(
  `$BQ_DATASET`.tuple_sketch_int64_union(
    (select `$BQ_DATASET`.tuple_sketch_int64_agg_int64(key, 1) from unnest([1, 2, 3]) as key),
    (select `$BQ_DATASET`.tuple_sketch_int64_agg_int64(key, 1) from unnest([3, 4, 5]) as key)
  )
);

# using full signatures
# expected 5
select `$BQ_DATASET`.tuple_sketch_int64_get_estimate_seed(
  `$BQ_DATASET`.tuple_sketch_int64_union_lgk_seed_mode(
    (select `$BQ_DATASET`.tuple_sketch_int64_agg_int64_lgk_seed_p_mode(key, 1, STRUCT<BYTEINT, INT64, FLOAT64, STRING>(10, 111, 0.999, "MIN")) from unnest([1, 2, 3]) as key),
    (select `$BQ_DATASET`.tuple_sketch_int64_agg_int64_lgk_seed_p_mode(key, 1, STRUCT<BYTEINT, INT64, FLOAT64, STRING>(10, 111, 0.999, "MIN")) from unnest([3, 4, 5]) as key),
    10,
    111,
    "MIN"
  ),
  111
);

# using defaults
# expected 1
select `$BQ_DATASET`.tuple_sketch_int64_get_estimate(
  `$BQ_DATASET`.tuple_sketch_int64_intersection(
    (select `$BQ_DATASET`.tuple_sketch_int64_agg_string(str, 1) from unnest(["a", "b", "c"]) as str),
    (select `$BQ_DATASET`.tuple_sketch_int64_agg_string(str, 1) from unnest(["c", "d", "e"]) as str)
  )
);

# using full signatures
# expected 1
select `$BQ_DATASET`.tuple_sketch_int64_get_estimate_seed(
  `$BQ_DATASET`.tuple_sketch_int64_intersection_seed_mode(
    (select `$BQ_DATASET`.tuple_sketch_int64_agg_string_lgk_seed_p_mode(str, 1, STRUCT<BYTEINT, INT64, FLOAT64, STRING>(10, 111, 0.999, "MIN")) from unnest(["a", "b", "c"]) as str),
    (select `$BQ_DATASET`.tuple_sketch_int64_agg_string_lgk_seed_p_mode(str, 1, STRUCT<BYTEINT, INT64, FLOAT64, STRING>(10, 111, 0.999, "MIN")) from unnest(["c", "d", "e"]) as str),
    111,
    "MIN"
  ),
  111
);

# using defaults
# expected 2
select `$BQ_DATASET`.tuple_sketch_int64_get_estimate(
  `$BQ_DATASET`.tuple_sketch_int64_a_not_b(
    (select `$BQ_DATASET`.tuple_sketch_int64_agg_string(str, 1) from unnest(["a", "b", "c"]) as str),
    (select `$BQ_DATASET`.tuple_sketch_int64_agg_string(str, 1) from unnest(["c", "d", "e"]) as str)
  )
);

# using full signatures
# expected 2
select `$BQ_DATASET`.tuple_sketch_int64_get_estimate_seed(
  `$BQ_DATASET`.tuple_sketch_int64_a_not_b_seed(
    (select `$BQ_DATASET`.tuple_sketch_int64_agg_string_lgk_seed_p_mode(str, 1, STRUCT<BYTEINT, INT64, FLOAT64, STRING>(10, 111, 0.999, "MIN")) from unnest(["a", "b", "c"]) as str),
    (select `$BQ_DATASET`.tuple_sketch_int64_agg_string_lgk_seed_p_mode(str, 1, STRUCT<BYTEINT, INT64, FLOAT64, STRING>(10, 111, 0.999, "MIN")) from unnest(["c", "d", "e"]) as str),
    111
  ),
  111
);

# using defaults
# expected 0.2
select `$BQ_DATASET`.tuple_sketch_int64_jaccard_similarity(
  (select `$BQ_DATASET`.tuple_sketch_int64_agg_string(str, 1) from unnest(["a", "b", "c"]) as str),
  (select `$BQ_DATASET`.tuple_sketch_int64_agg_string(str, 1) from unnest(["c", "d", "e"]) as str)
);

# using full signatures
# expected 0.2
select `$BQ_DATASET`.tuple_sketch_int64_jaccard_similarity_seed(
  (select `$BQ_DATASET`.tuple_sketch_int64_agg_string_lgk_seed_p_mode(str, 1, STRUCT<BYTEINT, INT64, FLOAT64, STRING>(10, 111, 0.999, "NOP")) from unnest(["a", "b", "c"]) as str),
  (select `$BQ_DATASET`.tuple_sketch_int64_agg_string_lgk_seed_p_mode(str, 1, STRUCT<BYTEINT, INT64, FLOAT64, STRING>(10, 111, 0.999, "NOP")) from unnest(["c", "d", "e"]) as str),
  111
);

# using defaults
# expected 1 entry
select `$BQ_DATASET`.tuple_sketch_int64_to_string(
  `$BQ_DATASET`.tuple_sketch_int64_filter_low_high(
    `$BQ_DATASET`.tuple_sketch_int64_agg_string(key, 1),
    2,
    2
  )
) from unnest(["a", "b", "c", "c"]) as key;

# using full signatures
# expected 1 entry
select `$BQ_DATASET`.tuple_sketch_int64_to_string_seed(
  `$BQ_DATASET`.tuple_sketch_int64_filter_low_high_seed(
    `$BQ_DATASET`.tuple_sketch_int64_agg_string_lgk_seed_p_mode(key, 1, STRUCT<BYTEINT, INT64, FLOAT64, STRING>(10, 111, 0.999, "SUM")),
    2,
    2,
    111
  ),
  111
) from unnest(["a", "b", "c", "c"]) as key;
