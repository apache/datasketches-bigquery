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

# Creating sample data with 1 million records split into 100 groups of nearly equal size

CREATE OR REPLACE TEMP TABLE sample_data AS
SELECT
  CONCAT("group_key_", CAST(RAND() * 100 AS INT64)) as group_key,
  RAND() AS x
FROM
  UNNEST(GENERATE_ARRAY(1, 1000000));

# Creating KLL merge sketches for a group key

CREATE OR REPLACE TEMP TABLE agg_sample_data AS
SELECT
  group_key,
  count(*) AS total_count,
  `$BQ_DATASET`.kll_sketch_float_build_k(x, 250) AS kll_sketch
FROM sample_data
GROUP BY group_key;

# Merge group based sketches into a single sketch and then get approx quantiles

WITH agg_data AS (
  SELECT
    `$BQ_DATASET`.kll_sketch_float_merge_k(kll_sketch, 250) as merged_kll_sketch,
    SUM(total_count) as total_count
  FROM agg_sample_data
)
SELECT
  `$BQ_DATASET`.kll_sketch_float_get_quantile(merged_kll_sketch, 0.0, true) AS mininum,
  `$BQ_DATASET`.kll_sketch_float_get_quantile(merged_kll_sketch, 0.5, true) AS p50,
  `$BQ_DATASET`.kll_sketch_float_get_quantile(merged_kll_sketch, 0.75, true) AS p75,
  `$BQ_DATASET`.kll_sketch_float_get_quantile(merged_kll_sketch, 0.95, true) AS p95,
  `$BQ_DATASET`.kll_sketch_float_get_quantile(merged_kll_sketch, 1.0, true) AS maximum,
  total_count
FROM agg_data;
