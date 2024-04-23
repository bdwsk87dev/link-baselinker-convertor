<?php

namespace App\Http\Controllers;

use App\Application\Converters\ConverterTypeA;
use App\Application\Converters\ConverterTypeB;
use App\Application\Converters\ConverterTypeC;
use App\Application\Converters\ConverterTypeD;
use App\Application\FileManager\LinkUploader;
use App\Application\FileManager\FileUploader;
use App\Application\FileManager\Uploader;
use App\Application\Translations\XmlTranslator;
use App\Models\XmlFile;
use App\Application\Translations\DeepLApplication;
use DeepL\DeepLException;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Response;
use Inertia\ResponseFactory;
use SimpleXMLElement;
use function PHPUnit\Framework\never;

class XmlFileController extends Controller
{
    private ConverterTypeA|ConverterTypeB|ConverterTypeC|ConverterTypeD $globalConvertor;

    public function  __construct(
        private readonly Uploader $uploader,
        private readonly ConverterTypeA   $converterTypeA,
        private readonly ConverterTypeB   $converterTypeB,
        private readonly ConverterTypeC   $converterTypeC,
        private readonly ConverterTypeD   $converterTypeD,
        private readonly DeepLApplication $deepLApplication,
        private readonly XmlTranslator    $xmlTranslator
    ){

    }

    public function getTranslatedCount
    (
        $id
    ): array
    {
        return $this->xmlTranslator->getTranslatedCount
        (
            $id
        );
    }

    public function prepareConvertor
    (
        $XmlType
    ): void
    {
        switch ($XmlType) {
            case 'typeA':
                $this->globalConvertor = $this->converterTypeA;
                break;
            case 'typeB':
                $this->globalConvertor = $this->converterTypeB;
                break;
            case 'typeC':
                $this->globalConvertor = $this->converterTypeC;
                break;
            case 'typeD':
                $this->globalConvertor = $this->converterTypeD;
                break;
        }
    }

    public function upload(Request $request)
    {

        /* Checking xml type */
        $XmlType = $request->input('xmlType');
        $this->prepareConvertor($XmlType);

        /* Checking upload type */
        $uploadType = $request->input('uploadType');

        $uploadFilePath = $this->uploader->upload
        (
            $uploadType,
            $request
        );

        // Конвертируем
        $convertedFilePatch = $this->globalConvertor->convert
        (
            $uploadFilePath,
            [
                'currency' => $request->input('currency')
            ]
        );

        XmlFile::create
        (
            [
                'custom_name' => $request->input('customName'),
                'description' => $request->input('description'),
                'upload_full_patch' => $uploadFilePath,
                'converted_full_patch' => $convertedFilePatch,
                'source_file_link' => $request->input('remoteFileLink') ?: '',
                'uploadDateTime' => now(),
                'type' => $uploadType,
            ]
        );

        return
            [
                'status' => 'ok'
            ];
    }


    public function index
    (
        Request $request
    ): \Inertia\Response | ResponseFactory
    {
        $query = XmlFile::query();

        $query->with('translatedProducts');

        if ($request->has('sort_by') && !empty($request->get('sort_by')))
        {
            $sortColumn = $request->get('sort_by');
            $sortDirection = $request->get('order', 'asc');
            $query->orderBy($sortColumn, $sortDirection);
        }
        else {
            $query->orderBy('id', 'desc');
        }

        if ($request->has('search'))
        {
            $search = $request->get('search');
            $query->where('custom_name', 'like', "%{$search}%");
            $query->orWhere('description', 'like', "%{$search}%");
            $query->orWhere('source_file_link', 'like', "%{$search}%");
        }

        $perPage = $request->get('per_page', 30);
        $xmlFiles = $query->paginate($perPage);

        return inertia('list', compact('xmlFiles'));
    }

    public function show
    (
        $id
    )
    {
        $xmlFile = XmlFile::findOrFail($id);
        if (File::exists($xmlFile->converted_full_patch))
        {
            $content = File::get($xmlFile->converted_full_patch);
            return Response::make($content, 200, [
                'Content-Type' => 'application/xml',
            ]);
        } else {
            abort(404);
        }
    }

    public function delete
    (
        $id
    ): \Illuminate\Http\RedirectResponse
    {
        $xmlFile = XmlFile::findOrFail($id);

        // Удалите файл с сервера
        if (File::exists($xmlFile->converted_full_patch)) {
            File::delete($xmlFile->converted_full_patch);
        }

        if (File::exists($xmlFile->upload_full_patch)) {
            File::delete($xmlFile->upload_full_patch);
        }

        // Удалите запись из базы данных
        $xmlFile->delete();

        return redirect()->back()->with('success', 'File and record deleted successfully.');
    }

