<?php

namespace App\Http\Controllers;

use App\Application\Converters\ConverterTypeA;
use App\Application\Converters\ConverterTypeB;
use App\Application\Converters\ConverterTypeC;
use App\Application\Converters\ConverterTypeD;
use App\Application\Converters\ConverterTypeE;
use App\Application\FileManager\FileReaders\XmlStructReader;
use App\Application\FileManager\LinkUploader;
use App\Application\FileManager\FileUploader;
use App\Application\FileManager\Uploader;
use App\Application\Translations\XmlTranslator;
use App\Models\TranslatedProduct;
use App\Models\UpdateHistory;
use App\Models\XmlFile;
use App\Application\Translations\DeepLApplication;
use App\Models\XmlSetting;
use DeepL\DeepLException;
use DOMDocument;
use DOMElement;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Response;
use Inertia\ResponseFactory;
use SimpleXMLElement;
use XMLReader;
use function PHPUnit\Framework\never;
use Illuminate\Support\Facades\Response as FacadeResponse;

class XmlFileController extends Controller
{
    private ConverterTypeA|ConverterTypeB|ConverterTypeC|ConverterTypeD|ConverterTypeE $globalConvertor;

    public function  __construct(
        private readonly Uploader         $uploader,
        private readonly ConverterTypeA   $converterTypeA,
        private readonly ConverterTypeB   $converterTypeB,
        private readonly ConverterTypeC   $converterTypeC,
        private readonly ConverterTypeD   $converterTypeD,
        private readonly ConverterTypeE   $converterTypeE,
        private readonly DeepLApplication $deepLApplication,
        private readonly XmlTranslator    $xmlTranslator,
        private readonly XmlStructReader  $xmlStructReader
    ){

    }

    public function get
    (
        $id
    ): \Illuminate\Http\JsonResponse
    {
        $xmlFile = XmlFile::where('id', $id)->first();

        if ($xmlFile)
        {
            return response()->json(
                [
                    'status' => 'ok',
                    'data' => $xmlFile
                ]);
        } else
        {
            return response()->json(
                [
                    'status' => 'error',
                    'message' => 'XmlFile with id ' . $id . ' not found'
                ], 404);
        }
    }

    public function post
    (
        $id,
        Request $request
    )
    {
        // Получаем данные из запроса
        $formData = $request->all();

        // Находим экземпляр модели XmlFile по идентификатору
        $xmlFile = XmlFile::find($id);

        // Если запись не найдена, возвращаем ошибку
        if (!$xmlFile) {
            return response()->json([
                'status' => 'error',
                'message' => 'XmlFile with id ' . $id . ' not found'
            ], 404);
        }

        // Обновляем атрибуты модели из данных запроса
        $xmlFile->update($formData);

        // Возвращаем ответ об успешном обновлении
        return response()->json([
            'status' => 'ok',
            'message' => 'XmlFile updated successfully',
            'xmlFile' => $xmlFile
        ]);
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
        $converterType
    ): void
    {
        switch ($converterType) {
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
            case 'typeE':
                $this->globalConvertor = $this->converterTypeE;
                break;
        }
    }

