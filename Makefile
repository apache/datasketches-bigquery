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

MODULES := theta tuple cpc hll kll fi tdigest

$(MODULES):
	$(MAKE) -C $@

.PHONY: all clean init $(MODULES)
.DEFAULT_GOAL := all

all: $(MODULES)

MODCLEAN = $(addsuffix .clean, $(MODULES))

$(MODCLEAN): %.clean:
	$(MAKE) -C $* clean

clean: $(MODCLEAN)
	rm .df-credentials.json
	rm workflow_settings.yaml

init:
	./init_dataform.sh

MODINSTALL = $(addsuffix .install, $(MODULES))

$(MODINSTALL): %.install:
	$(MAKE) -C $* install

install: init $(MODINSTALL)
	dataform run --tags "udfs"

MODTEST = $(addsuffix .test, $(MODULES))

$(MODTEST): %.test:
	- $(MAKE) -C $* test

unittest:
	dataform test

test: $(MODTEST) unittest

readme:
	python3 readme_generator.py
