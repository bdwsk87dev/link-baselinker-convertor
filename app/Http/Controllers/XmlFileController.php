<?php

namespace App\Http\Controllers;

use App\Application\Converters\ConverterTypeA;
use App\Application\Converters\ConverterTypeB;
use App\Application\Converters\ConverterTypeC;
use App\Application\FileManager\LinkUploader;
use App\Application\FileManager\Uploader;
use App\Application\Translations\XmlTranslator;
use App\Models\XmlFile;
use App\Application\Translations\DeepLApplication;
use DeepL\DeepLException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Response;
use SimpleXMLElement;

class XmlFileController extends Controller
{
    private ConverterTypeA|ConverterTypeB|ConverterTypeC $globalConvertor;

    public function  __construct(
        private readonly Uploader $uploader,
        private readonly LinkUploader $linkUploader,
        private readonly ConverterTypeA $converterTypeA,
        private readonly ConverterTypeB $converterTypeB,
        private readonly ConverterTypeC $converterTypeC,
        private readonly DeepLApplication $deepLApplication,
        private readonly XmlTranslator $xmlTranslator
    ){

    }

    public function getTranslatedCount
    (
        $id
    )
    {
        return $this->xmlTranslator->getTranslatedCount(
            $id
        );
    }


    public function prepareConvertor($XmlType){

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
        }
    }

    public function upload(Request $request)
    {

        /* Cheking xml type */
        $XmlType = $request->input('xmlType');
        $this->prepareConvertor($XmlType);

        /* Cheking upload type */
        $uploadType = $request->input('uploadType');

        switch ($uploadType) {

            case 'file':

                // Загружаем оригинальный файл на сервер
                $uploadFilePath = $this->uploader->upload(
                    $request->file('file')
                );

                break;

            case 'link':

                // Загружаем оригинальный файл на сервер
                $uploadFilePath = $this->linkUploader->upload(
                    $request->input('remoteFileLink')
                );

                break;

            default:
                return false;
                break;
        }

        // Конвертируем
        $convertedFilePatch = $this->globalConvertor->convert
        (
            $uploadFilePath,
            [
                'currency' => $request->input('currency')
            ]
        );

        XmlFile::create([
            'custom_name' => $request->input('customName'),
            'description' => $request->input('description'),
            'upload_full_patch' => $uploadFilePath,
            'converted_full_patch' => $convertedFilePatch,
            'source_file_link' => $request->input('remoteFileLink') ?: '',
            'uploadDateTime' => now(),
            'type' => $uploadType,
        ]);

        echo "Готово!";
    }


    public function index
    (
        Request $request
    ): \Inertia\Response|\Inertia\ResponseFactory
    {
        $xmlFiles = XmlFile::query();

        if ($request->has('sort_by') && !empty($request->get('sort_by')))
        {
            $sortColumn = $request->get('sort_by');
            $sortDirection = $request->get('order', 'asc');
            $xmlFiles->orderBy($sortColumn, $sortDirection);
        }

        if ($request->has('search'))
        {
            $search = $request->get('search');
            $xmlFiles->where('custom_name', 'like', "%{$search}%");
            $xmlFiles->orWhere('description', 'like', "%{$search}%");
            $xmlFiles->orWhere('source_file_link', 'like', "%{$search}%");
        }

        $perPage = $request->get('per_page', 30);
        $xmlFiles = $xmlFiles->paginate($perPage);

        return inertia('list', compact('xmlFiles'));
    }

    public function show
    (
        $id
    )
    {
        $xmlFile = XmlFile::findOrFail($id);
        if (File::exists($xmlFile->converted_full_patch)) {
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
