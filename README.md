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

# Apache DataSketches functions for Google Cloud BigQuery 

[User-Defined Aggregate Functions (UDAFs)](https://cloud.google.com/bigquery/docs/user-defined-aggregates) and
[non-aggregate (scalar) functions (UDFs)](https://cloud.google.com/bigquery/docs/user-defined-functions) for BigQuery SQL engine.

Please visit the main [Apache DataSketches website](https://datasketches.apache.org) for more information about DataSketches library.

If you are interested in making contributions to this project please see our [Community](https://datasketches.apache.org/docs/Community/) page for how to contact us.

## Example

select test.theta_sketch_get_estimate(test.theta_sketch_scalar_union(
  (select test.theta_sketch_agg_string(value, null) from unnest(["1", "2", "3"]) as value),
  (select test.theta_sketch_agg_string(value, null) from unnest(["3", "4", "5"]) as value),
  14, null
), null);

result: 5
