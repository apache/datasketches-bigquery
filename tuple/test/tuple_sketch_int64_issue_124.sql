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

# issue #124
select `$BQ_DATASET`.tuple_sketch_int64_to_string(`$BQ_DATASET`.tuple_sketch_int64_agg_int64(key, 1)) from UNNEST(GENERATE_ARRAY(1, 1000000)) as key;
#select `$BQ_DATASET`.tuple_sketch_int64_agg_int64(key, 1) from UNNEST(GENERATE_ARRAY(1, 1000000)) as key;
