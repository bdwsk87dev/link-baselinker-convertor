<?php

namespace App\Application\Converters;

use DOMDocument;
use Illuminate\Support\Facades\Storage;
use SimpleXMLElement;

class ConverterTypeA
{
    public function __construct(){
    }

    public function convert(
        $uploadFilePath,
        $convertedFileName
    ){


        //$xmlData = file_get_contents(storage_path('app/public/uploads/originals/1711436825_11 BL__Produkty__domylny_XML_2024-02-14_15_36.xml'));

        $xmlData = file_get_contents($uploadFilePath);


        // Создаем объект SimpleXMLElement из данных XML
        $xml = new SimpleXMLElement($xmlData);



        // Доступ к корневому элементу <shop>
        $shop = $xml;

        // Создание YML-документа
        $yml = new DOMDocument('1.0', 'utf-8');
        $yml->appendChild($yml->createElement('yml_catalog'));
        $yml->documentElement->setAttribute('date', date('Y-m-d'));

        // Добавление информации о магазине
        $shop = $yml->documentElement->appendChild($yml->createElement('shop'));
        // ... (остальная часть кода без изменений)

        // Добавление категорий
        $categories = $shop->appendChild($yml->createElement('categories'));

        // Исправленный способ создания элемента категории
        $categoryElement = $yml->createElement('category');
        $categoryElement->setAttribute('id', '1');
        $categoryElement->appendChild($yml->createTextNode('Zabawki'));
        $categories->appendChild($categoryElement);

        // Аналогично для остальных категорий
        $categoryElement = $yml->createElement('category');
        $categoryElement->setAttribute('id', '2');
        $categoryElement->appendChild($yml->createTextNode('Dla dzieci'));
        $categories->appendChild($categoryElement);

        $categoryElement = $yml->createElement('category');
        $categoryElement->setAttribute('id', '3');
        $categoryElement->appendChild($yml->createTextNode('Psi Patrol'));
        $categories->appendChild($categoryElement);
        // Обработка товаров
        foreach ($xml->product as $product) {
            $offer = $shop->appendChild($yml->createElement('offer'));

            // ID товара
            $offer->setAttribute('id', $product->product_id);

            // Название товара
            $offer->appendChild($yml->createElement('name', $product->name));

            // Категория товара
            $categoryId = match ($product->category_name) {
                'Główna' => '1',
                default => null,
            };
            if ($categoryId) {
                $offer->appendChild($yml->createElement('categoryId', $categoryId));
            }

            // Цена
            $offer->appendChild($yml->createElement('price', $product->price));

            // Валюта
            $offer->appendChild($yml->createElement('currencyId', 'PLN'));

            // Описание
            $offer->appendChild($yml->createElement('description', $product->description));

            // Изображения
            foreach ($product->image as $image) {
                $offer->appendChild($yml->createElement('picture', $image));
            }

            // Дополнительные параметры
            foreach ($product->attributes->attribute as $attribute) {
                $offer->appendChild($yml->createElement('param', [
                    'name' => $attribute->attribute_name,
                    'value' => $attribute->attribute_value,
                ]));
            }
        }

        // Сохранение YML-файла
        $yml->save($convertedFileName);
    }
}
