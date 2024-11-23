#!/bin/bash

# Generate Dataform credentials file which simply
# picks up application default credentials
cat > ../.df-credentials.json << EOF
{
  "projectId": "$BQ_PROJECT",
  "location": "$BQ_LOCATION"
}
EOF

# Create a workflow_settings.yaml file
cat > ../workflow_settings.yaml << EOF
dataformCoreVersion: 3.0.8
defaultLocation: "$BQ_LOCATION"
defaultProject: "$BQ_PROJECT"
defaultDataset: "$BQ_DATASET"
vars:
  jsBucket: "$JS_BUCKET"
EOF

# Create Dataform includes/ folder and add unit_test_utils.js helper script
(mkdir -p ../includes \
&& cp ./unit_test_utils.js ../includes)

# Create Dataform definitions/ folder and add all SQLX and unit tests
if [ ! -d "../definitions" ]; then (
  mkdir -p ../definitions \
  && cd ../definitions \
  && ln -s ../theta/sqlx theta_sqlx \
  && ln -s ../theta/test theta_test \
  && ln -s ../tuple/sqlx tuple_sqlx \
  && ln -s ../tuple/test tuple_test \
  && ln -s ../cpc/sqlx cpc_sqlx \
  && ln -s ../cpc/test cpc_test \
  && ln -s ../hll/sqlx hll_sqlx \
  && ln -s ../hll/test hll_test \
  && ln -s ../kll/sqlx kll_sqlx \
  && ln -s ../kll/test kll_test \
  && ln -s ../fi/sqlx fi_sqlx \
  && ln -s ../fi/test fi_test \
  && ln -s ../tdigest/sqlx tdigest_sqlx \
  && ln -s ../tdigest/test tdigest_test \
  && ln -s ../req/sqlx req_sqlx \
  && ln -s ../req/test req_test \
) fi