    public function upload
    (
        Request $request
    ): array
    {
        /* Checking xml type */
        $converterType = $request->input('xmlType');

        $this->prepareConvertor($converterType);

        /* Checking upload type */
        $uploadType = $request->input('uploadType');

        $uploadFilePath = $this->uploader->upload
        (
            $uploadType,
            $request
        );

        /**
         * Конвертируем необходимым конвертером, если это необходимо.
         */
        if ($converterType !== 'None')
        {
            $convertedFilePatch = $this->globalConvertor->convert
            (
                $uploadFilePath,
                [
                    'currency' => $request->input('currency')
                ]
            );
        }
        else
        {
            $convertedFilePatch = $uploadFilePath;
        }

        // Создаём запись в базе данных
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
                'converter_type' => 'classic',
                'classic_converter_name' => $converterType,
                'TLD' => $request->input('tld'),
            ]
        );

        return
            [
                'status' => 'ok'
            ];
    }

    public function update
    (
        $id
    )
    {

        /**
         * Обновлять нужно
         * Цену
         * Наличие
         *
         * Этот обновлятор, так сказать, обновляет цену и наличие обновляет только по принцыпу
         * есть ли товар в новом файле
         *
         * Также он добавляет новые товары, они естественно без перевода. По этому после новых товаров
         * нужно обновить таблицу переведеннных товаров, где общее количество товаров должно соответственно
         * увеличиваться
         *
         * Есть свои исключения в каждом конвертере
         * например
         *
         * Usmall еще дополнительно проверяет поле во время конвертации.
         * Converter A смотрит на Quantity 0
         */

        try
        {

            $globalCurrency = 'PLN';
            $newProductsCount = 0;
            $notAvailableCount = 0;
            $updateProductsCount = 0;
            $errorText = null;
            $hasError = false;
            $errorLine = '';

            /** Отримаємо запис з бази данних поточного xml */
            $query = XmlFile::query()
                ->with
                (
                    ['translatedProducts', 'xmlSettings' => function ($query) {
                        // Загружаем только поле allow_update из связанной таблицы
                        $query->select('id', 'xml_id', 'allow_update');
                    }
                    ]
                );

            $xml = $query->where('id', '=', $id)->first();

            /** Получаем путь к старому файлу, вернее его имя */
            $oldFilePath = basename($xml->converted_full_patch);

            /** Получаем полный путь к старому файлу */
            $oldFilePathFull = storage_path('app/public/uploads/files/' . $oldFilePath);

            /** Проверяем существование файла и еслт что, пробуем найти по старому пути.*/
            if (!file_exists($oldFilePathFull))
            {
                /** Если файл не существует, меняем путь */
                $oldFilePathFull = storage_path('app/public/uploads/xml/' . $oldFilePath);
            }

            /** Подготавливаем конвертер */
            $this->prepareConvertor
            (
                $xml->classic_converter_name
            );

            /**
             * Нужно получить валюту старого файла.
             * Сделать мы это сможем только путём нахождение валюты в первом товаре (offer-е)) в xml
             */
            $oldXmlContents = file_get_contents
            (
                $oldFilePathFull
            );

            $oldXmlDoom = new SimpleXMLElement($oldXmlContents);

            foreach ($oldXmlDoom->shop->offer as $offer) {
                if (isset($offer->currencyId)) {
                    $globalCurrency = (string)$offer->currencyId;
                    break;
                }
            }

            /**
             * Загружаем новый файл, и итолько после этого заменяем старый на него в таблице xml
             * а также старый переносим в папку резервов старых xml
             */

            $uploadFilePath = $this->uploader->remoteLinkUpload
            (
                //'http://diaspar.phpsoft.pro/unibot/actions.php?action=export&table=usmall_products&file=1'
                $xml->source_file_link
            );

            /** Конвертируем новвый файл, согласно актуальному конвертеру */
            $convertedFilePatch = $this->globalConvertor->convert
            (
                $uploadFilePath,
                [
                    'currency' => $globalCurrency
                ]
            );

            /** Синхронизуем xml файлики */
            // Парсим старый XML
            $oldXml = simplexml_load_file($xml->converted_full_patch);

            // Парсим новый XML
            $newXml = simplexml_load_file($convertedFilePatch);

            // Проходим по каждому offer в новом XML
            foreach ($newXml->shop->offer as $newOffer) {
                $offerFound = false;

                // Проходим по каждому offer в старом XML
                foreach ($oldXml->shop->offer as $oldOffer) {

                    // Если найден offer с таким же id, обновляем цену и доступность
                    if ((string)$newOffer->attributes()->id == (string)$oldOffer->attributes()->id) {
                        $oldOffer->price = $newOffer->price; // Обновляем цену

                        // Обновляем доступность
                        $oldOffer['available'] = (string)$newOffer['available'];

                        if((string)$newOffer['available'] == 'false')
                        {
                            $notAvailableCount++;
                        }

                        $updateProductsCount++;
                        $offerFound = true;
                        break;
                    }
                }


                // Если offer из нового XML не найден в старом, копируем его в старый XML
                if (!$offerFound) {
                    $newOfferToAdd = $oldXml->shop->addChild('offer');
                    foreach ($newOffer->attributes() as $key => $value) {
                        $newOfferToAdd->addAttribute($key, $value);
                    }

                    // Добавляем внутренние теги
                    foreach ($newOffer->children() as $child) {
                        $newOfferToAdd->addChild($child->getName(), (string)$child);
                    }

                    $newProductsCount++;
                }
            }

            // Проходим по каждому offer в старом XML
            foreach ($oldXml->shop->offer as $oldOffer) {
                $offerFound = false;

                $found = false;

                // Проходим по каждому offer в новом XML
                foreach ($newXml->shop->offer as $newOffer) {
                    // Если найден offer с таким же id, товар все еще доступен
                    if ((string)$newOffer->attributes()->id == (string)$oldOffer->attributes()->id) {
                        $found = true;
                        break;
                    }
                }

                if (!$found) {
                    $oldOffer['available'] = false;
                    $notAvailableCount++;
                }
            }

            // Сохраняем обновленный старый XML
            $oldXml->asXML($xml->converted_full_patch);

        } catch (\Exception $e)
        {
            $hasError = true;
            $errorText = $e->getMessage();
            $errorLine = $e->getLine();
        }

        if(!$hasError)
        {
            // Нужно поменять общее количество товаров в таблице translated_products что бы было понятно
            // что после апдейта, нужно допереводить товары
            $translatedProduct = TranslatedProduct::query();
            $translatedProduct = $translatedProduct->where('xmlid', '=', $id)->first();

            if ($translatedProduct !== null && $newProductsCount !== null) {
                $translatedProduct->total += $newProductsCount;
                $translatedProduct->save();
            }

            $xml->new_last_update = now(); // Устанавливаем текущую дату и время
            $xml->save(); // Сохраняем изменения в объекте XML
        }

        // БД
        // Проверяем, существует ли запись для данного xmlId
        $lastUpdate = UpdateHistory::where('xmlId', $xml->id)->latest()->first();

        if ($lastUpdate) {
            // Если запись существует, увеличиваем update_id на 1
            $updateId = $lastUpdate->update_id + 1;
        } else {

            // Если записи не существует, устанавливаем update_id равным 1
            $updateId = 1;
        }

        // Creating a record in the table
        UpdateHistory::create
        (
            [
                'xmlId' => $xml->id,
                'update_id' => $updateId,
                'new_products_count' => $newProductsCount,
                'not_available_count' => $notAvailableCount,
                'update_time' => now(),
                'update_offers_count' => $updateProductsCount,
                'error' => $errorText
            ]
        );

        return
            [
                'status' => ($hasError) ? 'false' : 'true',
                'xmlId' => $xml->id,
                'update_id' => $updateId,
                'new_products_count' => $newProductsCount,
                'not_available_count' => $notAvailableCount,
                'update_time' => now(),
                'update_offers_count' => $updateProductsCount,
                'error' => $errorText,
                'error_line' => $errorLine
            ];

    }

    public function upload_from_mapper
    (
        Request $request
    ): array
    {
        /* Checking upload type */
        $uploadType = $request->input('uploadType');

        $uploadFilePath = $this->uploader->upload
        (
            $uploadType,
            $request
        );

        $newXmlFile = XmlFile::create
        (
            [
                'custom_name' => $request->input('customName'),
                'description' => $request->input('description'),
                'upload_full_patch' => $uploadFilePath,
                'converted_full_patch' => '',
                'source_file_link' => $request->input('remoteFileLink') ?: '',
                'uploadDateTime' => now(),
                'type' => $uploadType,
                'original_file_type' => 'xml',
            ]
        );

        $xmlStruct = $this->xmlStructReader->getTags
        (
            $uploadFilePath
        );

        return
            [
                'status' => 'ok',
                'struct' => $xmlStruct
            ];
    }


    public function index
    (
        Request $request
    ): \Inertia\Response | ResponseFactory
    {
        $query = XmlFile::query()
            ->with(['translatedProducts','xmlSettings' => function ($query)
            {
                $query->select('id', 'xml_id', 'allow_update'); // Загружаем только поле allow_update из связанной таблицы
            }]);

        // Якщо обран режим оновлення то повертаэмо тільки записи з лінками. А файли не враховуємо.



        if ($request->has('sort_by') && !empty($request->get('sort_by')))
        {
            $sortColumn = $request->get('sort_by');
            $sortDirection = $request->get('order', 'asc');
            $query->orderBy($sortColumn, $sortDirection);
        }
        else {
            $query->orderBy('id', 'desc');
        }

//        if ($request->has('search'))
//        {
//            $search = $request->get('search');
//            $query->where('custom_name', 'like', "%{$search}%");
//            $query->orWhere('description', 'like', "%{$search}%");
//            $query->orWhere('source_file_link', 'like', "%{$search}%");
//        }

        if ($request->has('search'))
        {
            $search = $request->get('search');
            $query->where(function ($query) use ($search) {
                $query->where('custom_name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('source_file_link', 'like', "%{$search}%");
            });
        }

        if ($request->has('view_mode') &&  $request->get('view_mode') === 'sync')
        {
            $query->where('type', '=', 'link');
        }

        $perPage = $request->get('per_page', 25);
        $xmlFiles = $query->paginate($perPage);

        $data['view_mode'] = $request->get('view_mode', 'view');

        return inertia('list', compact('xmlFiles', 'data'));
    }

    public function show
    (
        $id
    )
    {

        // Получение пути к XML-файлу из базы данных
        $xmlFile = XmlFile::findOrFail($id);
        // Получаем путь к сконвертированному файлу
        $xmlFilePath = $xmlFile->converted_full_patch;

        // Проверка на существование файла
        if (File::exists($xmlFilePath))
        {
            $reader = new XMLReader();
            $reader->open($xmlFilePath);

            // Получаем настройки по данному файалу.
            // Получение процента и описания из XmlSetting
            $setting = XmlSetting::where('xml_id', $id)->first();

            // Обработка только если есть XmlSetting, если нет - файл отображаем как есть
            if ($setting)
            {
                $percent = $setting->price_percent;
                $description = $setting->description ?? '';
                $description_ua = $setting->description_ua ?? '';

                // Создание пустого XML-документа
                $xmlDoc = new DOMDocument('1.0', 'utf-8');
                $xmlDoc->preserveWhiteSpace = false;
                $xmlDoc->formatOutput = true;


                // Create root tag <yml_catalog>
                $ymlCatalog = $xmlDoc->createElement('yml_catalog');
                $ymlCatalog->setAttribute('date', date('Y-m-d')); // Установка атрибута date
                $xmlDoc->appendChild($ymlCatalog);

                // Create shop tag
                $root = $xmlDoc->createElement('shop');
                $ymlCatalog->appendChild($root);

                while ($reader->read())
                {

                    if ($reader->nodeType == XMLReader::ELEMENT && $reader->localName == 'categories') {
                        // Загрузка содержимого категорий
                        $categories = simplexml_load_string($reader->readOuterXML());

                        // Преобразование SimpleXMLElement в DOMElement
                        $domElement = dom_import_simplexml($categories);

                        // Импортирование DOMElement в пустой XML-документ
                        $domElement = $xmlDoc->importNode($domElement, true);

                        // Добавляем узел категорий в корневой элемент
                        $root->appendChild($domElement);
                    }

                    if ($reader->nodeType == XMLReader::ELEMENT && $reader->localName == 'offer')
                    {
                        // Загрузка содержимого offer
                        $offer = simplexml_load_string($reader->readOuterXML());

                        // Update offer price
                        $price = (float) $offer->price * (1 + ($percent / 100));

                        if(isset($setting->delivery_price) && $setting->delivery_price!=='')
                        {
                            $price = $price + $setting->delivery_price;
                        }

                        $newPrice = round($price, 2);

                        $offer->price = $newPrice;


                        // Преобразование SimpleXMLElement в DOMElement
                        $domElement = dom_import_simplexml($offer);

                        // Импортирование DOMElement в пустой XML-документ
                        $domElement = $xmlDoc->importNode($domElement, true);

                        // Добавляем узел offer в корневой элемент
                        $root->appendChild($domElement);

                        $nameNode = $domElement->getElementsByTagName('name')->item(0);
                        $nameUaNode = $domElement->getElementsByTagName('name_ua')->item(0);

                        $sizeParam = null;
                        foreach ($offer->param as $param) {
                            if (isset($param['name']) && (string)$param['name'] === 'size') {
                                $sizeParam = (string)$param;
                                break;
                            }
                        }

                        if ($sizeParam !== null)
                        {
                            if ($nameNode)
                            {
                                $domElement->removeChild($nameNode);
                            }
                            if ($nameUaNode)
                            {
                                $domElement->removeChild($nameUaNode);
                            }
                            if(isset($offer->name) && (string)$offer->name!=='')
                            {
                                $nameCDATA = $xmlDoc->createCDATASection($offer->name. ' '. $sizeParam);
                                $nameNode = $xmlDoc->createElement('name');
                                $nameNode->appendChild($nameCDATA);
                                $domElement->appendChild($nameNode);
                            }


                            if(isset($offer->name_ua) && (string)$offer->name_ua!=='')
                            {
                                $nameUaCDATA = $xmlDoc->createCDATASection($offer->name_ua. ' '. $sizeParam);
                                $nameUaNode = $xmlDoc->createElement('name_ua');
                                $nameUaNode->appendChild($nameUaCDATA);
                                $domElement->appendChild($nameUaNode);
                            }
                        }

                        // Удаление описания
                        $descriptionNode = $domElement->getElementsByTagName('description')->item(0);
                        if ($descriptionNode) {
                            $domElement->removeChild($descriptionNode);
                        }

                        // Удаление описания на украинском языке
                        $descriptionUANode = $domElement->getElementsByTagName('description_ua')->item(0);
                        if ($descriptionUANode) {
                            $domElement->removeChild($descriptionUANode);
                        }

                        // Обновление описания и описания на украинском языке
                        if ($description) {
                            $descriptionCDATA = $xmlDoc->createCDATASection($description . PHP_EOL . $offer->description);
                            $descriptionNode = $xmlDoc->createElement('description');
                            $descriptionNode->appendChild($descriptionCDATA);
                            $domElement->appendChild($descriptionNode);
                        }

                        if ($description_ua) {
                            $descriptionUACDATA = $xmlDoc->createCDATASection($description_ua . PHP_EOL . $offer->description_ua);
                            $descriptionUANode = $xmlDoc->createElement('description_ua');
                            $descriptionUANode->appendChild($descriptionUACDATA);
                            $domElement->appendChild($descriptionUANode);
                        }
                    }
                }
                $reader->close();

                // Возвращаем XML-документ как ответ с заголовком Content-Type: application/xml
                return response($xmlDoc->saveXML())->header('Content-Type', 'application/xml');
            } else {
                // Возвращаем оригинальный контент если нет XmlSetting
                return response()->file($xmlFilePath, ['Content-Type' => 'application/xml']);
            }
        } else {
            // Возвращаем 404 если файл не существует
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
    ): array|\DeepL\Usage
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
    ): array|bool
    {
        return $this->xmlTranslator->translate(
            $request->input('productId'),
            $request->input('apiKey'),
            $request->input('isTranslateName'),
            $request->input('isTranslateDescription')
        );
    }


    public function store
    (
        Request $request
    )
    {
        $xmlId = $request->input('productId');
        $pricePercent = $request->input('pricePercent');
        $newDescription = $request->input('newDescription');
        $newDescriptionUA = $request->input('newDescriptionUA');

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

        $newDescription = str_replace("\n", "<br>", $request->input('newDescription'));
        $newDescriptionUA = str_replace("\n", "<br>", $request->input('newDescriptionUA'));

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
        $xmlData2 = file_get_contents('../FIXER/095.xml');
        // Распарсить XML-данные
        $xmlNew = new SimpleXMLElement($xmlData2);

        /** Перебор каждого товара в XML */
        foreach ($xmlNew->shop->offer as $offer) {
            $descriptionToRemove = '<strong>Доставка з магазину США.</strong><div>Вартість доставки від 278 грн в Україну залежно від розміру та ваги товару.</div><div>Термін доставки: 7-10 днів.</div>';


            $existingDescription = $offer->description;
            // Перевірити, чи існує CDATA-блок
            if (str_contains($existingDescription, '<![CDATA[') && str_contains($existingDescription, ']]>')) {
                // Видалити початковий та кінцевий теги CDATA (<!\[CDATA\[\s* та \s*\]\]>)
                $existingDescription = preg_replace('/^<!\[CDATA\[\s*/', '', $existingDescription);
                $existingDescription = preg_replace('/\s*\]\]>/', '', $existingDescription);
            }

            $newText = str_replace($descriptionToRemove, '', $offer->description);

            unset(
                $offer->description
            );

            $newName = $offer->addChild('description');
            $newCData = dom_import_simplexml($newName);
            $newCData->appendChild
            (
                $newCData->ownerDocument->createCDATASection
                (
                    trim($newText)
                )
            );



            // ua


            $newText = str_replace($descriptionToRemove, '', $offer->description_ua);

            $existingDescription = $offer->description_ua;
            // Перевірити, чи існує CDATA-блок
            if (str_contains($existingDescription, '<![CDATA[') && str_contains($existingDescription, ']]>')) {
                // Видалити початковий та кінцевий теги CDATA (<!\[CDATA\[\s* та \s*\]\]>)
                $existingDescription = preg_replace('/^<!\[CDATA\[\s*/', '', $existingDescription);
                $existingDescription = preg_replace('/\s*\]\]>/', '', $existingDescription);
            }

            unset(
                $offer->description_ua
            );

            $newName = $offer->addChild('description_ua');
            $newCData = dom_import_simplexml($newName);
            $newCData->appendChild
            (
                $newCData->ownerDocument->createCDATASection
                (
                    trim($newText)
                )
            );



        }
        $xmlNew->asXML('../FIXER/95.xml');
        echo '1';
    }

    // /var/www/storage/app/public/uploads/files/USMALL 1 FILE_FIXED.xml
}


