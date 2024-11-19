<!--
    Licensed to the Apache Software Foundation (ASF) under one
    or more contributor license agreements.  See the NOTICE file
    distributed with this work for additional information
    regarding copyright ownership.  The ASF licenses this file
    to you under the Apache License, Version 2.0 (the
    "License"); you may not use this file except in compliance
    with the License.  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing,
    software distributed under the License is distributed on an
    "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, either express or implied.  See the License for the
    specific language governing permissions and limitations
    under the License.
-->

# Apache DataSketches Frequent Items Sketches for Google BigQuery

Frequent Items (FI) sketches are used to estimate the
frequencies of items in a dataset. They are effective for identifying the most
frequent items, such as the top products purchased or the most popular search
queries.

Please visit 
[Frequent Items Sketches](https://datasketches.apache.org/docs/Frequency/FrequencySketches.html) 
for more information about this sketch family.

Please visit the main 
[Apache DataSketches website](https://datasketches.apache.org) 
for more information about DataSketches library.

If you are interested in making contributions to this project please see our 
[Community](https://datasketches.apache.org/docs/Community/) 
page for how to contact us.

| Function Name | Function Type | Signature | Description |
|---|---|---|---|
| [frequent_strings_sketch_merge](frequent_strings_sketch_merge.sqlx) | AGGREGATE | (sketch BYTES, lg_max_map_size BYTEINT NOT AGGREGATE) -> BYTES | Merges sketches from the given column.\<br\>\<br\>Param sketch: the column of values.\<br\>Param lg\_max\_map\_size: the sketch accuracy/size parameter as an integer not less than 3.\<br\>Returns: a serialized Frequent Strings sketch as BYTES. |
| [frequent_strings_sketch_build](frequent_strings_sketch_build.sqlx) | AGGREGATE | (item STRING, weight INT64, lg_max_map_size BYTEINT NOT AGGREGATE) -> BYTES | Creates a sketch that represents frequencies of the given column.\<br\>\<br\>Param item: the column of STRING values.\<br\>Param weight: the amount by which the weight of the item should be increased.\<br\>Param lg\_max\_map\_size: the sketch accuracy/size parameter as a BYTEINT not less than 3.\<br\>Returns: a Frequent Strings Sketch, as bytes. |
| [frequent_strings_sketch_to_string](frequent_strings_sketch_to_string.sqlx) | SCALAR | (sketch BYTES) -> STRING | Returns a summary string that represents the state of the given sketch.\<br\>\<br\>Param sketch: the given sketch as sketch encoded bytes.\<br\>Returns: a string that represents the state of the given sketch. |
| [frequent_strings_sketch_get_result](frequent_strings_sketch_get_result.sqlx) | SCALAR | (sketch BYTES, error_type STRING, threshold INT64) -> ARRAY<STRUCT<item STRING, estimate INT64, lower_bound INT64, upper_bound INT64>> | Returns an array of rows that include frequent items, estimates, lower and upper bounds\<br\>given an error\_type and a threshold.\<br\>\<br\>Param sketch: the given sketch as sketch encoded bytes.\<br\>Param error\_type: determines whether no false positives or no false negatives are desired.\<br\>Param threshold: a threshold to include items in the result list.\<br\>If NULL, the maximum error of the sketch is used as a threshold.\<br\>Returns: an array of frequent items with frequency estimates, lower and upper bounds. |

**Examples:**

```sql

select `$BQ_DATASET`.frequent_strings_sketch_to_string(`$BQ_DATASET`.frequent_strings_sketch_build(str, 1, 5)) from unnest(["a", "b", "c"]) as str;

create or replace table `$BQ_DATASET`.fs_sketch(sketch bytes);

insert into `$BQ_DATASET`.fs_sketch
(select `$BQ_DATASET`.frequent_strings_sketch_build(str, 1, 5) from unnest(["a", "b", "c", "d"]) as str);

insert into `$BQ_DATASET`.fs_sketch
(select `$BQ_DATASET`.frequent_strings_sketch_build(str, 1, 5) from unnest(["a", "a", "c"]) as str);

select `$BQ_DATASET`.frequent_strings_sketch_get_result(`$BQ_DATASET`.frequent_strings_sketch_merge(sketch, 5), "NO_FALSE_NEGATIVES", null) from `$BQ_DATASET`.fs_sketch;

drop table `$BQ_DATASET`.fs_sketch;
```
