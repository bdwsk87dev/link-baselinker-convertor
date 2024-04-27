<?php

namespace App\Application\Converters;

use DOMDocument;

class ConverterTypeD
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

        /** Read cvs file **/
        $file = fopen($uploadFilePath, 'r');

        /** Создание YML-документа */
        $yml = new DOMDocument('1.0', 'utf-8');
        $yml->appendChild($yml->createElement('yml_catalog'));
        $yml->documentElement->setAttribute('date', date('Y-m-d'));

        /** Добавление информации о магазине */
        $shop = $yml->documentElement->appendChild($yml->createElement('shop'));

        /** Добавляем тег категорий */
        $categoriesTag = $shop->appendChild($yml->createElement('categories'));

        /** Собираем все категории */

        $categories = [];
        $categoriesCount = 0;

        $first = true;
        while (($data = fgetcsv($file)) !== FALSE)
        {
            if($first){
                $first = false;
                continue;
            }

            if(isset($data[9]))
            {
                $categoryName = $data[9]; // Столбец J
                $categoryNumber = $this->lettersToNumbers
                (
                    $categoryName,
                    $categoriesCount
                );
                $categoryName = (string) $categoryName;

                $categories[$categoryName]['id'] = $categoryNumber;
                $categories[$categoryName]['name'] = $categoryName;
                $categoriesCount++;

            }
        }

        foreach ($categories as $categoryName)
        {
            $categoryElement = $yml->createElement('category');
            $categoryElement->setAttribute('id', $categoryName['id']);
            $categoryElement->appendChild($yml->createCDATASection(trim($categoryName['name'])));
            $categoriesTag->appendChild($categoryElement);
        }

        /** Обработка товаров */
        rewind($file);


        $first = true;
        while (($data = fgetcsv($file)) !== FALSE)
        {
            if($first){
                $first = false;
                continue;
            }

            /** Создаём тег offer */
            $offer = $shop->appendChild($yml->createElement('offer'));

            /** ID товара */
            $offer->setAttribute('id', $data[0]);

            /** Available true */
            $offer->setAttribute('available', 'true');

            /** Категория товара */
            if(isset($data[9]))
            {
                $categoryName = (string) $data[9];
                if(isset($categories[$categoryName]))
                {
                    $offer->appendChild($yml->createElement('categoryId', $categories[$categoryName]['id']));
                }
            }
            else{
                $offer->appendChild($yml->createElement('categoryId', ''));
            }

            /** Название товара */
            if(isset($data[2]))
            {
                $nameElement = $offer->appendChild($yml->createElement('name'));
                $nameElement->appendChild($yml->createCDATASection(trim($data[2])));
            }


            /** Название товара укр */
            $offer->appendChild($yml->createElement('name_ua', ''));

            /** Валюта */
            if(isset($params['currency']))
            {
                $offer->appendChild($yml->createElement('currencyId', $params['currency']));
            }

            /** Цена товара */
            if(isset($data[6]))
            {
                $offer->appendChild($yml->createElement('price', $data[6]));
            }

            /** Vendor */
            if(isset($data[2]))
            {
                $nameElement = $offer->appendChild($yml->createElement('vendor'));
                $nameElement->appendChild($yml->createCDATASection(trim($data[2])));
            }


            /** Vendor Code */
            $offer->appendChild($yml->createElement('vendorCode', ''));

            /** country_of_origin */
            $offer->appendChild($yml->createElement('country_of_origin', ''));

            /** URL товара */
            if(isset($data[11]))
            {
                $nameElement = $offer->appendChild($yml->createElement('url'));
                $nameElement->appendChild($yml->createCDATASection(trim($data[11])));
            }

            /** Описание товара */
            if(isset($data[3]))
            {
                $descriptionElement = $offer->appendChild($yml->createElement('description'));
                $descriptionElement->appendChild($yml->createCDATASection(trim($data[3])));
            }

            /** Description_uk */
            $offer->appendChild($yml->createElement('description_ua', ''));

            /** Картинки товара */
            /* Разделитель , или ; между pictures */
            if(isset($data[10]))
            {
                $images = explode("; ", $data[10]);

                $currentUrl = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https://' : 'http://';
                $currentUrl .= $_SERVER['HTTP_HOST'];



                if(isset($images[0])){
                    $proxyUrl = $currentUrl . '/proxy/image?url=' . urlencode($images[0]);

                    // Создаем тег <picture>
                    $pictureNode = $offer->appendChild($yml->createElement('picture'));
                    // Добавляем содержимое изображения в CDATA-секцию с ссылкой на прокси
                    $pictureNode->appendChild($yml->createCDATASection($proxyUrl));
                }
            }

            if(isset($data[8]))
            {
                $paramElement = $yml->createElement('param', $data[8]);
                $paramElement->setAttribute('name', 'size');
                $offer->appendChild($paramElement);
            }

            if (!empty($data[4])) {
                // Преобразуем JSON-строку в ассоциативный массив

                $jsonString = preg_replace('/,\s*([\]}])/m', '$1', $data[4]);

                $paramsArray = json_decode($jsonString, true, 512, JSON_BIGINT_AS_STRING);

                // Перебираем каждый параметр и добавляем его к товару
                if(!is_null($paramsArray))
                {
                    foreach ($paramsArray as $paramName => $paramValue) {
                        // Создаем элемент param
                        $paramElement = $yml->createElement('param', $paramValue);
                        // Устанавливаем атрибут name
                        $paramElement->setAttribute('name', $paramName);
                        // Добавляем элемент param к товару
                        $offer->appendChild($paramElement);
                    }
                }
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
