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

import os
import re
import logging
from collections import defaultdict

# Setup logging
logging.basicConfig(filename='readme_generation.log', filemode='w', level=logging.DEBUG, format='%(asctime)s [%(levelname)s] %(message)s')

# Function to escape special characters for Markdown
def escape_markdown(text):
  escape_chars = {
      '*': '\\*',
      '_': '\\_',
      '[': '\\[',
      ']': '\\]',
      '(': '\\(',
      ')': '\\)',
      '#': '\\#',
      '+': '\\+',
      '-': '\\-',
      '!': '\\!',
      '~': '\\~',
      '|': '\\|',
      '<': '\\<',
      '>': '\\>',
      '`': '\\`',
  }
  for char, escaped in escape_chars.items():
    text = text.replace(char, escaped)
  return text

# Function to parse a single SQLX file and extract relevant details
def parse_sqlx(file_content: str, filename: str) -> dict:
  logging.info(f"Parsing file: {filename}")

  function_pattern = re.compile(
      r"CREATE OR REPLACE (?:AGGREGATE )?FUNCTION\s+\$\{self\(\)\}\((.*?)\)\s+RETURNS\s+([^;]+?)(?=\s+(?:LANGUAGE|OPTIONS|$))",
      re.DOTALL
  )
  description_pattern = re.compile(r"description\s*=\s*['\"]{3}(.*?)['\"]{3}", re.DOTALL)

  # Extract function signature and return type
  function_match = function_pattern.search(file_content)
  if function_match:
    function_signature = function_match.group(1).strip()
    return_type = function_match.group(2).strip()
    logging.debug(f"Function signature: {function_signature}")
    logging.debug(f"Return type: {return_type}")
  else:
    function_signature = ""
    return_type = "UNKNOWN"
    logging.warning(f"No function signature or return type found in {filename}")

  # Extract description
  description_match = description_pattern.search(file_content)
  description = description_match.group(1).strip() if description_match else "No description available"
  description = re.compile(r'\n*For more info.*', re.M | re.S).sub('', description) # remove repetitive links
  description = escape_markdown(description)
  description = description.replace('\nParam', '\n* Param')
  description = description.replace('\nDefault', '\n* Default')
  description = description.replace('\nReturn', '\n* Return')

  # Extract function arguments and their types
  arg_list = []
  for arg in re.split(r",\s*(?![^<>]*>)", function_signature):  # Split by comma only if not within "<>"
    arg_parts = arg.strip().split()
    if len(arg_parts) >= 2:  # Allow more than two parts for complex arguments
      arg_list.append((arg_parts[0], " ".join(arg_parts[1:])))  # (arg_name, arg_type)
    elif arg.strip():  # Ignore empty arguments
      logging.warning(f"Unexpected argument format in {filename}: {arg}")

  # Determine function type
  function_type = "AGGREGATE" if "AGGREGATE FUNCTION" in file_content else "SCALAR"
  return {
      "name": filename[:-5],  # Remove file extension .sqlx
      "params": f"({', '.join([f'{arg[0]} {arg[1]}' for arg in arg_list])})",
      "returns": return_type,
      "description": description,
      "type": function_type,
  }

# Function to walk through directories, parse SQLX files, and collect data for README
def process_folder(input_folder: str, sketch_type: str) -> dict:
  function_index = defaultdict(list)

  for root, dirs, files in os.walk(input_folder):
    for file in files:
      if file.endswith(".sqlx"):
        sqlx_path = os.path.join(root, file)

        logging.info(f"Processing file: {sqlx_path}")

        with open(sqlx_path, 'r') as f:
          content = f.read()

        # Parse the SQLX content
        data = parse_sqlx(content, file)
        logging.info(f"Parsed data for {file}: {data}")
        data['path'] = sqlx_path
        function_index[sketch_type].append(data)
  return function_index

# Function to generate README content based on the template
def generate_readme(template_path: str, function_index: dict, examples_path: str) -> str:
  # Read the template file
  with open(template_path, 'r') as template_file:
    output_lines = template_file.readlines()

  output_lines.append("\n## Aggregate Functions\n")

  # Sort functions by function type (AGGREGATE first, then SCALAR) and then by number of arguments
  sorted_functions = sorted(function_index, key=lambda x: (x['type'], len(x['params'].split(','))), reverse=False)
  is_aggregate = True
  for function in sorted_functions:
    if is_aggregate and function['type'] == 'SCALAR':
      output_lines.append("\n## Scalar Functions\n")
      is_aggregate = False
    function_link = f"[{function['name']}{function['params']}](../{function['path']})"
    output_lines.append(f"\n### {function_link}\n{function['description']}\n")

  # Add examples section
  example_files = [f for f in os.listdir(examples_path) if f.endswith(".sql")]
  if example_files:
    output_lines.append("\n## Examples\n")
    for example_file in example_files:
      full_name = os.path.join(examples_path, example_file)
      output_lines.append(f"\n### [test/{example_file}](../{full_name})\n")
      with open(full_name, 'r') as f:
        sql_code = f.read()

      # Remove license header from examples
      sql_code_lines = sql_code.splitlines()
      start_index = 0
      for i, line in enumerate(sql_code_lines):
        if not line.startswith("/*") and not line.startswith(" *") and not line.startswith(" */"):
          start_index = i
          break
      sql_code_without_license = "\n".join(sql_code_lines[start_index:])

      # add project and dataset available in BQ
      sql_code_without_license = sql_code_without_license.replace('`$BQ_DATASET`', 'bqutil.datasketches')

      # Add the SQL code in a code block
      output_lines.append(f"```sql\n{sql_code_without_license}\n```\n")

  output_content = "".join(output_lines)
  return output_content

if __name__ == "__main__":
  sketch_types = ["cpc", "fi", "hll", "kll", "tdigest", "theta", "tuple", "req"]
  template_name = "README_template.md"
  readme_name = "README.md"
  for sketch_type in sketch_types:
    logging.info("processing sketch type " + sketch_type)
    function_index = process_folder(sketch_type, sketch_type)
    sketch_type_readme_name = os.path.join(sketch_type, readme_name)
    logging.info("generating " + sketch_type_readme_name)
    readme_content = generate_readme(os.path.join(sketch_type, template_name), function_index[sketch_type], os.path.join(sketch_type, "test"))
    with open(sketch_type_readme_name, "w") as readme_file:
      readme_file.write(readme_content)
    logging.info(sketch_type_readme_name + " generated successfully")
