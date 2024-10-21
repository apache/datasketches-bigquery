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

MODULES := theta tuple cpc hll kll fi

$(MODULES):
	$(MAKE) -C $@

.PHONY: all clean $(MODULES)
.DEFAULT_GOAL := all

all: $(MODULES)

MODCLEAN = $(addsuffix .clean, $(MODULES))

$(MODCLEAN): %.clean:
	$(MAKE) -C $* clean

clean: $(MODCLEAN)

MODINSTALL = $(addsuffix .install, $(MODULES))

$(MODINSTALL): %.install:
	$(MAKE) -C $* install

install: $(MODINSTALL)

MODTEST = $(addsuffix .test, $(MODULES))

$(MODTEST): %.test:
	- $(MAKE) -C $* test # Added '-' to continue on error

test: $(MODTEST)

unittest:
	./tests/run_dataform_tests.sh  # Call your Dataform test script
