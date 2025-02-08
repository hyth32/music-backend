#!/bin/bash

WS_URL="ws://localhost:5000"

if ! command -v websocat &> /dev/null; then
    exit 1
fi

echo "Подключение к WS-серверу $WS_URL"

(
    echo '{"type": "message", "content": "Hello!"}'
) | websocat "$WS_URL" --text

if [ $? -eq 0 ]; then
    echo "Успешно"
else
    echo "Ошибка подключения к сокету"
fi