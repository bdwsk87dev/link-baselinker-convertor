<?php

namespace App\Application\Converters;

use DOMDocument;
use DOMException;
use Exception;
use SimpleXMLElement;

class ConverterTypeA implements ConverterInterface
{
    public function __construct(){
    }

    /**
     * @throws DOMException
     * @throws Exception
     */
    public function convert(
        $uploadFilePath,
        $params
    ):string
    {

        $xmlData = file_get_contents($uploadFilePath);

        /** Создаем объект SimpleXMLElement из данных XML */
        $xml = new SimpleXMLElement($xmlData);

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
                $categoryName = (string) $product->category_name;

                $categories[$categoryName]['id'] = $categoryNumber;
                $categories[$categoryName]['name'] = $categoryName;
            }
        }

        foreach ($categories as $categoryName){
            // Категории
            $categoryElement = $yml->createElement('category');
            $categoryElement->setAttribute('id', $categoryName['id']);

            // OR
            $categoryElement->appendChild($yml->createCDATASection($categoryName['name']));

            // OR
            // $categoryElement->appendChild($yml->createTextNode($categoryName['name']));

            $categoriesTag->appendChild($categoryElement);
        }

        /**
         * Находим все товары
         */

        // Обработка товаров
        foreach ($xml->product as $product) {

            /** Создаём тег offer */
            $offer = $shop->appendChild($yml->createElement('offer'));

            if(isset($product->quantity) && (string) $product->quantity == '0')
            {
                $offer->setAttribute('available', 'false');
            }
            else
            {
                $offer->setAttribute('available', 'true');
            }

            /** ID товара */
            if(isset($product->product_id))
            {
                $offer->setAttribute('id', $product->product_id);
            }

            /** Available true */
            $offer->setAttribute('available', 'true');

            /** Категория товара */
            $categoryName = (string) $product->category_name;
            if(isset($categories[$categoryName]))
            {
                $offer->appendChild($yml->createElement('categoryId', $categories[$categoryName]['id']));
            }

            /** Название товара */
            if(isset($product->name))
            {
                $nameElement = $offer->appendChild($yml->createElement('name'));
                $nameElement->appendChild($yml->createCDATASection($product->name));
            }

            /** Название товара укр */
            $offer->appendChild($yml->createElement('name_ua', ''));

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
                $manufacturerName = htmlspecialchars($product->manufacturer_name, ENT_XML1, 'UTF-8');
                $offer->appendChild($yml->createElement('vendor', $manufacturerName));
            }

            /** Vendor Code */
            $offer->appendChild($yml->createElement('vendorCode', ''));

            /** country_of_origin */
            $offer->appendChild($yml->createElement('country_of_origin', ''));

            /** Url */
            $offer->appendChild($yml->createElement('url', ''));

            /** Description */
            $descriptionElement = $offer->appendChild($yml->createElement('description'));
            $descriptionElement->appendChild($yml->createCDATASection(trim($product->description)));

            /** Description_uk */
            $offer->appendChild($yml->createElement('description_ua', ''));

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

            if ($product->attributes->attribute !== null) {
                /** Дополнительные параметры */
                foreach ($product->attributes->attribute as $attribute) {

                    // Экранирование символов в значении перед добавлением в XML
                    $attributeValue = htmlspecialchars($attribute->attribute_value, ENT_XML1, 'UTF-8');
                    // Создаем элемент param
                    $paramElement = $yml->createElement('param', $attributeValue);

                    // Устанавливаем атрибуты name и value
                    $paramElement->setAttribute('name', $attribute->attribute_name);
                    // Добавляем элемент param в offer
                    $offer->appendChild($paramElement);
                }
            }
        }

        /** Сохранение YML-файла */
        $yml->save($uploadFilePath.'_'.time()."_c_.xml");

        return $uploadFilePath.'_'.time()."_c_.xml";
    }


    public function lettersToNumbers($input): string
    {

        $input = strtoupper($input);

        $letterNumberMap = [
            'A' => 1, 'B' => 2, 'C' => 3, 'D' => 4, 'E' => 5,
            'F' => 6, 'G' => 7, 'H' => 8, 'I' => 9, 'J' => 10,
            'K' => 11, 'L' => 12, 'M' => 13, 'N' => 14, 'O' => 15,
            'P' => 16, 'Q' => 17, 'R' => 18, 'S' => 19, 'T' => 20,
            'U' => 21, 'V' => 22, 'W' => 23, 'X' => 24, 'Y' => 25,
            'Z' => 26, 'Ł' => 27, 'Ó' => 28, 'ł' => 29, 'ó' => 30,
        ];

        $result = '';

        // Проходим по каждому символу в строке
        for ($i = 0; $i < strlen($input); $i++) {
            $char = $input[$i];

            // Если символ буква и есть в таблице соответствия, добавляем число в результат
            if (ctype_alpha($char) && isset($letterNumberMap[$char])) {
                $result .= $letterNumberMap[$char];
            } else {
                // Если символ не буква или нет в таблице, оставляем его как есть или пустоту
                // $result .= $char;
                $result .= '1';
            }
        }

        $result = substr($result, -15);

        return $result;
    }
}

// EXAMPLES
// createTextNode
// $categoryElement->appendChild($yml->createTextNode($categoryName['name'])); createCDATASection
