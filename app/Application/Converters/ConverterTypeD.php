<?php

namespace App\Application\Converters;

use DOMDocument;

class ConverterTypeD implements ConverterInterface
{
    public function __construct()
    {

    }

    public function categoryFixet
    (
        $category
    )
    {
        $parts = explode(';', $category, 4); // Разделяем строку по символу ';' и берем только первые 4 элемента
        $fixedCategory = implode(';', array_slice($parts, 0, 3)); // Берем только первые 3 элемента и объединяем их обратно через ';'
        return $fixedCategory;
    }

    /**
     * @throws DOMException
     * @throws Exception
     */
    public function convert
    (
        $uploadFilePath,
        $params
    ):string
    {
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

            if (isset($data[9]))
            {
                $categoryName = $this->categoryFixet((string) $data[9]);

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
            if ($first)
            {
                $first = false;
                continue;
            }

            /** Создаём тег offer */
            $offer = $shop->appendChild($yml->createElement('offer'));

            /** ID товара */
            $offer->setAttribute('id', $data[0]);

            /** Available */
            if(isset($data[13]) && (string) $data[13] == '0')
            {
                $offer->setAttribute('available', 'false');
            }
            else
            {
                $offer->setAttribute('available', 'true');
            }

            /** Категория товара */
            if(isset($data[9]))
            {
                $categoryName = $this->categoryFixet((string) $data[9]);
                if(isset($categories[$categoryName]))
                {
                    $offer->appendChild($yml->createElement('categoryId', $categories[$categoryName]['id']));
                }
            }
            else
            {
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
            if(isset($data[1]))
            {
                $nameElement = $offer->appendChild($yml->createElement('vendor'));
                $nameElement->appendChild($yml->createCDATASection(trim($data[1])));
            }

            /** Vendor Code */
            $offer->appendChild($yml->createElement('vendorCode', ''));

            /** country_of_origin */
            $offer->appendChild($yml->createElement('country_of_origin', ''));

            /** URL товара */
            if(isset($data[14]))
            {
                $nameElement = $offer->appendChild($yml->createElement('url'));
                $nameElement->appendChild($yml->createCDATASection(trim($data[14])));
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
            if(isset($data[11]))
            {
                $pictureNode = $offer->appendChild($yml->createElement('picture'));
                $pictureNode->appendChild($yml->createCDATASection(trim($data[11])));
            }

//            if(isset($data[10]))
//            {
//                $images = explode("; ", $data[10]);
//
//                $currentUrl = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https://' : 'http://';
//                $currentUrl .= $_SERVER['HTTP_HOST'];
//
//                $foundImage = false;
//                $fileName = '';
//
//                foreach ($images as $image)
//                {
//                    // Если URL-адрес начинается с "https://app.", пропускаем его
//                    if (strpos(urldecode($image), 'https://app.') === 0)
//                    {
//                        continue;
//                    }
//
//                    $fileName = basename($image);
//
//                    $proxyUrl = $currentUrl . '/images/usmall/' . urlencode($fileName);
//
//                    $pictureNode = $offer->appendChild($yml->createElement('picture'));
//                    $pictureNode->appendChild($yml->createCDATASection($proxyUrl));
//
//                    // Помечаем, что изображение было найдено
//                    $foundImage = true;
//
//                    // Прерываем цикл после добавления первого подходящего URL-адреса
//                    break;
//                }
//
//                // Если изображение не было найдено, пропускаем товар
//                if (!$foundImage) {
//                    continue;
//                }
//
//                if (!file_exists(public_path('/images/usmall/' . urlencode($fileName)))){
//                    continue;
//                }
//            }

            if(isset($data[8]))
            {
                $value = htmlspecialchars($data[8], ENT_QUOTES | ENT_XML1, 'UTF-8');

                $paramElement = $yml->createElement('param', $value);
                $paramElement->setAttribute('name', 'size');
                $offer->appendChild($paramElement);
            }

            if (!empty($data[4]))
            {
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

        // Определяем, чтобы XML был красиво отформатирован с отступами и переносами строк
        $yml->formatOutput = true;

        /** Сохранение YML-файла */
        $yml->save($uploadFilePath.'_'.time()."_c_.xml");
        return $uploadFilePath.'_'.time()."_c_.xml";
    }

    public function lettersToNumbers($input, $catCount): string
    {
        $input = mb_strtoupper($input, 'UTF-8');

        $letterNumberMap = [
            'A' => 1, 'B' => 2, 'C' => 3, 'D' => 4, 'E' => 5,
            'F' => 6, 'G' => 7, 'H' => 8, 'I' => 9, 'J' => 10,
            'K' => 11, 'L' => 12, 'M' => 13, 'N' => 14, 'O' => 15,
            'P' => 16, 'Q' => 17, 'R' => 18, 'S' => 19, 'T' => 20,
            'U' => 21, 'V' => 22, 'W' => 23, 'X' => 24, 'Y' => 25,
            'Z' => 26, 'Ł' => 27, 'Ó' => 28, 'ł' => 29, 'ó' => 30,
            'А' => 31, 'Б' => 32, 'В' => 33, 'Г' => 34, 'Д' => 35,
            'Е' => 36, 'Ё' => 37, 'Ж' => 38, 'З' => 39, 'И' => 40,
            'Й' => 41, 'К' => 42, 'Л' => 43, 'М' => 44, 'Н' => 45,
            'О' => 46, 'П' => 47, 'Р' => 48, 'С' => 49, 'Т' => 50,
            'У' => 51, 'Ф' => 52, 'Х' => 53, 'Ц' => 54, 'Ч' => 55,
            'Ш' => 56, 'Щ' => 57, 'Ъ' => 58, 'Ы' => 59, 'Ь' => 60,
            'Э' => 61, 'Ю' => 62, 'Я' => 63,
            'а' => 64, 'б' => 65, 'в' => 66, 'г' => 67, 'д' => 68,
            'е' => 69, 'ё' => 70, 'ж' => 71, 'з' => 72, 'и' => 73,
            'й' => 74, 'к' => 75, 'л' => 76, 'м' => 77, 'н' => 78,
            'о' => 79, 'п' => 80, 'р' => 81, 'с' => 82, 'т' => 83,
            'у' => 84, 'ф' => 85, 'х' => 86, 'ц' => 87, 'ч' => 88,
            'ш' => 89, 'щ' => 90, 'ъ' => 91, 'ы' => 92, 'ь' => 93,
            'э' => 94, 'ю' => 95, 'я' => 96,
            '+' => 97, // Добавляем символ '+'
        ];

        $result = '';

        // Проходим по каждому символу в строке
        for ($i = 0; $i < mb_strlen($input, 'UTF-8'); $i++) {
            $char = mb_substr($input, $i, 1, 'UTF-8');

            // Если символ буква и есть в таблице соответствия, добавляем число в результат
            if (isset($letterNumberMap[$char])) {
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
