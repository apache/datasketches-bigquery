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

## Aggregate Functions

### [frequent_strings_sketch_merge(sketch BYTES, lg_max_map_size BYTEINT NOT AGGREGATE)](../fi/sqlx/frequent_strings_sketch_merge.sqlx)
Merges sketches from the given column.

* Param sketch: the column of values.
* Param lg\_max\_map\_size: the sketch accuracy/size parameter as an integer not less than 3.
* Returns: a serialized Frequent Strings sketch as BYTES.

### [frequent_strings_sketch_build(item STRING, weight INT64, lg_max_map_size BYTEINT NOT AGGREGATE)](../fi/sqlx/frequent_strings_sketch_build.sqlx)
Creates a sketch that represents frequencies of the given column.

* Param item: the column of STRING values.
* Param weight: the amount by which the weight of the item should be increased.
* Param lg\_max\_map\_size: the sketch accuracy/size parameter as a BYTEINT not less than 3.
* Returns: a Frequent Strings Sketch, as bytes.

## Scalar Functions

### [frequent_strings_sketch_to_string(sketch BYTES)](../fi/sqlx/frequent_strings_sketch_to_string.sqlx)
Returns a summary string that represents the state of the given sketch.

* Param sketch: the given sketch as sketch encoded bytes.
* Returns: a string that represents the state of the given sketch.

### [frequent_strings_sketch_get_result(sketch BYTES, error_type STRING, threshold INT64)](../fi/sqlx/frequent_strings_sketch_get_result.sqlx)
Returns an array of rows that include frequent items, estimates, lower and upper bounds
given an error\_type and a threshold.

* Param sketch: the given sketch as sketch encoded bytes.
* Param error\_type: determines whether no false positives or no false negatives are desired.
* Param threshold: a threshold to include items in the result list.
If NULL, the maximum error of the sketch is used as a threshold.
* Returns: an array of frequent items with frequency estimates, lower and upper bounds.

## Examples

### [test/frequent_strings_sketch_test.sql](../fi/test/frequent_strings_sketch_test.sql)
```sql

select bqutil.datasketches.frequent_strings_sketch_to_string(bqutil.datasketches.frequent_strings_sketch_build(str, 1, 5)) from unnest(["a", "b", "c"]) as str;

create or replace temp table fs_sketch(sketch bytes);

insert into fs_sketch
(select bqutil.datasketches.frequent_strings_sketch_build(str, 1, 5) from unnest(["a", "b", "c", "d"]) as str);

insert into fs_sketch
(select bqutil.datasketches.frequent_strings_sketch_build(str, 1, 5) from unnest(["a", "a", "c"]) as str);

select bqutil.datasketches.frequent_strings_sketch_get_result(bqutil.datasketches.frequent_strings_sketch_merge(sketch, 5), "NO_FALSE_NEGATIVES", null) from fs_sketch;

drop table fs_sketch;
```