// Формат А доступность товара по квантити
// Формат D по доп полю от сергея


//    public function fixer()
//    {
//        $xmlData2 = file_get_contents('../FIXER/95.xml');
//        // Распарсить XML-данные
//        $xmlNew = new SimpleXMLElement($xmlData2);
//
//        /** Перебираем каждый товар в XML */
//        foreach ($xmlNew->shop->offer as $offer) {
//            // Проверяем наличие параметра с атрибутом name равным "size"
//            foreach ($offer->param as $param) {
//                if ((string) $param['name'] === 'size') {
//                    // Добавляем значение атрибута size к имени товара
//                    $offer->name = $offer->name . ' ' . $param;
//                    $offer->name_ua = $offer->name_ua . ' ' . $param;
//                    break; // Прерываем цикл, так как нашли нужный параметр
//                }
//            }
//        }
//
//        // Сохраняем измененный XML в новый файл
//        $xmlNew->asXML('../FIXER/USMALL 1 FILE_FIXED.xml');
//    }



//public function fix()
//{
//    $xmlData2 = file_get_contents('../FIXER/USMALL 1 FILE.xml');
//    // Распарсить XML-данные
//    $xmlNew = new SimpleXMLElement($xmlData2);
//
//    /** Перебираем каждый товар в XML */
//    foreach ($xmlNew->shop->offer as $offer) {
//        // Получаем содержимое description_ua
//        $description = $offer->description_ua;
//
//        // Удаляем возможные дублирующие CDATA-секции
//        $description = preg_replace('/^<!\[CDATA\[\s*/', '<![CDATA[ ', $description);
//        $description = preg_replace('/\s*\]\]>$/s', ' ]]>', $description);
//
//        // Добавляем пробелы между CDATA-секцией и текстом
//        if (strpos($description, '<![CDATA[') !== false) {
//            $description = '<![CDATA[ ' . substr($description, 9);
//        }
//
//        // Заменяем содержимое description_ua на обновленное
//        $offer->description_ua = $description;
//    }
//
//    // Сохраняем измененный XML в новый файл
//    $xmlNew->asXML('../FIXER/A003_R.xml');
//}

