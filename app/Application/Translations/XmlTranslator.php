<?php

namespace App\Application\Translations;

use App\Models\XmlFile;
use DeepL\DeepLException;
use Exception;
use http\Client\Request;
use Illuminate\Support\Facades\DB;
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
        $xmlID,
        $apiKey,
        $isTranslateName,
        $isTranslateDescription
    )
    {

        try {

            $dom = new \DOMDocument();

            $translatedCount = 0;

            $xmlFile = XmlFile::where('id', $xmlID)->first();
            if ($xmlFile)
            {
                $convertedFullPatch = $xmlFile->converted_full_patch;
            } else
            {
                return false;
            }

            $xmlData = file_get_contents($convertedFullPatch);

            // Распарсить XML-данные
            $xml = new SimpleXMLElement($xmlData);

            $totalProducts = count($xml->shop->offer);

            // Массив для хранения уникальных имен товаров
            $uniqueNames = [];

            $i = 0;

            /** Перебор каждого товара в XML */
            foreach ($xml->shop->offer as $offer)
            {
                $i++;
                if($i>100000){
                    break;
                }

                $translatedCount++;

                // Get current product name
                $name = (string)$offer->name;

                $uniqueId = $name;

                if (!isset($uniqueNames[$uniqueId]))
                {

                    // Check translation conditions
                    if ($isTranslateName === 'true' && $offer->name_ua == '')
                    {
                        // Вызов метода перевода для имени товара
                        $translatedName = $this->deepL->translate(
                            [
                                'text' => $name,
                                null,
                                'lang' => 'uk'
                            ],
                            $apiKey
                        );

                        // Добавляем название в массив уникальных имен
                        $uniqueNames[$uniqueId] = $translatedName->text;

                        unset($offer->name_ua);

                        $newName = $offer->addChild('name_ua');
                        $newNameNode = dom_import_simplexml($newName);

                        $newNameNode->appendChild(
                            $newNameNode->ownerDocument->createCDATASection
                            (
                                $translatedName->text
                            )
                        );
                    }

                }
                else
                {
                    unset($offer->name_ua);

                    $newName = $offer->addChild('name_ua');
                    $newNameNode = dom_import_simplexml($newName);

                    $newNameNode->appendChild(
                        $newNameNode->ownerDocument->createCDATASection
                        (
                            $uniqueNames[$uniqueId]
                        )
                    );
                }

//                if ($isTranslateDescription === 'true' && $offer->description_ua == '') {
//                    // Вызов метода перевода для описания товара
//                    $translatedDescription = $this->deepL->translate(
//                        [
//                            'text' => $description,
//                            null,
//                            'lang' => 'uk'
//                        ],
//                        $apiKey
//                    );
//
//                    unset($offer->description_ua);
//                    $newDescription = $offer->addChild('description_ua');
//                    $newDescriptionNode = dom_import_simplexml($newDescription);
//                    $newDescriptionNode->appendChild($newDescriptionNode->ownerDocument->createCDATASection($translatedDescription->text));
//                }

                DB::table('translated_products')->updateOrInsert
                (
                    [
                        'xmlid' => $xmlID
                    ],
                    [
                        'translatedCount' => $translatedCount,
                        'total' => $totalProducts
                    ]
                );

                // Сохранять XML в файл после каждого десятка товаров
                if ($translatedCount % 10 === 0) {
                    $xml->asXML($convertedFullPatch);
                }

            }
            // Сохранить обновленный XML в файл
            $xml->asXML($convertedFullPatch);

            return
                [
                    'status' => 'ok'
                ];

        } catch (DeepLException| Exception $e) {
            return
                [
                    'status' => 'error',
                    'message' => $e->getMessage()
                ];
        }
    }

    public function getTranslatedCount(
        $id
    ){
        // Executing a database query to get the number of translated products
        $translatedData = DB::table('translated_products')
            ->where('xmlid', $id)
            ->first();

        // If the record is found, we return the number of translated items and the total number of items.
        if ($translatedData) {
            return [
                'translated' => $translatedData->translatedCount,
                'totalProducts' => $translatedData->total,
            ];
        } else {
            return [
                'translated' => 0,
                'totalProducts' => 0,
            ];
        }
    }
}
