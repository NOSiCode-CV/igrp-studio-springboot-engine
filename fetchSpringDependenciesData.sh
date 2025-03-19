#!/bin/bash

SPRING_BOOT_VERSION="3.4.3"
SPRING_INITIALIZER_DEPENDENCIES_DATA_URL="https://start.spring.io/dependencies?bootVersion="
SPRING_LOCAL_DEPENDENCY_FILE_DATA="spring-dependencies.json"

API_URL="${SPRING_INITIALIZER_DEPENDENCIES_DATA_URL}${SPRING_BOOT_VERSION}"
echo "Response data from $API_URL"

FILE_PATH="$(pwd)/${SPRING_LOCAL_DEPENDENCY_FILE_DATA}"
echo "Response data saved to $FILE_PATH"

response=$(curl -s $API_URL)

if [[ $? -eq 0 ]]; then
  echo "$response" | jq . > "$FILE_PATH"
  echo "Response data saved to $FILE_PATH"
else
  echo "Error fetching data"
fi