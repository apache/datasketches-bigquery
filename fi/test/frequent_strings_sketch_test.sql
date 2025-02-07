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

select `$BQ_DATASET`.frequent_strings_sketch_to_string(`$BQ_DATASET`.frequent_strings_sketch_build(str, 1, 5)) from unnest(["a", "b", "c"]) as str;

create or replace temp table fs_sketch(sketch bytes);

insert into fs_sketch
(select `$BQ_DATASET`.frequent_strings_sketch_build(str, 1, 5) from unnest(["a", "b", "c", "d"]) as str);

insert into fs_sketch
(select `$BQ_DATASET`.frequent_strings_sketch_build(str, 1, 5) from unnest(["a", "a", "c"]) as str);

select `$BQ_DATASET`.frequent_strings_sketch_get_result(`$BQ_DATASET`.frequent_strings_sketch_merge(sketch, 5), "NO_FALSE_NEGATIVES", null) from fs_sketch;

drop table fs_sketch;
