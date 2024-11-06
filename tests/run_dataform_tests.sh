#!/bin/bash

#  Licensed to the Apache Software Foundation (ASF) under one
#  or more contributor license agreements.  See the NOTICE file
#  distributed with this work for additional information
#  regarding copyright ownership.  The ASF licenses this file
#  to you under the Apache License, Version 2.0 (the
#  "License"); you may not use this file except in compliance
#  with the License.  You may obtain a copy of the License at
#
#    http:# www.apache.org/licenses/LICENSE-2.0
#
#  Unless required by applicable law or agreed to in writing,
#  software distributed under the License is distributed on an
#  "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
#  KIND, either express or implied.  See the License for the
#  specific language governing permissions and limitations
#  under the License.

#######################################
# Runs Dataform unit tests against already deployed
# BigQuery functions.
#
# Globals:
#     BQ_DATASET - BigQuery dataset ID (required)
#     BQ_LOCATION - BigQuery location (required - should be same as your BQ_DATASET location)
#     BQ_PROJECT - BigQuery project ID (required)
# Arguments:
#     None
#######################################
run_dataform_tests() {
#   Change to the script's directory
  cd "$(dirname "$0")"

  # Create a temporary directory for the Dataform project
  TEST_DIR=$(mktemp -d)

  # Generate Dataform configuration files
  cat > "$TEST_DIR/.df-credentials.json" << EOF
{
  "projectId": "$BQ_PROJECT",
  "location": "$BQ_LOCATION"
}
EOF

  # Create a workflow_settings.yaml file
  cat > "$TEST_DIR/workflow_settings.yaml" << EOF
dataformCoreVersion: 3.0.7
defaultLocation: "$BQ_LOCATION"
defaultProject: "$BQ_PROJECT"
defaultDataset: "$BQ_DATASET"
defaultAssertionDataset: "$BQ_DATASET"
EOF

  # Create the definitions directory
  mkdir "$TEST_DIR/definitions"

  # Copy the test files to the definitions directory
  cp *.js "$TEST_DIR/definitions/"

  # Run Dataform tests
  cd "$TEST_DIR"
  dataform test .

  # Clean up the temporary directory
  rm -rf "$TEST_DIR"
}

# Check for required environment variables
if [[ -z "$BQ_PROJECT" ]]; then
  echo "Error: BQ_PROJECT environment variable is not set."
  exit 1
fi

if [[ -z "$BQ_DATASET" ]]; then
  echo "Error: BQ_DATASET environment variable is not set."
  exit 1
fi

if [[ -z "$BQ_LOCATION" ]]; then
  echo "Error: BQ_LOCATION environment variable is not set."
  exit 1
fi

# Run the tests
run_dataform_tests
