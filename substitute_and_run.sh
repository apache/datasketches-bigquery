#!/bin/bash

FILE=$1

if [ -u $BQ_PROJECT ]; then
  echo "environment variable BQ_PROJECT must be set"
  exit
fi
if [ -u $BQ_DATASET ]; then
  echo "environment variable BQ_DATASET must be set"
  exit
fi
if [ -u $JS_BUCKET ]; then
  echo "environment variable JS_BUCKET must be set"
  exit
fi

FUNC=${FILE##*/}
FUNC=${FUNC%%.*}

sed -e "s/\${self()}/\`${BQ_PROJECT}.${BQ_DATASET}.${FUNC}\`/;s|\${JS_BUCKET}|${JS_BUCKET}|g;s/\$BQ_DATASET/${BQ_DATASET}/g;s/\${ref(\"\([^\"]*\)\")}/\`${BQ_PROJECT}.${BQ_DATASET}.\1\`/g;s|\${dataform.projectConfig.vars.jsBucket}|${JS_BUCKET}|g" "${FILE}" | grep -v -e"^config" | bq --project_id ${BQ_PROJECT} query --nouse_legacy_sql
