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

            $translatedCount = 0;

            $xmlFile = XmlFile::where('id', $xmlID)->first();
            if ($xmlFile) {
                $convertedFullPatch = $xmlFile->converted_full_patch;
            } else {
                return false;
            }

            $xmlData = file_get_contents($convertedFullPatch);

            // Распарсить XML-данные
            $xml = new SimpleXMLElement($xmlData);

            $totalProducts = count($xml->shop->offer);

            /** Перебор каждого товара в XML */
            foreach ($xml->shop->offer as $offer) {

                $translatedCount++;

                // Получить данные товара
                $id = $offer['id'];
                $name = (string)$offer->name;
                $description = (string)$offer->description;

                // Проверить условия перевода
                if ($isTranslateName === 'true' ) {
                    // Вызов метода перевода для имени товара
                    $translatedName = $this->deepL->translate(
                        [
                            'text' => $name,
                            null,
                            'lang' => 'uk'
                        ],
                        $apiKey
                    );

                    // Замена переведенного имени в XML
                    $offer->name_ua = $translatedName->text;
                }

                if ($isTranslateDescription === 'true') {
                    // Вызов метода перевода для описания товара
                    $translatedDescription = $this->deepL->translate(
                        [
                            'text' => $description,
                            null,
                            'lang' => 'uk'
                        ],
                        $apiKey
                    );
                    // Замена переведенного описания в XML
                    $offer->description_ua = $translatedDescription->text;
                }

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

    public function getTranslatedCount($id){
        // Выполняем запрос к базе данных для получения количества переведенных товаров
        $translatedData = DB::table('translated_products')->where('xmlid', $id)->first();

        // Если запись найдена, возвращаем количество переведенных товаров и общее количество товаров
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
