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

# Apache DataSketches Tuple Sketches for Google BigQuery

Tuple sketches extend the functionality of Theta sketches by adding a Summary object associated
with each distinct key retained by the sketch. When the identifier of an input pair (identifier, value) matches a unique
key of the sketch, the associated Summary of that key can be modified based on user-defined policy.

The set of all Summary values collected by the sketch represents a uniform random sample of the unique identifiers
as opposed to a uniform random sample of all raw inputs.
This enables the use of common statistical computations of the Summary values, which can be extrapolated to the entire
set of unique identifiers.

The underlying C++ library supports Summary objects of any type (including complex types) and arbitrary policies
of updating Summaries during the sketch building process, and combining these Summaries during union and intersection set operations.

The current set of functions for BigQuery implements Summary objects as INT64 (unsigned in C++) with SUM, MIN, MAX, ONE (constant 1) policies (modes).
This enables calculations like the sum, average, minimum, or maximum of the Summary values associated with the distinct keys.

This implementation can serve as an example of how to implement Tuple sketch with a Summary type and policy of your choice.
We are open to suggestions on what Summary types and policies to consider for inclusion here.

Please visit 
[Tuple Sketches](https://datasketches.apache.org/docs/Tuple/TupleSketches.html) 
for more information about this sketch family.

Please visit the main 
[Apache DataSketches website](https://datasketches.apache.org) 
for more information about DataSketches library.

If you are interested in making contributions to this project please see our 
[Community](https://datasketches.apache.org/docs/Community/) 
page for how to contact us.
