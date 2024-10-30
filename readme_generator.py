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

  # Format multiline descriptions for Markdown and escape them
  description = escape_markdown(description)
  description = re.compile(r'\n*For more info.*', re.M | re.S).sub('', description) # remove repetitive links
  description = description.replace('\n', '<br>')  # Replace newlines with <br> tags

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
      "function_name": filename[:-5],  # Remove file extension .sqlx
      "signature": f"({', '.join([f'{arg[0]} {arg[1]}' for arg in arg_list])}) -> {return_type}",
      "description": description,
      "function_type": function_type,
  }

# Function to walk through directories, parse SQLX files, and collect data for README
def process_folder(input_folder: str) -> dict:
  function_index = defaultdict(list)

  for root, dirs, files in os.walk(input_folder):
    for file in files:
      if file.endswith(".sqlx"):
        sqlx_path = os.path.join(root, file)
        sketch_type = root.split('/')[-2]  # Get the second to last directory name

        logging.info(f"Processing file: {sqlx_path}")

        with open(sqlx_path, 'r') as f:
          content = f.read()

        # Parse the SQLX content
        parsed_data = parse_sqlx(content, file)
        logging.info(f"Parsed data for {file}: {parsed_data}")

        # Update function index with relative path
        relative_path = os.path.relpath(sqlx_path, input_folder)
        function_index[sketch_type].append({
            'function_name': parsed_data['function_name'],
            'signature': parsed_data['signature'],
            'function_type':parsed_data['function_type'],
            'description': parsed_data['description'],
            'path': relative_path  # Store relative path for linking
        })

  return function_index

# Function to generate README content based on the template
def generate_readme(template_path: str, function_index: dict, input_folder: str) -> str:
  # Read the template file
  with open(template_path, 'r') as template_file:
    template_lines = template_file.readlines()

  # Populate the README content
  output_lines = []
  current_section = None

  for line in template_lines:
    if line.startswith("## "):  # Start of a new section in README.md file
      current_section = line.strip().split(" ")[1].lower()  # Extract sketch type from section name
      output_lines.append(line)
    elif line.startswith("| Function Name"):  # Placeholder for the table
      if current_section in function_index:
        # Generate the table content
        table_content = "| Function Name | Function Type | Signature | Description |\n"
        table_content += "|---|---|---|---|\n"  # Add the table header here

        # Sort functions by function type (AGGREGATE first, then SCALAR) and then by number of arguments
        sorted_functions = sorted(function_index[current_section], key=lambda x: (x['function_type'], len(x['signature'].split(','))), reverse=False)
        for function in sorted_functions:
          function_link = f"[{function['function_name']}]({function['path']})"
          table_content += f"| {function_link} | {function['function_type']} | {function['signature']} | {function['description']} |\n"
        output_lines.extend(table_content.splitlines(True))  # Add the table lines

        # Add examples section
        examples_path = os.path.join(input_folder, current_section, "test")
        example_files = [f for f in os.listdir(examples_path) if f.endswith("_test.sql")]
        if example_files:
          output_lines.append("\n**Examples:**\n\n")
          for example_file in example_files:
            # Read the example SQL file
            with open(os.path.join(examples_path, example_file), 'r') as f:
              sql_code = f.read()

            # Remove license header from examples
            sql_code_lines = sql_code.splitlines()
            start_index = 0
            for i, line in enumerate(sql_code_lines):
              if not line.startswith("/*") and not line.startswith(" *") and not line.startswith(" */"):
                start_index = i
                break
            sql_code_without_license = "\n".join(sql_code_lines[start_index:])

            # Add the SQL code in a code block
            output_lines.append(f"```sql\n{sql_code_without_license}\n```\n")

    else:
      output_lines.append(line)  # Keep other lines from the template

  output_content = "".join(output_lines)
  output_content = output_content.replace("```\n|---|---|---|---|","```\n")  # Remove the extra table breaks

  return output_content

if __name__ == "__main__":
  input_folder = "."  # Set input folder path as current folder
  template_path = "README_template.md"  # Path to the template
  function_index = process_folder(input_folder)

  # Generate README content from template
  readme_content = generate_readme(template_path, function_index, input_folder)  # Pass input_folder

  # Write to README.md file
  with open("README.md", "w") as readme_file:
    readme_file.write(readme_content)

  logging.info("README.md generated successfully.")