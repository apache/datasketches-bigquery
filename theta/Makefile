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

all: theta_sketch.mjs theta_sketch.js theta_sketch.wasm

%.mjs: %.cpp
	$(EMCC) $< $(EMCFLAGS) -sSINGLE_FILE=1 -o $@

# this rule creates a non-es6 loadable library
%.js: %.cpp
	$(EMCC) $< $(EMCFLAGS) -sSINGLE_FILE=1 -o $@

%.wasm: %.cpp
	$(EMCC) $< $(EMCFLAGS) -sSTANDALONE_WASM=1 -o $@

clean:
	$(RM) *.mjs *.js *.wasm

.PHONY: all clean
