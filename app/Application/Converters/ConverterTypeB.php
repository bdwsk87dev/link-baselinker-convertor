<?php

namespace App\Application\Converters;

use DOMDocument;
use DOMException;
use Exception;
use SimpleXMLElement;

class ConverterTypeB implements XmlConverterInterface
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
                $name = htmlspecialchars($product->name, ENT_QUOTES, 'UTF-8');
                $offer->appendChild($yml->createElement('name', $name));
            }

            /** Категория товара */
            if (isset($product->cat)) {
                $offer->appendChild($yml->createElement('category', $product->cat));
            }

            /** Описание товара */
            if (isset($product->desc)) {
                $descriptionContent = htmlspecialchars($product->description, ENT_QUOTES, 'UTF-8');
                $offer->appendChild($yml->createElement('description', $descriptionContent));
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
