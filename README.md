
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

  ```bash
  git clone https://github.com/emscripten-core/emsdk.git \
  && cd emsdk \
  && ./emsdk install latest \
  && ./emsdk activate latest \
  && source ./emsdk_env.sh \
  && cd ..
  ```

  This can be installed using 'brew install emscripten' on MacOS.

- Requires a link to **datasketches-cpp** in this repository

  ```bash
  make datasketches-cpp
  ```

  This target is a part of the default target 'all'.
  This requires wget and unzip.

- Requires make utility
- Requires [Google Cloud CLI](https://cloud.google.com/sdk/docs/install)

  ```bash
  curl https://sdk.cloud.google.com | bash 
  ```

- Requires npm and @dataform/cli package

  ```bash
  npm install -g @dataform/cli
  ```

- Requires setting the following environment variables to your own values:

  ```bash
  export JS_BUCKET=    # GCS bucket to hold compiled artifacts (must include gs://)
  export BQ_PROJECT=   # location of stored SQL functions (routines)
  export BQ_DATASET=   # location of stored SQL functions (routines)
  export BQ_LOCATION=  # location of BQ_DATASET
  ```

## Building, Installing, and Testing

<details><summary><b>On Google Cloud Build</b></summary>

### Install All DataSketches

Run the following steps in this repo's root directory to install everything via
Cloud Build:

```bash
gcloud builds submit \ 
  --project=$BQ_PROJECT \
  --substitutions=_BQ_LOCATION=$BQ_LOCATION,_BQ_DATASET=$BQ_DATASET,_JS_BUCKET=$JS_BUCKET \
  .
```

</details>

<details><summary><b>On your local machine</b></summary>

### Install All DataSketches

Run the following steps in this repo's root directory to install everything:

```bash
gcloud auth application-default login # for authentication
make          # compile C++ code and produce .js, .mjs and .wasm artifacts
make install  # upload artifacts to $JS_BUCKET and create SQLX functions in $BQ_PROJECT.$BQ_DATASET
make test     # run tests in BigQuery
```

The "install" target consists of "upload" and "create", which can be used separately if desired

### Install Specific DataSketches

To install a specific sketch use targets of the form dir.target
For example, to install Theta sketch only:

```bash
gcloud auth application-default login # for authentication
make theta          # compile C++ code and produce .js, .mjs and .wasm artifacts
make theta.install  # upload artifacts to $JS_BUCKET and create SQLX functions in $BQ_PROJECT.$BQ_DATASET
```

Currently there is no way to run tests for a specific sketch only. "make example" can be used in an individual sketch directory.

</details>
