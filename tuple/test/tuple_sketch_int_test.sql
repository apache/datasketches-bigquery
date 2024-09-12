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

create or replace table $BQ_DATASET.tuple_sketch(sketch bytes);

insert into $BQ_DATASET.tuple_sketch
(select $BQ_DATASET.tuple_sketch_int64_from_theta_sketch_seed($BQ_DATASET.theta_sketch_agg_string(cast(value as string)), 1, null) from unnest(GENERATE_ARRAY(1, 10000, 1)) as value);
insert into $BQ_DATASET.tuple_sketch
(select $BQ_DATASET.tuple_sketch_int64_from_theta_sketch_seed($BQ_DATASET.theta_sketch_agg_string(cast(value as string)), 1, null) from unnest(GENERATE_ARRAY(100000, 110000, 1)) as value);


# expected about 20000
select $BQ_DATASET.tuple_sketch_int64_get_estimate(
  $BQ_DATASET.tuple_sketch_int64_agg_union(sketch)
) from $BQ_DATASET.tuple_sketch;

# expected estimate about 20000
select $BQ_DATASET.tuple_sketch_int64_to_string(
  $BQ_DATASET.tuple_sketch_int64_agg_union(sketch)
) from $BQ_DATASET.tuple_sketch;

drop table $BQ_DATASET.tuple_sketch;

# expected 5
select $BQ_DATASET.tuple_sketch_int64_get_estimate_seed(
  $BQ_DATASET.tuple_sketch_int64_union_lgk_seed_mode(
    (select $BQ_DATASET.tuple_sketch_int64_agg_string(str, 1) from unnest(["a", "b", "c"]) as str),
    (select $BQ_DATASET.tuple_sketch_int64_agg_string(str, 1) from unnest(["c", "d", "e"]) as str),
    10,
    null,
    "MIN"
  ),
  null
);

# expected 5
select $BQ_DATASET.tuple_sketch_int64_get_estimate_seed(
  $BQ_DATASET.tuple_sketch_int64_union(
    (select $BQ_DATASET.tuple_sketch_int64_agg_string(str, 1) from unnest(["a", "b", "c"]) as str),
    (select $BQ_DATASET.tuple_sketch_int64_agg_string(str, 1) from unnest(["c", "d", "e"]) as str)
  ),
  null
);

# expected 1
select $BQ_DATASET.tuple_sketch_int64_get_estimate(
  $BQ_DATASET.tuple_sketch_int64_intersection(
    (select $BQ_DATASET.tuple_sketch_int64_agg_string(str, 1) from unnest(["a", "b", "c"]) as str),
    (select $BQ_DATASET.tuple_sketch_int64_agg_string(str, 1) from unnest(["c", "d", "e"]) as str)
  )
);

# full signatures
# expected 1
select $BQ_DATASET.tuple_sketch_int64_get_estimate_seed(
  $BQ_DATASET.tuple_sketch_int64_intersection_seed_mode(
    (select $BQ_DATASET.tuple_sketch_int64_agg_string_lgk_seed_p_mode(str, 1, STRUCT<BYTEINT, INT64, FLOAT64, STRING>(10, 111, 0.999, "MIN")) from unnest(["a", "b", "c"]) as str),
    (select $BQ_DATASET.tuple_sketch_int64_agg_string_lgk_seed_p_mode(str, 1, STRUCT<BYTEINT, INT64, FLOAT64, STRING>(10, 111, 0.999, "MIN")) from unnest(["c", "d", "e"]) as str),
    111,
    "MIN"
  ),
  111
);

# expected 2
select $BQ_DATASET.tuple_sketch_int64_get_estimate_seed(
  $BQ_DATASET.tuple_sketch_int64_a_not_b_seed(
    (select $BQ_DATASET.tuple_sketch_int64_agg_string(str, 1) from unnest(["a", "b", "c"]) as str),
    (select $BQ_DATASET.tuple_sketch_int64_agg_string(str, 1) from unnest(["c", "d", "e"]) as str),
    null
  ),
  null
);

/*
# expected 0.2
select $BQ_DATASET.tuple_sketch_jaccard_similarity(
  (select $BQ_DATASET.tuple_sketch_agg_string(str) from unnest(["a", "b", "c"]) as str),
  (select $BQ_DATASET.tuple_sketch_agg_string(str) from unnest(["c", "d", "e"]) as str),
  null
);
*/
