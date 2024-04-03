<?php

namespace App\Application\Converters;

use DOMDocument;
use SimpleXMLElement;

class ConverterTypeB
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

        /** Создание YML-документа */
        $yml = new DOMDocument('1.0', 'utf-8');
        $yml->appendChild($yml->createElement('yml_catalog'));
        $yml->documentElement->setAttribute('date', date('Y-m-d'));

        /** Добавление информации о магазине */
        $shop = $yml->documentElement->appendChild($yml->createElement('shop'));

        /** Обработка товаров */
        foreach ($xml->o as $product) {
            /** Создаём тег offer */
            $offer = $shop->appendChild($yml->createElement('offer'));

            /** ID товара */
            if (isset($product['id'])) {
                $offer->setAttribute('id', $product['id']);
            }

            /** URL товара */
            if (isset($product['url'])) {
                $offer->setAttribute('url', $product['url']);
            }

            /** Цена товара */
            if (isset($product['price'])) {
                $offer->setAttribute('price', $product['price']);
            }

            /** Название товара */
            if (isset($product->name)) {
                $offer->appendChild($yml->createElement('name', $product->name));
            }

            /** Категория товара */
            if (isset($product->cat)) {
                $offer->appendChild($yml->createElement('category', $product->cat));
            }

            /** Описание товара */
            if (isset($product->desc)) {
                $offer->appendChild($yml->createElement('description', $product->desc));
            }

            /** Картинки товара */
            if (isset($product->imgs->main['url'])) {
                $pictureNode = $offer->appendChild($yml->createElement('picture'));
                $pictureNode->appendChild($yml->createCDATASection($product->imgs->main['url']));
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
        $yml->save($uploadFilePath . "_converted.xml");

    }
}