    public function deeplUsage
    (
        Request $request
    )
    {
        $apiKey = $request->input('apiKey');
        try {
            $usageResponse = $this->deepLApplication->usage($apiKey);
        } catch (DeepLException $e) {
            return
                [
                    'status' => 'error',
                    'message' => $e->getMessage()
                ];
        }
        return $usageResponse;
    }

    public function translate
    (
        Request $request
    )
    {
        return $this->xmlTranslator->translate(
            $request->input('productId'),
            $request->input('apiKey'),
            $request->input('isTranslateName'),
            $request->input('isTranslateDescription')
        );
    }


    public function fix()
    {
        $xmlData2 = file_get_contents('../FIXER/A003.xml');
        // Распарсить XML-данные
        $xmlNew = new SimpleXMLElement($xmlData2);

        /** Перебираем каждый товар в XML */
        foreach ($xmlNew->shop->offer as $offer) {
            // Получаем содержимое description_ua
            $description = $offer->description_ua;

            // Удаляем возможные дублирующие CDATA-секции
            $description = preg_replace('/^<!\[CDATA\[\s*/', '<![CDATA[ ', $description);
            $description = preg_replace('/\s*\]\]>$/s', ' ]]>', $description);

            // Добавляем пробелы между CDATA-секцией и текстом
            if (strpos($description, '<![CDATA[') !== false) {
                $description = '<![CDATA[ ' . substr($description, 9);
            }

            // Заменяем содержимое description_ua на обновленное
            $offer->description_ua = $description;
        }

        // Сохраняем измененный XML в новый файл
        $xmlNew->asXML('../FIXER/A003_R.xml');
    }

    /**
     * @throws Exception
     */
    public function modify
    (
        Request $request
    ): array
    {
        // Get xml id
        $xmlId = $request->input('productId');

        // Get percent
        $percent = $request->input('newPrice');
        $isChangePrice = $request->input('isChangePrice');

        // Descriptions
        $isChangeDescription = $request->input('isChangeDescription');
        $isChangeDescriptionUA = $request->input('isChangeDescriptionUA');

        $newDescription = $request->input('newDescription');
        $newDescriptionUA = $request->input('newDescriptionUA');

        if ( XmlFile::where( 'id', $xmlId )->exists() )
        {
            $xmlFile = XmlFile::where( 'id', $xmlId )->first();
            $xmlData = file_get_contents( $xmlFile->converted_full_patch );
        }
        else {
            return
                [
                    'status' => 'fail',
                    'message' => 'xml by id not found'
                ];
        }

        $currentTime = date('md_His');
        $backupFileName = $xmlFile->converted_full_patch . '_old_' . $currentTime . '.xml';

        // Write duplicate xml file
        file_put_contents(
            $backupFileName,
            $xmlData
        );

        $xmlNew = new SimpleXMLElement($xmlData);

        foreach ($xmlNew->shop->offer as $offer)
        {
            if ( $isChangePrice )
            {
                /*
                * Find price value before space ( currency get from other offer tag )
                * Цена может быть 33.23 PLN или 23.12
                */

                // Price string from xml offer
                $price = (string) $offer->price;

                // Find price value before space
                preg_match('/^([\d.,]+)\s/', $price, $valueMatches);

                // If space exist
                if ( isset ( $valueMatches[1] ))
                {
                    $value = floatval( $valueMatches[1] );
                }
                else
                {
                    $value = $price;
                }

                // Change price value in offer
                $offer->price = round($value + (($value / 100) * $percent),2) .' '.$offer->currencyId;

            }

            if ( $isChangeDescription === 'true' )
            {
                // Отримати поточний текст у CDATA-блоку
                $existingDescription = $offer->description;

                // Перевірити, чи існує CDATA-блок
                if (str_contains($existingDescription, '<![CDATA[') && str_contains($existingDescription, ']]>'))
                {
                    // Видалити початковий та кінцевий теги CDATA (<!\[CDATA\[\s* та \s*\]\]>)
                    $existingDescription = preg_replace('/^<!\[CDATA\[\s*/', '', $existingDescription);
                    $existingDescription = preg_replace('/\s*\]\]>/', '', $existingDescription);
                }

                // Update description
                $newDescriptionText = $newDescription . ' ' . PHP_EOL . $existingDescription;

                unset(
                    $offer->description
                );

                $newName = $offer->addChild('description');
                $newCData = dom_import_simplexml($newName);
                $newCData->appendChild
                (
                    $newCData->ownerDocument->createCDATASection
                    (
                        $newDescriptionText
                    )
                );

            }

            if ( $isChangeDescriptionUA === 'true' )
            {

                // Отримати поточний текст у CDATA-блоку
                $existingDescriptionUA = $offer->description_ua;

                // Перевірити, чи існує CDATA-блок
                if (str_contains($existingDescriptionUA, '<![CDATA[') && str_contains($existingDescriptionUA, ']]>')) {
                    // Видалити початковий та кінцевий теги CDATA (<!\[CDATA\[\s* та \s*\]\]>)
                    $existingDescriptionUA = preg_replace('/^<!\[CDATA\[\s*/', '', $existingDescriptionUA);
                    $existingDescriptionUA = preg_replace('/\s*\]\]>/', '', $existingDescriptionUA);
                }

                // Створити новий текст з комбінацією нового та поточного
                $newText = $newDescriptionUA . ' ' . PHP_EOL . $existingDescriptionUA;

                unset(
                    $offer->description_ua
                );

                $newName = $offer->addChild('description_ua');
                $newCData = dom_import_simplexml($newName);
                $newCData->appendChild
                (
                    $newCData->ownerDocument->createCDATASection
                    (
                        $newText
                    )
                );
            }
        }

        $xmlNew->asXML($xmlFile->converted_full_patch);

        return
            [
                'status' => 'ok'
            ];
    }

