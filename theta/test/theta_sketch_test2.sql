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

/*
create or replace table `$BQ_DATASET`.theta_sketches as
select
  hour,
  `$BQ_DATASET`.theta_sketch_agg_int64(cast(rand() * 100000 as int64)) as sketch1,
  `$BQ_DATASET`.theta_sketch_agg_int64(cast(rand() * 100000 as int64)) as sketch2,
  `$BQ_DATASET`.theta_sketch_agg_int64(cast(rand() * 100000 as int64)) as sketch3,
  `$BQ_DATASET`.theta_sketch_agg_int64(cast(rand() * 100000 as int64)) as sketch4,
  `$BQ_DATASET`.theta_sketch_agg_int64(cast(rand() * 100000 as int64)) as sketch5,
  `$BQ_DATASET`.theta_sketch_agg_int64(cast(rand() * 100000 as int64)) as sketch6,
  `$BQ_DATASET`.theta_sketch_agg_int64(cast(rand() * 100000 as int64)) as sketch7,
  `$BQ_DATASET`.theta_sketch_agg_int64(cast(rand() * 100000 as int64)) as sketch8
#  `$BQ_DATASET`.theta_sketch_agg_int64(cast(rand() * 100000 as int64)) as sketch9,
#  `$BQ_DATASET`.theta_sketch_agg_int64(cast(rand() * 100000 as int64)) as sketch10
from unnest(generate_array(1,10)) as hour, unnest(generate_array(1,500000))
group by hour;
*/

create or replace table `$BQ_DATASET`.theta_sketches as
select
  hour,
  `$BQ_DATASET`.theta_sketch_agg_int64_nop(cast(rand() * 100000 as int64), struct<byteint, int64, float64>(null, null, null)) as sketch1,
  `$BQ_DATASET`.theta_sketch_agg_int64_nop(cast(rand() * 100000 as int64), struct<byteint, int64, float64>(null, null, null)) as sketch2,
  `$BQ_DATASET`.theta_sketch_agg_int64_nop(cast(rand() * 100000 as int64), struct<byteint, int64, float64>(null, null, null)) as sketch3,
  `$BQ_DATASET`.theta_sketch_agg_int64_nop(cast(rand() * 100000 as int64), struct<byteint, int64, float64>(null, null, null)) as sketch4,
  `$BQ_DATASET`.theta_sketch_agg_int64_nop(cast(rand() * 100000 as int64), struct<byteint, int64, float64>(null, null, null)) as sketch5,
  `$BQ_DATASET`.theta_sketch_agg_int64_nop(cast(rand() * 100000 as int64), struct<byteint, int64, float64>(null, null, null)) as sketch6,
  `$BQ_DATASET`.theta_sketch_agg_int64_nop(cast(rand() * 100000 as int64), struct<byteint, int64, float64>(null, null, null)) as sketch7,
  `$BQ_DATASET`.theta_sketch_agg_int64_nop(cast(rand() * 100000 as int64), struct<byteint, int64, float64>(null, null, null)) as sketch8
#  `$BQ_DATASET`.theta_sketch_agg_int64_nop(cast(rand() * 100000 as int64), struct<byteint, int64, float64>(null, null, null)) as sketch9,
#  `$BQ_DATASET`.theta_sketch_agg_int64_nop(cast(rand() * 100000 as int64), struct<byteint, int64, float64>(null, null, null)) as sketch10
from unnest(generate_array(1,10)) as hour, unnest(generate_array(1,500000))
group by hour;

#select hour, `$BQ_DATASET`.theta_sketch_get_estimate(sketch) from `$BQ_DATASET`.theta_sketches order by hour;
/*
select
  `$BQ_DATASET`.theta_sketch_get_estimate(`$BQ_DATASET`.theta_sketch_agg_union(sketch1)),
  `$BQ_DATASET`.theta_sketch_get_estimate(`$BQ_DATASET`.theta_sketch_agg_union(sketch2)),
  `$BQ_DATASET`.theta_sketch_get_estimate(`$BQ_DATASET`.theta_sketch_agg_union(sketch3)),
  `$BQ_DATASET`.theta_sketch_get_estimate(`$BQ_DATASET`.theta_sketch_agg_union(sketch4)),
  `$BQ_DATASET`.theta_sketch_get_estimate(`$BQ_DATASET`.theta_sketch_agg_union(sketch5)),
  `$BQ_DATASET`.theta_sketch_get_estimate(`$BQ_DATASET`.theta_sketch_agg_union(sketch6))
from `$BQ_DATASET`.theta_sketches;
*/
