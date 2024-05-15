<?php

namespace App\Application\Converters;

use DOMDocument;
use DOMException;
use Exception;
use SimpleXMLElement;

class ConverterTypeB implements ConverterInterface
{
    public function __construct()
    {

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

        $categories = [];


        foreach ($xml->o as $product) {
            if(isset($product->cat)){

                // Преобразуем буквы категории в числа
                $categoryNumber = $this->lettersToNumbers($product->cat);
                $categoryName = (string) $product->cat;

                $categories[$categoryName]['id'] = $categoryNumber;
                $categories[$categoryName]['name'] = $categoryName;
            }
        }

        foreach ($categories as $categoryName){
            $categoryElement = $yml->createElement('category');
            $categoryElement->setAttribute('id', $categoryName['id']);
            $categoryElement->appendChild($yml->createCDATASection(trim($categoryName['name'])));
            $categoriesTag->appendChild($categoryElement);
        }

        /** Обработка товаров */
        foreach ($xml->o as $product) {
            /** Создаём тег offer */
            $offer = $shop->appendChild($yml->createElement('offer'));


            /** ID товара */
            if (isset($product['id'])) {
                $offer->setAttribute('id', $product['id']);
            }

            /** Available true */
            $offer->setAttribute('available', 'true');

            /** Категория товара */
            $categoryName = (string) $product->cat;
            if (isset($product->cat)) {
                {
                    $offer->appendChild($yml->createElement('categoryId', $categories[$categoryName]['id']));
                }
            }

            /** Название товара */
            if (isset($product->name)) {
                $nameElement = $offer->appendChild($yml->createElement('name'));
                $nameElement->appendChild($yml->createCDATASection(trim($product->name)));
            }

            /** Название товара укр */
            $offer->appendChild($yml->createElement('name_ua', ''));

            /** Валюта */
            if(isset($params['currency']))
            {
                $offer->appendChild($yml->createElement('currencyId', $params['currency']));
            }

            /** Цена товара */
            if (isset($product['price'])) {
                $offer->appendChild($yml->createElement('price', $product['price']));
            }

            /** Vendor */
            $offer->appendChild($yml->createElement('vendor', ''));

            /** Vendor Code */
            $offer->appendChild($yml->createElement('vendorCode', ''));

            /** country_of_origin */
            $offer->appendChild($yml->createElement('country_of_origin', ''));

            /** URL товара */
            if (isset($product['url'])) {
                $nameElement = $offer->appendChild($yml->createElement('url'));
                $nameElement->appendChild($yml->createCDATASection(trim($product['url'])));
            }

            /** Описание товара */
            if (isset($product->desc)) {
                $descriptionElement = $offer->appendChild($yml->createElement('description'));
                $descriptionElement->appendChild($yml->createCDATASection(trim($product->desc)));
            }

            /** Description_uk */
            $offer->appendChild($yml->createElement('description_ua', ''));

            /** Картинки товара */
            if (isset($product->imgs)) {
                foreach ($product->imgs->children() as $img) {
                    $url = (string) $img['url'];
                    if (!empty($url)) {
                        $pictureNode = $offer->appendChild($yml->createElement('picture'));
                        $pictureNode->appendChild($yml->createCDATASection($url));
                    }
                }
            }

            /** Дополнительные атрибуты товара */
            foreach ($product->attrs->a as $attribute) {
                if (isset($attribute['name'])) {
                    $paramElement = $yml->createElement('param', $attribute);
                    $paramElement->setAttribute('name', $attribute['name']);
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
