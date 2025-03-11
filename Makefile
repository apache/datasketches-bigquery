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

MODULES := theta tuple cpc hll kll fi tdigest req

$(MODULES):
	$(MAKE) -C $@

.PHONY: all clean init test unittest readme $(MODULES)
.DEFAULT_GOAL := all

all: datasketches-cpp $(MODULES)

DATASKETCHES_CPP_VERSION = 5.2.0
datasketches-cpp:
	wget https://github.com/apache/datasketches-cpp/archive/refs/tags/$(DATASKETCHES_CPP_VERSION).zip
	mv $(DATASKETCHES_CPP_VERSION).zip datasketches-cpp-$(DATASKETCHES_CPP_VERSION).zip
	unzip datasketches-cpp-$(DATASKETCHES_CPP_VERSION).zip
	rm datasketches-cpp-$(DATASKETCHES_CPP_VERSION).zip
	ln -s datasketches-cpp-$(DATASKETCHES_CPP_VERSION) datasketches-cpp

MODCLEAN = $(addsuffix .clean, $(MODULES))

$(MODCLEAN): %.clean:
	$(MAKE) -C $* clean

clean: $(MODCLEAN)
	$(RM) .df-credentials.json
	$(RM) workflow_settings.yaml
	$(RM) -r definitions
	$(RM) -r includes

init: workflow_settings.yaml

workflow_settings.yaml:
	(cd cicd && ./init_dataform.sh)

MODUPLOAD = $(addsuffix .upload, $(MODULES))

$(MODUPLOAD): %.upload:
	$(MAKE) -C $* upload

upload: $(MODUPLOAD)

MODCREATE = $(addsuffix .create, $(MODULES))

$(MODCREATE): %.create: init
	$(MAKE) -C $* create

create: init
	dataform run --tags "udfs"

MODINSTALL = $(addsuffix .install, $(MODULES))

$(MODINSTALL): %.install: init
	$(MAKE) -C $* install

install: upload create

MODTEST = $(addsuffix .test, $(MODULES))

$(MODTEST): %.test:
	- $(MAKE) -C $* test

test: init
	dataform test

readme:
	python3 readme_generator.py

.PHONY: all clean init install upload create
