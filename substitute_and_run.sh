#!/bin/bash

FILE=$1

if [ -u $BQ_DATASET ]; then
  echo "environment variable BQ_DATASET must be set"
  exit
fi
if [ -u $GCS_BUCKET ]; then
  echo "environment variable GCS_BUCKET must be set"
  exit
fi

FUNC=${FILE##*/}
FUNC=${FUNC%%.*}
sed -e "s/\${self()}/${BQ_DATASET}.${FUNC}/;s/\$GCS_BUCKET/${GCS_BUCKET}/g;s/\$BQ_DATASET/${BQ_DATASET}/g" ${FILE} | grep -v -e"^config" | bq query --nouse_legacy_sql
