<?php

namespace App\Application\Converters;

use DOMDocument;
use SimpleXMLElement;

class ConverterTypeA
{
    public function __construct(){
    }

    public function convert(
        $uploadFilePath,
        $params
    ){

        $xmlData = file_get_contents($uploadFilePath);

        /** Создаем объект SimpleXMLElement из данных XML */
        $xml = new SimpleXMLElement($xmlData);

        /** Доступ к корневому элементу <shop> */
        $shop = $xml;

        /** Создание YML-документа */
        $yml = new DOMDocument('1.0', 'utf-8');
        $yml->appendChild($yml->createElement('yml_catalog'));
        $yml->documentElement->setAttribute('date', date('Y-m-d'));

        /** Добавление информации о магазине */
        $shop = $yml->documentElement->appendChild($yml->createElement('shop'));

        /** Добавляем тег категорий */
        $categoriesTag = $shop->appendChild($yml->createElement('categories'));

        /**
         * Находим все категории
         */

        $categories = [];
        foreach ($xml->product as $product) {
            if(isset($product->category_name)){

                // Преобразуем буквы категории в числа
                $categoryNumber = $this->lettersToNumbers($product->category_name);

                // Добавляем категорию в массив
                $categoryName = (string) $product->category_name;
                $categories[$categoryName]['id'] = $categoryNumber;
                $categories[$categoryName]['name'] = $categoryName;
            }
        }

        foreach ($categories as $categoryName){
            // Категории
            $categoryElement = $yml->createElement('category');
            $categoryElement->setAttribute('id', $categoryName['id']);
            $categoryElement->appendChild($yml->createTextNode($categoryName['name']));
            $categoriesTag->appendChild($categoryElement);
        }

        /**
         * Находим все товары
         */

        // Обработка товаров
        foreach ($xml->product as $product) {

            /** Создаём тег offer */
            $offer = $shop->appendChild($yml->createElement('offer'));

            /** ID товара */
            if(isset($product->product_id))
            {
                $offer->setAttribute('id', $product->product_id);
            }

            /** Категория товара */
            $categoryName = (string) $product->category_name;
            if(isset($categories[$categoryName]))
            {
                $offer->appendChild($yml->createElement('categoryId', $categories[$categoryName]['id']));
            }

            /** Название товара */
            if(isset($product->name))
            {
                $offer->appendChild($yml->createElement('name', $product->name));
            }

            /** Название товара укр */
            $offer->appendChild($yml->createElement('name_uk', ''));

            /** Валюта */
            if(isset($params['currency']))
            {
                $offer->appendChild($yml->createElement('currencyId', $params['currency']));
            }

            /** Цена */
            if(isset($product->price))
            {
                $offer->appendChild($yml->createElement('price', $product->price));
            }

            /** Vendor */
            if(isset($product->manufacturer_name))
            {
                $offer->appendChild($yml->createElement('vendor', $product->manufacturer_name));
            }

            /** Vendor Code */
            $offer->appendChild($yml->createElement('vendorCode', ''));

            /** country_of_origin */
            $offer->appendChild($yml->createElement('country_of_origin', ''));

            /** Url */
            $offer->appendChild($yml->createElement('url', ''));

            /** Description */
            $offer->appendChild($yml->createElement('description', $product->description));

            /** Pictures */
            for ($i = 0; $i <= 15; $i++) {
                $imageKey = 'image' . ($i > 0 ? '_extra_' . $i : '');
                if (isset($product->$imageKey)) {
                    $imageUrl = (string) $product->$imageKey;
                    if (!empty($imageUrl)) {
                        $pictureNode = $offer->appendChild($yml->createElement('picture'));
                        $pictureNode->appendChild($yml->createCDATASection($imageUrl));
                    }
                }
            }

            /** Дополнительные параметры */
            foreach ($product->attributes->attribute as $attribute) {

                // Создаем элемент param
                $paramElement = $yml->createElement('param');

                // Устанавливаем атрибуты name и value
                $paramElement->setAttribute('name', $attribute->attribute_name);
                $paramElement->setAttribute('value', $attribute->attribute_value);

                // Добавляем элемент param в offer
                $offer->appendChild($paramElement);
            }
        }

        /** Сохранение YML-файла */
        $yml->save($uploadFilePath."_converted.xml");
    }


    public function lettersToNumbers($input) {

        $input = strtoupper($input);

        $letterNumberMap = [
            'A' => 1, 'B' => 2, 'C' => 3, 'D' => 4, 'E' => 5,
            'F' => 6, 'G' => 7, 'H' => 8, 'I' => 9, 'J' => 10,
            'K' => 11, 'L' => 12, 'M' => 13, 'N' => 14, 'O' => 15,
            'P' => 16, 'Q' => 17, 'R' => 18, 'S' => 19, 'T' => 20,
            'U' => 21, 'V' => 22, 'W' => 23, 'X' => 24, 'Y' => 25,
            'Z' => 26, 'ł' => 27, 'ó' => 28
        ];

        $result = '';

        // Проходим по каждому символу в строке
        for ($i = 0; $i < strlen($input); $i++) {
            $char = $input[$i];

            // Если символ буква и есть в таблице соответствия, добавляем число в результат
            if (ctype_alpha($char) && isset($letterNumberMap[$char])) {
                $result .= $letterNumberMap[$char];
            } else {
                // Если символ не буква или нет в таблице, оставляем его как есть
                $result .= $char;
            }
        }

        return $result;
    }

}
