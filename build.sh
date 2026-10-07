#!/bin/bash

# Выход при любой ошибке
set -e

# Конфигурация путей
SRC_DIR="src"
DIST_DIR="out"             # Поменяли на out
HTML_SRC="$SRC_DIR/__app/index.html"
OUTPUT_JS="$DIST_DIR/index.js"
OUTPUT_CSS="$DIST_DIR/index.css"

# Очистка и создание папки сборки
rm -rf "$DIST_DIR"
mkdir -p "$DIST_DIR"

# Очищаем/создаем пустые файлы перед конкатенацией
echo -n "" > "$OUTPUT_JS"
echo -n "" > "$OUTPUT_CSS"

# Функция для генерации красивой шапки файла
format_file_header() {
    local file_path="$1"
    echo "/** ------------------------------------------------------------ */"
    echo "/** $file_path */"
    echo "/** ------------------------------------------------------------ */"
}

# Функция обработки одиночного файла с проверкой на ignore
process_file() {
    local file_path="$1"
    
    # Пропускаем сам index.html, чтобы он не попал в бандлы
    [[ "$file_path" == *"/app/index.html" ]] && return
    [ ! -f "$file_path" ] && return

    # Читаем только первую строку файла
    local first_line
    first_line=$(head -n 1 "$file_path")

    # Проверяем, содержит ли первая строка ключевое слово @build-ignore
    if [[ "$first_line" == *"@build-ignore"* ]]; then
        # Извлекаем текст комментария без пробелов
        local comment_text="${BASH_REMATCH[1]}"
        # Убираем возможные лишние пробелы на концах
        comment_text=$(echo "$comment_text" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')
        
        echo "ignored: $file_path: $comment_text"
        return
    fi

    # Если файл не проигнорирован, добавляем его в сборку по расширению
    if [[ "$file_path" == *.js ]]; then
        format_file_header "$file_path" >> "$OUTPUT_JS"
        cat "$file_path" >> "$OUTPUT_JS"
        echo -e "\n" >> "$OUTPUT_JS"
    elif [[ "$file_path" == *.css ]]; then
        format_file_header "$file_path" >> "$OUTPUT_CSS"
        cat "$file_path" >> "$OUTPUT_CSS"
        echo -e "\n" >> "$OUTPUT_CSS"
    fi
}

# Функция рекурсивной сборки директории
process_directory() {
    local dir_path="$1"
    local list_file="$dir_path/__build.lst"

    if [ -f "$list_file" ]; then
        # === Логика 1: Файл __build.lst СУЩЕСТВУЕТ ===
        while IFS= read -r line || [ -n "$line" ]; do
            line=$(echo "$line" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')
            [[ -z "$line" || "$line" =~ ^# ]] && continue

            local current_path="$dir_path/$line"

            if [ -d "$current_path" ]; then
                process_directory "$current_path"
            elif [ -f "$current_path" ]; then
                process_file "$current_path"
            fi
        done < "$list_file"
    else
        # === Логика 2: Файла __build.lst НЕТ ===
        for file in $(find "$dir_path" -maxdepth 1 -type f | sort); do
            [[ "$(basename "$file")" =~ ^\. ]] && continue
            process_file "$file"
        done

        for subdir in $(find "$dir_path" -maxdepth 1 -type d | sort); do
            [[ "$subdir" == "$dir_path" || "$(basename "$subdir")" =~ ^\. ]] && continue
            process_directory "$subdir"
        done
    fi
}

echo "Начало сборки проекта..."

# Запускаем сборку от корня src/
if [ -d "$SRC_DIR" ]; then
    process_directory "$SRC_DIR"
    
    # Перенос index.html после успешной сборки JS/CSS
    if [ -f "$HTML_SRC" ]; then
        cp "$HTML_SRC" "$DIST_DIR/index.html"
        echo "Копирование HTML: $HTML_SRC -> $DIST_DIR/index.html"
    else
        echo "Предупреждение: Главный HTML-файл не найден по пути $HTML_SRC!"
    fi

    echo "Сборка успешно завершена!"
    echo "Создано: $OUTPUT_JS"
    echo "Создано: $OUTPUT_CSS"
else
    echo "Ошибка: Директория $SRC_DIR не найдена!"
    exit 1
fi