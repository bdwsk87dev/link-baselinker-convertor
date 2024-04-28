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

        // Создаем новый объект DOMDocument
        $dom = new \DOMDocument();

        // Загружаем XML-строку в объект DOMDocument
        $dom->loadXML($xmlObject->asXML());

        // Получаем корневой элемент документа
        $root = $dom->documentElement;

        // Рекурсивно обрабатываем корневой элемент и его дочерние элементы
        $dataArray = $this->domNodeToArray($root);

        return $dataArray;
    }

    private function domNodeToArray($node, $path = ''): array
    {
        $dataArray = [];

        // Получаем имя элемента и его пространство имен
        $elementName = $node->nodeName;
        $namespaceURI = $node->namespaceURI;

        // Добавляем имя элемента к пути
        $path .= '/' . $elementName;

        // Создаем массив данных элемента
        $elementData = ['tag' => $elementName, 'path' => $path];

        // Если элемент имеет пространство имен, добавляем его в массив данных элемента
        if (!empty($namespaceURI)) {
            $elementData['namespace'] = $namespaceURI;
        }

        // Получаем текстовое содержимое элемента
        $text = trim($node->nodeValue);
        if (!empty($text)) {
            $elementData['text'] = $text;
        }

        // Обрабатываем атрибуты элемента
        if ($node->hasAttributes()) {
            foreach ($node->attributes as $attribute) {
                $elementData['attributes'][$attribute->nodeName] = $attribute->nodeValue;
            }
        }

        // Рекурсивно обрабатываем дочерние элементы
        if ($node->hasChildNodes()) {
            foreach ($node->childNodes as $child) {
                if ($child->nodeType === XML_ELEMENT_NODE) {
                    $elementData[$child->nodeName][] = $this->domNodeToArray($child, $path);
                }
            }
        }

        // Добавляем массив данных элемента в общий массив данных
        $dataArray[] = $elementData;

        return $dataArray;
    }
}
