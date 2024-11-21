#!/bin/bash

# Generate Dataform credentials file which simply
# picks up application default credentials
cat > .df-credentials.json << EOF
{
  "projectId": "$BQ_PROJECT",
  "location": "$BQ_LOCATION"
}
EOF

# Create a workflow_settings.yaml file
cat > workflow_settings.yaml << EOF
dataformCoreVersion: 3.0.8
defaultLocation: "$BQ_LOCATION"
defaultProject: "$BQ_PROJECT"
defaultDataset: "$BQ_DATASET"
vars:
  jsBucket: "$JS_BUCKET"
EOF