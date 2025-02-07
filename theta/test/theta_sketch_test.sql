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
create or replace temp table theta_sketch(sketch bytes);

insert into theta_sketch
(select `$BQ_DATASET`.theta_sketch_agg_int64(value) from unnest(GENERATE_ARRAY(1, 10000, 1)) as value);
insert into theta_sketch
(select `$BQ_DATASET`.theta_sketch_agg_int64(value) from unnest(GENERATE_ARRAY(100000, 110000, 1)) as value);

# expected about 20000
select `$BQ_DATASET`.theta_sketch_get_estimate_and_bounds(
  `$BQ_DATASET`.theta_sketch_agg_union(sketch),
  2
) from theta_sketch;

# expected estimate about 20000
select `$BQ_DATASET`.theta_sketch_to_string(
  `$BQ_DATASET`.theta_sketch_agg_union(sketch)
) from theta_sketch;

select `$BQ_DATASET`.theta_sketch_get_theta(
  `$BQ_DATASET`.theta_sketch_agg_union(sketch)
) from theta_sketch;

select `$BQ_DATASET`.theta_sketch_get_num_retained(
  `$BQ_DATASET`.theta_sketch_agg_union(sketch)
) from theta_sketch;

drop table theta_sketch;

# using full signatures
create or replace temp table theta_sketch(sketch bytes);

insert into theta_sketch
(select `$BQ_DATASET`.theta_sketch_agg_int64_lgk_seed_p(value, struct<int, int, float64>(14, 111, 0.9)) from unnest(GENERATE_ARRAY(1, 10000, 1)) as value);
insert into theta_sketch
(select `$BQ_DATASET`.theta_sketch_agg_int64_lgk_seed_p(value, struct<int, int, float64>(14, 111, 0.9)) from unnest(GENERATE_ARRAY(100000, 110000, 1)) as value);

# expected about 20000
select `$BQ_DATASET`.theta_sketch_get_estimate_and_bounds_seed(
  `$BQ_DATASET`.theta_sketch_agg_union_lgk_seed(sketch, struct<int, int>(10, 111)),
  2,
  111
) from theta_sketch;

# expected estimate about 20000
select `$BQ_DATASET`.theta_sketch_to_string_seed(
  `$BQ_DATASET`.theta_sketch_agg_union_lgk_seed(sketch, struct<int, int>(10, 111)),
  111
) from theta_sketch;

select `$BQ_DATASET`.theta_sketch_get_theta_seed(
  `$BQ_DATASET`.theta_sketch_agg_union_lgk_seed(sketch, struct<int, int>(10, 111)),
  111
) from theta_sketch;

select `$BQ_DATASET`.theta_sketch_get_num_retained_seed(
  `$BQ_DATASET`.theta_sketch_agg_union_lgk_seed(sketch, struct<int, int>(10, 111)),
  111
) from theta_sketch;

drop table theta_sketch;

# using defaults
# expected 5
select `$BQ_DATASET`.theta_sketch_get_estimate(
  `$BQ_DATASET`.theta_sketch_union(
    (select `$BQ_DATASET`.theta_sketch_agg_string(str) from unnest(["a", "b", "c"]) as str),
    (select `$BQ_DATASET`.theta_sketch_agg_string(str) from unnest(["c", "d", "e"]) as str)
  )
);

# full signatures
# expected 5
select `$BQ_DATASET`.theta_sketch_get_estimate_seed(
  `$BQ_DATASET`.theta_sketch_union_lgk_seed(
    (select `$BQ_DATASET`.theta_sketch_agg_string_lgk_seed_p(str, struct<int, int, float64>(10, 111, 0.999)) from unnest(["a", "b", "c"]) as str),
    (select `$BQ_DATASET`.theta_sketch_agg_string_lgk_seed_p(str, struct<int, int, float64>(10, 111, 0.999)) from unnest(["c", "d", "e"]) as str),
    10,
    111
  ),
  111
);

# using defaults
# expected 1
select `$BQ_DATASET`.theta_sketch_get_estimate(
  `$BQ_DATASET`.theta_sketch_intersection(
    (select `$BQ_DATASET`.theta_sketch_agg_string(str) from unnest(["a", "b", "c"]) as str),
    (select `$BQ_DATASET`.theta_sketch_agg_string(str) from unnest(["c", "d", "e"]) as str)
  )
);

# full signatures
# expected 1
select `$BQ_DATASET`.theta_sketch_get_estimate_seed(
  `$BQ_DATASET`.theta_sketch_intersection_seed(
    (select `$BQ_DATASET`.theta_sketch_agg_string_lgk_seed_p(str, struct<int, int, float64>(10, 111, 0.999)) from unnest(["a", "b", "c"]) as str),
    (select `$BQ_DATASET`.theta_sketch_agg_string_lgk_seed_p(str, struct<int, int, float64>(10, 111, 0.999)) from unnest(["c", "d", "e"]) as str),
    111
  ),
  111
);

# using defaults
# expected 2
select `$BQ_DATASET`.theta_sketch_get_estimate(
  `$BQ_DATASET`.theta_sketch_a_not_b(
    (select `$BQ_DATASET`.theta_sketch_agg_string(str) from unnest(["a", "b", "c"]) as str),
    (select `$BQ_DATASET`.theta_sketch_agg_string(str) from unnest(["c", "d", "e"]) as str)
  )
);

# full signatures
# expected 2
select `$BQ_DATASET`.theta_sketch_get_estimate_seed(
  `$BQ_DATASET`.theta_sketch_a_not_b_seed(
    (select `$BQ_DATASET`.theta_sketch_agg_string_lgk_seed_p(str, struct<int, int, float64>(10, 111, 0.999)) from unnest(["a", "b", "c"]) as str),
    (select `$BQ_DATASET`.theta_sketch_agg_string_lgk_seed_p(str, struct<int, int, float64>(10, 111, 0.999)) from unnest(["c", "d", "e"]) as str),
    111
  ),
  111
);

# using defaults
# expected 0.2
select `$BQ_DATASET`.theta_sketch_jaccard_similarity(
  (select `$BQ_DATASET`.theta_sketch_agg_string(str) from unnest(["a", "b", "c"]) as str),
  (select `$BQ_DATASET`.theta_sketch_agg_string(str) from unnest(["c", "d", "e"]) as str)
);

# using full signatures
# expected 0.2
select `$BQ_DATASET`.theta_sketch_jaccard_similarity_seed(
  (select `$BQ_DATASET`.theta_sketch_agg_string_lgk_seed_p(str, struct<int, int, float64>(10, 111, 0.999)) from unnest(["a", "b", "c"]) as str),
  (select `$BQ_DATASET`.theta_sketch_agg_string_lgk_seed_p(str, struct<int, int, float64>(10, 111, 0.999)) from unnest(["c", "d", "e"]) as str),
  111
);
