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

# expected 5
select $BQ_DATASET.cpc_sketch_get_estimate(
  $BQ_DATASET.cpc_sketch_scalar_union(
    (select $BQ_DATASET.cpc_sketch_agg_string(str, struct<int, int>(null, null)) from unnest(["a", "b", "c"]) as str),
    (select $BQ_DATASET.cpc_sketch_agg_string(str, struct<int, int>(null, null)) from unnest(["c", "d", "e"]) as str),
    null,
    null
  ),
  null
);

create or replace table $BQ_DATASET.cpc_sketch(sketch bytes);

insert into $BQ_DATASET.cpc_sketch
(select $BQ_DATASET.cpc_sketch_agg_string(cast(value as string), struct<int, int>(null, null)) from unnest(GENERATE_ARRAY(1, 10000, 1)) as value);
insert into $BQ_DATASET.cpc_sketch
(select $BQ_DATASET.cpc_sketch_agg_string(cast(value as string), struct<int, int>(null, null)) from unnest(GENERATE_ARRAY(100000, 110000, 1)) as value);

select $BQ_DATASET.cpc_sketch_to_string(sketch, null) from $BQ_DATASET.cpc_sketch;

# expected about 20000
select $BQ_DATASET.cpc_sketch_get_estimate(
  $BQ_DATASET.cpc_sketch_agg_union(sketch, struct<int, int>(null, null)),
  null
) from $BQ_DATASET.cpc_sketch;

select $BQ_DATASET.cpc_sketch_get_estimate_and_bounds(
  $BQ_DATASET.cpc_sketch_agg_union(sketch, struct<int, int>(14, null)),
  3,
  null
) from $BQ_DATASET.cpc_sketch;

drop table $BQ_DATASET.cpc_sketch;
