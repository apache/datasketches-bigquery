/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Injected as --post-js so it overrides Emscripten's WASI randomFill after it
// is defined. With -sENVIRONMENT=shell, Emscripten's randomFill defaults to the
// d8-only os.system("/dev/urandom") path, and BigQuery's V8 has no os global
// (nor Web Crypto), so it throws "os is not defined". Supply a plain JS RNG.
randomFill = (view) => { for (var i = 0; i < view.length; i++) view[i] = (Math.random() * 256) | 0; return 0; };
