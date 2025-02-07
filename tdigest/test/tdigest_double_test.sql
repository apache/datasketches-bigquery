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

create or replace temp table tdigest_double(sketch bytes);

# using default
insert into tdigest_double
(select `$BQ_DATASET`.tdigest_double_build(value) from unnest([1,2,3,4,5,6,7,8,9,10]) as value);

# using full signature
insert into tdigest_double
(select `$BQ_DATASET`.tdigest_double_build_k(value, 100) from unnest([11,12,13,14,15,16,17,18,19,20]) as value);

select `$BQ_DATASET`.tdigest_double_to_string(sketch) from tdigest_double;

# using default
select `$BQ_DATASET`.tdigest_double_to_string(`$BQ_DATASET`.tdigest_double_merge(sketch)) from tdigest_double;

# using full signature
select `$BQ_DATASET`.tdigest_double_to_string(`$BQ_DATASET`.tdigest_double_merge_k(sketch, 100)) from tdigest_double;

# expected 0.5
select `$BQ_DATASET`.tdigest_double_get_rank(`$BQ_DATASET`.tdigest_double_merge(sketch), 10) from tdigest_double;

# expected 10
select `$BQ_DATASET`.tdigest_double_get_quantile(`$BQ_DATASET`.tdigest_double_merge(sketch), 0.5) from tdigest_double;

# expected 20
select `$BQ_DATASET`.tdigest_double_get_total_weight(`$BQ_DATASET`.tdigest_double_merge(sketch)) from tdigest_double;

# expected 1
select `$BQ_DATASET`.tdigest_double_get_min_value(`$BQ_DATASET`.tdigest_double_merge(sketch)) from tdigest_double;

# expected 20
select `$BQ_DATASET`.tdigest_double_get_max_value(`$BQ_DATASET`.tdigest_double_merge(sketch)) from tdigest_double;

drop table tdigest_double;
