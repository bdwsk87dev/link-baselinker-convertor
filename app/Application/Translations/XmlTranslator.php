<?php

namespace App\Application\Translations;

use App\Models\XmlFile;
use SimpleXMLElement;

class XmlTranslator
{

    public function  __construct(
        private readonly DeepLApplication $deepL,
    ){

    }


    /**
     * @throws \Exception
     */
    public function translate
    (
        $productId,
        $apiKey,
        $isTranslateName,
        $isTranslateDescription
    )
    {
        $xmlFile = XmlFile::where('id', $productId)->first();
        if ($xmlFile) {
            $convertedFullPatch = $xmlFile->converted_full_patch;
        } else {
            return false;
        }

        $xmlData = file_get_contents($convertedFullPatch);

        // Распарсить XML-данные
        $xml = new SimpleXMLElement($xmlData);

        // Перебор каждого товара в XML
        foreach ($xml->shop->offer as $offer) {
            // Получить данные товара
            $id = $offer['id'];
            $name = (string) $offer->name;
            $description = (string) $offer->description;

            // Проверить условия перевода
            if ($isTranslateName) {
                // Вызов метода перевода для имени товара
                $translatedName = $this->deepL->translate(
                    [
                        'text' => $name,
                        null,
                        'uk'
                    ],
                    $apiKey
                );
                // Замена переведенного имени в XML
                $offer->name = $translatedName;
            }

            if ($isTranslateDescription) {
                // Вызов метода перевода для описания товара
                $translatedDescription = $this->deepL->translate(
                    [
                        'text' => $description,
                        null,
                        'uk'
                    ],
                    $apiKey
                );
                // Замена переведенного описания в XML
                $offer->description = $translatedDescription;
            }
        }
        // Сохранить обновленный XML в файл
        $xml->asXML($convertedFullPatch);

        return true;
    }
}