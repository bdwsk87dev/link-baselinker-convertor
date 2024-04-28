<?php

namespace App\Application\FileManager\FileReaders;

use Illuminate\Http\JsonResponse;

class XmlStructReader
{
    public function getTags($filePath): JsonResponse
    {
        // Читаем содержимое файла
        $content = file_get_contents($filePath);

        // Преобразуем содержимое XML файла в объект SimpleXMLElement
        $xmlData = simplexml_load_string($content, 'SimpleXMLElement', LIBXML_NOCDATA);

        // Преобразуем объект SimpleXMLElement в массив
        $dataArray = $this->convertXmlToArray($xmlData);

        // Возвращаем структуру XML в виде массива
        return response()->json($dataArray);
    }

    private function convertXmlToArray($xmlObject): array
    {
        $dataArray = [];

        // Получаем имя элемента
        $elementName = $xmlObject->getName();

        // Создаем массив данных элемента
        $elementData = ['tag' => $elementName];

        // Если у элемента есть атрибуты, добавляем их в массив данных элемента
        $attributes = [];
        foreach ($xmlObject->attributes() as $name => $value) {
            $attributes[$name] = (string) $value;
        }
        if (!empty($attributes)) {
            $elementData['attributes'] = $attributes;
        }

        // Если у элемента есть текстовое содержимое, добавляем его в массив данных элемента
        $text = trim((string) $xmlObject);
        if (!empty($text)) {
            $elementData['text'] = $text;
        }

        // Рекурсивно обрабатываем дочерние элементы
        foreach ($xmlObject->children() as $child) {
            $dataArray[$elementName][] = $this->convertXmlToArray($child);
        }

        // Если есть дочерние элементы, добавляем массив данных элемента в общий массив данных
        if (!empty($dataArray[$elementName])) {
            $dataArray[$elementName][] = $elementData;
        } else {
            // Иначе, если у элемента нет дочерних элементов, просто добавляем его данные в массив
            $dataArray[] = $elementData;
        }

        return array_slice($dataArray, 0, 20);
    }
}
