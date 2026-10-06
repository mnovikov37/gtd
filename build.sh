#!/bin/bash
VERSION="1.0.0"

output="index"
list="__build.lst"

# Добавление исходного кода в выходной файл проекта
# $1 - путь к файлу с исходным кодом относительно скрипта build.sh
# S2 - выходной файл проекта - куда надо добавить код
addToOutput() {
  echo "add: $1"
  echo "" >> "$2"
  echo "" >> "$2"
  echo "/** ------------------------------------------------------------ */" >> "$2"
  echo "/** $1 */" >> "$2"
  echo "/** ------------------------------------------------------------ */" >> "$2"
  cat $1 >> "$2"
}

# $1 - directory for search list file
build() {
#  echo "build ($1)"
  IFS=$'\r\n'
  for line in $(cat $1$list); do
#    echo "line: $line"
    if [[ $line =~ .+\.js$ ]] || [[ $line =~ .+\.css$ ]]; then
#      echo "line is file"
      local file="$1$line"
      local ext=${line##*.}
      addToOutput "$file" "$output.$ext"
    elif [[ $line =~ .+\\$ ]]; then
#      echo "line is dir"
      local dir="${line:0:-1}/"
      build "$1$dir"
    fi
  done
}

> "$output.js"
> "$output.css"

echo "const APP__VERSION = '$VERSION';" >> "$output.js"
echo "/* APP VERSION: $VERSION */" >> "$output.css"

echo "build version $VERSION..."
build ""
echo "build completed"

exit 0