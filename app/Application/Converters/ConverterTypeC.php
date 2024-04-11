<?php

namespace App\Application\Converters;

use DOMDocument;
use DOMException;
use Exception;
use SimpleXMLElement;

class ConverterTypeC
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
    ){

        $opts = [
            'http' => [
                'timeout' => 120
            ]
        ];

        $context = stream_context_create($opts);
        $xmlData = file_get_contents($uploadFilePath, false, $context);

        //$xmlData = file_get_contents($uploadFilePath);

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
        $categoriesCount = 0;
        foreach ($xml->entry as $product) {
            $tagG = $product->children('g', true);
            if (property_exists($tagG, 'google_product_category'))
            {
                $categoryName = $product->children('g', true)->google_product_category;

                // Преобразуем буквы категории в числа
                $categoryNumber = $this->lettersToNumbers($categoryName, $categoriesCount);
                $categoryName = (string) $categoryName;

                $categories[$categoryName]['id'] = $categoryNumber;
                $categories[$categoryName]['name'] = $categoryName;
                $categoriesCount++;
            }
            else{
                $categories['no category']['id'] = '01010101111';
                $categories['no category']['name'] = 'no category';
            }
        }


        foreach ($categories as $categoryName){
            $categoryElement = $yml->createElement('category');
            $categoryElement->setAttribute('id', $categoryName['id']);
            $categoryElement->appendChild($yml->createCDATASection(trim($categoryName['name'])));
            $categoriesTag->appendChild($categoryElement);
        }

        /** Обработка товаров */
        foreach ($xml->entry as $product) {
            $tagG = $product->children('g', true);

            /** Создаём тег offer */
            $offer = $shop->appendChild($yml->createElement('offer'));


            /** ID товара */
            $id = $product->children('g', true)->id;
            if (isset($id)) {
                $offer->setAttribute('id', $id);
            }

            /** Available true */
            $offer->setAttribute('available', 'true');


            /** Категория товара */
            if (property_exists($tagG, 'google_product_category')) {
                $categoryName = (string) $product->children('g', true)->google_product_category;
                if(isset($categories[$categoryName]))
                {
                    $offer->appendChild($yml->createElement('categoryId', $categories[$categoryName]['id']));
                }
            }
            else{
                $offer->appendChild($yml->createElement('categoryId', '01010101111'));
            }

            /** Название товара */
            if (isset($product->title)) {
                $nameElement = $offer->appendChild($yml->createElement('name'));
                $nameElement->appendChild($yml->createCDATASection(trim($product->title)));
            }

            /** Название товара укр */
            $offer->appendChild($yml->createElement('name_ua', ''));

            /** Валюта */
            if(isset($params['currency']))
            {
                $offer->appendChild($yml->createElement('currencyId', $params['currency']));
            }

            /** Цена товара */

            $price = $product->children('g', true)->price;
            if (isset($price)) {
                $offer->appendChild($yml->createElement('price', $price));
            }

            /** Vendor */
            $brand = $product->children('g', true)->brand;
            if (isset($brand)) {
                $manufacturerName = htmlspecialchars($brand, ENT_XML1, 'UTF-8');
                $offer->appendChild($yml->createElement('vendor', $manufacturerName));
            }

            /** Vendor Code */
            $offer->appendChild($yml->createElement('vendorCode', ''));

            /** country_of_origin */
            $offer->appendChild($yml->createElement('country_of_origin', ''));

            /** URL товара */
            if (isset($product['link'])) {
                $nameElement = $offer->appendChild($yml->createElement('url'));
                $nameElement->appendChild($yml->createCDATASection(trim($product['link'])));
            }

            /** Описание товара */
            if (isset($product->description)) {
                $descriptionElement = $offer->appendChild($yml->createElement('description'));
                $descriptionElement->appendChild($yml->createCDATASection(trim($product->description)));
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

            $gtin = $product->children('g', true)->gtin;
            if (isset($gtin)) {
                $paramElement = $yml->createElement('param', $gtin);
                $paramElement->setAttribute('name', 'gtin');
                $offer->appendChild($paramElement);
            }

            $sale_price = $product->children('g', true)->sale_price;
            if (isset($sale_price)) {
                $paramElement = $yml->createElement('param', $sale_price);
                $paramElement->setAttribute('name', 'Оптовая цена');
                $offer->appendChild($paramElement);
            }

        }

        /** Сохранение YML-файла */
        $yml->save($uploadFilePath."_c_.xml");
        return $uploadFilePath."_c_.xml";
    }

    public function lettersToNumbers($input, $catCount): string
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

        $result = substr($result, -8);

        return $result.$catCount;
    }
}
