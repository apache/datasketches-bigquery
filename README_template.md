
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


## Building, Installing, and Testing

- Requires setting environment variables
    - JS_BUCKET: to hold compiled artifacts (must include gs://)
    - BQ_PROJECT: location of stored SQL functions (routines)
    - BQ_DATASET: location of stored SQL functions (routines)
    - BQ_LOCATION: location of BQ_DATASET 

```
gcloud auth application-default login # for authentication
make          # performs compilation
make install  # upload to $JS_BUCKET & create functions in $BQ_PROJECT.$BQ_DATASET
make test     # runs predefined tests in BQ
```

The above steps can be executed in the root directory to install everything, or can be run from an individual sketch directory to install only that particular sketch.

## BigQuery Sketch Functions

DataSketches are probabilistic data structures that can process massive
amounts of data and return very accurate results with a small memory footprint.
Because of this, DataSketches are particularly useful for "big data" use cases
such as streaming analytics and data warehousing.

This package includes BigQuery UD(A)Fs for the following Sketch types:

| Sketch Type                                       | Description |
|---------------------------------------------------|---|
| [**Frequent Items Sketch**](#fi-sketch-functions) | Estimates the frequency of items in a stream to find the most frequent ones (e.g., top-selling products, most active users). |
| [**CPC Sketch**](#cpc-sketch-functions)           | A very compact sketch for estimating the number of unique items, especially in distributed environments. |
| [**HLL Sketch**](#hll-sketch-functions)           |  Memory-efficient sketch for estimating the number of unique items, optimized for high accuracy. |
| [**KLL Sketch**](#kll-sketch-functions)           |  Estimates the distribution of values, allowing you to find quantiles (like median, percentiles) without storing all the data. |
| [**Theta Sketch**](#theta-sketch-functions)       |  Estimates unique items and supports set operations (union, intersection, difference) on those items. |
| [**Tuple Sketch**](#tuple-sketch-functions)       |  Similar to Theta Sketch but allows associating values with each unique item, enabling operations like sum, min, max on those values. |
| [**TDigest**](#tdigest-functions)               |  Another algorithm and very compact data structure for estimating quantiles and ranks of numeric values. |

## CPC Sketch Functions

**Description:** CPC sketches are a compact and efficient way to estimate the
cardinality of a dataset, especially in distributed environments. They provide
accurate estimates with low memory usage and are particularly useful for
applications like counting unique users, analyzing website traffic, or tracking
distinct events.

For more information: [CPC Sketches](https://datasketches.apache.org/docs/CPC/CpcSketches.html)

| Function Name | Function Type | Signature | Description |
|---|---|---|---|

## FI Sketch Functions

**Description:** Frequent Items (FI) sketches are used to estimate the
frequencies of items in a dataset. They are effective for identifying the most
frequent items, such as the top products purchased or the most popular search
queries.

For more information: [Frequency Sketches](https://datasketches.apache.org/docs/Frequency/FrequencySketches.html)

| Function Name | Function Type | Signature | Description |
|---|---|---|---|

## HLL Sketch Functions

**Description:** HyperLogLog (HLL) sketches are another type of cardinality
estimation sketch. They are known for their high accuracy and low memory
consumption, making them suitable for large datasets and real-time analytics.

For more information: [HLL Sketches](https://datasketches.apache.org/docs/HLL/HllSketches.html)

| Function Name | Function Type | Signature | Description |
|---|---|---|---|

## KLL Sketch Functions

**Description:** KLL sketches are quantile sketches that provide approximate
quantiles for a dataset. They are useful for understanding the distribution of
data and calculating percentiles, such as the median or 95th percentile.

For more information: [KLL Sketches](https://datasketches.apache.org/docs/KLL/KLLSketch.html)

| Function Name | Function Type | Signature | Description |
|---|---|---|---|

## Theta Sketch Functions

**Description:** Theta sketches are used for set operations like union,
intersection, and difference. They are efficient for estimating the size of
these operations on large datasets, enabling applications like analyzing user
overlap or comparing different groups.

For more information: [Theta sketches](https://datasketches.apache.org/docs/Theta/ThetaSketches.html)

| Function Name | Function Type | Signature | Description |
|---|---|---|---|

## Tuple Sketch Functions

**Description:** Tuple sketches extend the functionality of Theta sketches by
allowing you to associate a summary value with each item in the set. This
enables calculations like the sum, minimum, or maximum of values associated with
the distinct items.

For more information: [Tuple sketches](https://datasketches.apache.org/docs/Tuple/TupleSketches.html)

| Function Name | Function Type | Signature | Description |
|---|---|---|---|

## TDigest Functions

**Description:** Similar to KLL sketch, estimates distributions of numeric values,
provides approximate quantiles and ranks.

For more information: [t-digest](https://datasketches.apache.org/docs/tdigest/tdigest.html)

| Function Name | Function Type | Signature | Description |
|---|---|---|---|
