#!/bin/bash

# Выход при любой ошибке
set -e

# Определение контекста сборки (по умолчанию "prod")
CONTEXT="${1:-prod}"
TARGET_ANNOTATION="@build-$CONTEXT"

# Конфигурация путей
SRC_DIR="src"
DIST_DIR="out"

# Динамический выбор исходного HTML в зависимости от контекста
if [ "$CONTEXT" = "prod" ]; then
    HTML_SRC="$SRC_DIR/__app/index.html"
else
    HTML_SRC="$SRC_DIR/__app/index-$CONTEXT.html"
fi

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

# Функция обработки одиночного файла с проверкой на аннотации
process_file() {
    local file_path="$1"
    
    # Пропускаем любые index*.html, чтобы они не попали в бандлы кода
    [[ "$(basename "$file_path")" == index*.html ]] && return
    [ ! -f "$file_path" ] && return

    # Читаем только первую строку файла
    local first_line
    first_line=$(head -n 1 "$file_path")

    # Ищем любую аннотацию вида @build-... в первой строке
    if [[ "$first_line" =~ (@build-[a-zA-Z0-9_-]+) ]]; then
        # Найдено точное имя аннотации (например: @build-ignore или @build-test)
        local found_annotation="${BASH_REMATCH[1]}" 
        
        # Извлекаем текст комментария (все, что идет ПОСЛЕ найденной аннотации)
        local comment_text=""
        if [[ "$first_line" =~ @build-[a-zA-Z0-9_-]+[[:space:]]*(.*) ]]; then
            comment_text="${BASH_REMATCH[1]}" # Строго берем 1-ю группу захвата (текст после пробелов)
            comment_text=$(echo "$comment_text" | xargs)
        fi

        # Формируем суффикс для вывода комментария в лог, если он есть
        local log_comment=""
        if [ -n "$comment_text" ]; then
            log_comment=": $comment_text"
        fi

        # 1. Если встретили @build-ignore — ИГНОРИРУЕМ ВСЕГДА
        if [ "$found_annotation" = "@build-ignore" ]; then
            echo "ignored: $file_path$log_comment"
            return
        fi

        # 2. Если аннотация не совпадает с текущим контекстом — пропускаем файл
        if [ "$found_annotation" != "$TARGET_ANNOTATION" ]; then
            echo "skipped (context mismatch): $file_path$log_comment"
            return
        fi
    fi

    # Если файл успешно прошел все фильтры (или у него нет аннотации), добавляем его в сборку
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
        for file in $(find "$dir_path" -maxdepth 1 -type f | LC_ALL=C sort -r); do
            [[ "$(basename "$file")" =~ ^\. ]] && continue
            process_file "$file"
        done

        for subdir in $(find "$dir_path" -maxdepth 1 -type d | LC_ALL=C sort -r); do
            [[ "$subdir" == "$dir_path" || "$(basename "$subdir")" =~ ^\. ]] && continue
            process_directory "$subdir"
        done
    fi
}

echo "Начало сборки проекта [Контекст: $CONTEXT]..."

# Запускаем сборку от корня src/
if [ -d "$SRC_DIR" ]; then
    process_directory "$SRC_DIR"
    
    # Перенос правильного index.html после успешной сборки JS/CSS
    if [ -f "$HTML_SRC" ]; then
        cp "$HTML_SRC" "$DIST_DIR/index.html"
        echo "Копирование HTML: $HTML_SRC -> $DIST_DIR/index.html"
    else
        echo "Ошибка: Главный HTML-файл не найден по пути $HTML_SRC!"
        exit 1
    fi

    echo "Сборка успешно завершена"
    echo "Создано: $OUTPUT_JS"
    echo "Создано: $OUTPUT_CSS"
else
    echo "Ошибка: Директория $SRC_DIR не найдена!"
    exit 1
fi