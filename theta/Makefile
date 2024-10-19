# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.

EMCC=emcc
EMCFLAGS=-I../datasketches-cpp/common/include \
	-I../datasketches-cpp/theta/include \
	--no-entry \
	-sWASM_BIGINT=1 \
	-sEXPORTED_FUNCTIONS=[_malloc,_free] \
	-sENVIRONMENT=shell \
	-sTOTAL_MEMORY=1024MB \
	-O3 \
	--bind

ARTIFACTS=apache_theta_sketch.mjs apache_theta_sketch.js apache_theta_sketch.wasm

all: $(ARTIFACTS)

%.mjs: %.cpp
	$(EMCC) $< $(EMCFLAGS) -sSINGLE_FILE=1 -o apache_$@

# this rule creates a non-es6 loadable library
%.js: %.cpp
	$(EMCC) $< $(EMCFLAGS) -sSINGLE_FILE=1 -o apache_$@

%.wasm: %.cpp
	$(EMCC) $< $(EMCFLAGS) -sSTANDALONE_WASM=1 -o apache_$@

clean:
	$(RM) $(ARTIFACTS)

upload: all
	@for file in $(ARTIFACTS); do \
	  gcloud storage cp $$file $(JS_BUCKET)/ ; \
	done

# some functions (with shorter name) can call other functions (with suffix)
# so reversing the order should create full-signature functions first
reverse = $(if $(wordlist 2,2,$(1)),$(call reverse,$(wordlist 2,$(words $(1)),$(1))) $(firstword $(1)),$(1))

create:
	@for file in $(call reverse,$(wildcard sqlx/*.sqlx)); do \
	  ../substitute_and_run.sh $$file ; \
	done

install: upload create

test:
	@for file in $(wildcard test/*sql); do \
	  ../substitute_and_run.sh $$file ; \
	done

.PHONY: all clean install upload create test
