
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

# Apache DataSketches library functions for Google BigQuery

[User-Defined Aggregate Functions (UDAFs)](https://cloud.google.com/bigquery/docs/user-defined-aggregates) and
[non-aggregate (scalar) functions (UDFs)](https://cloud.google.com/bigquery/docs/user-defined-functions) for BigQuery SQL engine.

DataSketches are probabilistic data structures that can process massive
amounts of data and return very accurate results with a small memory footprint.
Because of this, DataSketches are particularly useful for "big data" use cases
such as streaming analytics and data warehousing.

Please visit the main
[Apache DataSketches website](https://datasketches.apache.org)
for more information about DataSketches library.

If you are interested in making contributions to this project please see our
[Community](https://datasketches.apache.org/docs/Community/)
page for how to contact us.

## Requirements

- Requires [Emscripten (emcc compiler)](https://emscripten.org/)
- Requires a link to **datasketches-cpp** in this repository
- Requires make utility
- Requires [Google Cloud CLI](https://cloud.google.com/sdk/docs/install)
- Requires npm and @dataform/cli package `npm install -g @dataform/cli`
- Requires setting the following environment variables to your own values:
  - JS_BUCKET: to hold compiled artifacts (must include gs://)
  - BQ_PROJECT: location of stored SQL functions (routines)
  - BQ_DATASET: location of stored SQL functions (routines)
  - BQ_LOCATION: location of BQ_DATASET

## Building, Installing, and Testing

### Install All DataSketches

Run the following steps in this repo's root directory to install everything:
```bash
gcloud auth application-default login # for authentication
make          # performs compilation
make install  # upload to $JS_BUCKET & create functions in $BQ_PROJECT.$BQ_DATASET
make test     # runs predefined tests in BQ
```
### Install Specific DataSketches

To install a specific sketch, change into an individual sketch directory and run
the following:
```bash
gcloud auth application-default login # for authentication
make          # performs compilation
make install  # upload to $JS_BUCKET 
make create   # create functions in $BQ_PROJECT.$BQ_DATASET
make test     # runs predefined tests in BQ
```