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

create or replace table $BQ_DATASET.theta_sketch(sketch bytes);

insert into $BQ_DATASET.theta_sketch
(select $BQ_DATASET.theta_sketch_agg_string(cast(value as string), struct<int, int, float64>(14, null, 0.8)) from unnest(GENERATE_ARRAY(1, 10000, 1)) as value);
insert into $BQ_DATASET.theta_sketch
(select $BQ_DATASET.theta_sketch_agg_string(cast(value as string), struct<int, int, float64>(14, null, 0.8)) from unnest(GENERATE_ARRAY(100000, 110000, 1)) as value);

# expected about 20000
select $BQ_DATASET.theta_sketch_get_estimate_and_bounds(
  $BQ_DATASET.theta_sketch_agg_union(sketch, struct<int, int>(10, null)),
  2,
  null
) from $BQ_DATASET.theta_sketch;

# expected estimate about 20000
select $BQ_DATASET.theta_sketch_to_string(
  $BQ_DATASET.theta_sketch_agg_union(sketch, struct<int, int>(null, null)),
  null
) from $BQ_DATASET.theta_sketch;

drop table $BQ_DATASET.theta_sketch;

# expected 5
select $BQ_DATASET.theta_sketch_get_estimate(
  $BQ_DATASET.theta_sketch_scalar_union(
    (select $BQ_DATASET.theta_sketch_agg_string(str, struct<int, int, float64>(null, null, null)) from unnest(["a", "b", "c"]) as str),
    (select $BQ_DATASET.theta_sketch_agg_string(str, STRUCT<int, int, float64>(null, null, null)) from unnest(["c", "d", "e"]) as str),
    null,
    null
  ),
  null
);

# expected 1
select $BQ_DATASET.theta_sketch_get_estimate(
  $BQ_DATASET.theta_sketch_scalar_intersection(
    (select $BQ_DATASET.theta_sketch_agg_string(str, struct<int, int, float64>(null, null, null)) from unnest(["a", "b", "c"]) as str),
    (select $BQ_DATASET.theta_sketch_agg_string(str, STRUCT<int, int, float64>(null, null, null)) from unnest(["c", "d", "e"]) as str),
    null
  ),
  null
);

# expected 2
select $BQ_DATASET.theta_sketch_get_estimate(
  $BQ_DATASET.theta_sketch_a_not_b(
    (select $BQ_DATASET.theta_sketch_agg_string(str, struct<int, int, float64>(null, null, null)) from unnest(["a", "b", "c"]) as str),
    (select $BQ_DATASET.theta_sketch_agg_string(str, STRUCT<int, int, float64>(null, null, null)) from unnest(["c", "d", "e"]) as str),
    null
  ),
  null
);

# expected 0.2
select $BQ_DATASET.theta_sketch_jaccard_similarity(
  (select $BQ_DATASET.theta_sketch_agg_string(str, struct<int, int, float64>(null, null, null)) from unnest(["a", "b", "c"]) as str),
  (select $BQ_DATASET.theta_sketch_agg_string(str, STRUCT<int, int, float64>(null, null, null)) from unnest(["c", "d", "e"]) as str),
  null
);