//


//    public function fixer()
//    {
//        $xmlData2 = file_get_contents('../FIXER/50.xml');
//        // Распарсить XML-данные
//        $xmlNew = new SimpleXMLElement($xmlData2);
//
//        /** Перебор каждого товара в XML */
//        foreach ($xmlNew->shop->offer as $offer) {
//            $descriptionToRemove = '&lt;strong&gt;Доставка з магазину Європи.&lt;/strong&gt;
//&lt;div&gt;Вартість доставки від 190 грн в Україну залежно від розміру та ваги товару.&lt;/div&gt;
//&lt;div&gt;Термін доставки: 7-10 днів.&lt;/div&gt;';
//
//            $offer->description = str_replace($descriptionToRemove, '', $offer->description);
//            $offer->description_ua = str_replace($descriptionToRemove, '', $offer->description_ua);
//
//
//            $price = (string) $offer->price;
//
//            // Find price value before space
//            preg_match('/^([\d.,]+)\s/', $price, $valueMatches);
//
//            // If space exist
//            if ( isset ( $valueMatches[1] ))
//            {
//                $value = floatval( $valueMatches[1] );
//            }
//            else
//            {
//                $value = $price;
//            }
//
//            // Change price value in offer
//            $offer->price = round($value - (($value / 100) * 10),2) .' '.$offer->currencyId;
//
//        }
//        $xmlNew->asXML('../FIXER/50POPA.xml');
//        echo '1';
//    }




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


// /var/www/storage/app/public/uploads/files/1714466274_1 Woman clothes 100.csv_c_.xml