    public function fixer()
    {
        $xmlData2 = file_get_contents('../FIXER/50.xml');
        // Распарсить XML-данные
        $xmlNew = new SimpleXMLElement($xmlData2);

        /** Перебор каждого товара в XML */
        foreach ($xmlNew->shop->offer as $offer) {
            $descriptionToRemove = '&lt;strong&gt;Доставка з магазину Європи.&lt;/strong&gt;
&lt;div&gt;Вартість доставки від 190 грн в Україну залежно від розміру та ваги товару.&lt;/div&gt;
&lt;div&gt;Термін доставки: 7-10 днів.&lt;/div&gt;';

            $offer->description = str_replace($descriptionToRemove, '', $offer->description);
            $offer->description_ua = str_replace($descriptionToRemove, '', $offer->description_ua);


            $price = (string) $offer->price;

            // Find price value before space
            preg_match('/^([\d.,]+)\s/', $price, $valueMatches);

            // If space exist
            if ( isset ( $valueMatches[1] ))
            {
                $value = floatval( $valueMatches[1] );
            }
            else
            {
                $value = $price;
            }

            // Change price value in offer
            $offer->price = round($value - (($value / 100) * 10),2) .' '.$offer->currencyId;

        }
        $xmlNew->asXML('../FIXER/50POPA.xml');
        echo '1';
    }

}


//public function fix()
//{
//    $xmlData = file_get_contents('../FIXER/Type_A_2_BL__Products__Nova_Post_XML_2024-04-08_21_24_produkt.xml');
//    // Распарсить XML-данные
//    $xml = new SimpleXMLElement($xmlData);
//
//    $ids = [];
//    foreach ($xml->product as $product) {
//        $ids[] = (string)$product->ean;
//    }
//
//    $xmlData2 = file_get_contents('../FIXER/document to fix.xml');
//    // Распарсить XML-данные
//    $xmlNew = new SimpleXMLElement($xmlData2);
//
//    /** Перебор каждого товара в XML */
//    $o = 0;
//    foreach ($xmlNew->shop->offer as $offer) {
//        $id = $ids[$o];
//        $offer['id'] = $id;
//        $o++;
//    }
//    $xmlNew->asXML('../FIXER/PPPOPA.xml');
//}

//public function fix()
//{
//    $xmlData2 = file_get_contents('../FIXER/Final_without_cdata.xml');
//    // Распарсить XML-данные
//    $xmlNew = new SimpleXMLElement($xmlData2);
//
//    /** Перебираем каждый товар в XML */
//    foreach ($xmlNew->shop->offer as $offer) {
//        // Создаем CDATA-секцию и вставляем в нее содержимое description_ua
//        $cdata = $offer->description_ua;
//        $descriptionWithCDATA = '<![CDATA[' . $cdata . ']]>';
//        $offer->description_ua = $descriptionWithCDATA;
//    }
//
//
//    $xmlNew->asXML('../FIXER/Final_with_cdata.xml');
//}
