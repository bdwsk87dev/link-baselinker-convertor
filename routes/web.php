<?php

use App\Http\Controllers\Api\V1\XmlSettings\Get\XmlSettingsGetV1Controller;
use App\Http\Controllers\Api\V1\XmlSettings\Store\XmlSettingsStoreV1Controller;
use App\Http\Controllers\Api\V1\ConverterPattern\Store\ConverterPatternStoreV1Controller;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\ImageProxyController;
use App\Http\Controllers\XmlFileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

ini_set('upload_max_filesize', '100M');

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('welcome');

Route::get('/proxy/image', [ImageProxyController::class, 'getImage']);

Route::middleware(['auth'])->group(function () {

    Route::get('/logout', [AuthController::class, 'logout'])->name('logout');

    Route::get('/home', function () {
        return Inertia::render('home');
    })->name('home');

    Route::get('/upload', function () {
        return Inertia::render('upload');
    })->name('upload');

    Route::post('/api/upload', [XmlFileController::class, 'upload'])->name('xml.upload');

    // Для того что бы обновить товары мы должны получить id xml и по нему получить тип
    // парсера и его номер.
    Route::get('/api/update/{id}', [XmlFileController::class, 'update'])->name('xml.update');

    Route::get('/api/xml/get/{id}', [XmlFileController::class, 'get'])->name('xml.get');
    Route::post('/api/xml/get/{id}', [XmlFileController::class, 'post'])->name('xml.post');

    Route::post('/delete/{id}', [XmlFileController::class, 'delete'])->name('xml.delete');

    Route::post('/api/deepl/translate', [XmlFileController::class, 'translate'])->name('xml.translate');

    Route::post('/api/deepl/usage', [XmlFileController::class, 'deeplUsage'])->name('xml.deeplusage');

    Route::get('/list', [XmlFileController::class, 'index'])->name('xml.list');

    Route::get('/get-completion-percentage', [XmlFileController::class, 'getCompletionPercentage']);

    Route::get('/api/get-translated-products-count/{id}', [XmlFileController::class, 'getTranslatedCount']);

    Route::get('/fixer', [XmlFileController::class, 'fixer']);

    // XML API
    // store settings
    Route::post('/api/xml/settings/store', [XmlSettingsStoreV1Controller::class, 'store']);

    // get settings
    Route::get('/api/xml/settings/get/{id}', [XmlSettingsGetV1Controller::class, 'getById']);

    // Mapper
    // XML

    Route::get('/mapper/xml', function () {
        return Inertia::render('mapperXML');
    })->name('mapperXML');

    // CSV
    Route::get('/mapper/csv', function () {
        return Inertia::render('mapperCSV');
    })->name('mapperCSV');

    // Upload xlm file
    Route::post('/api/xml/file/upload',
        [
            XmlFileController::class, 'upload_from_mapper'
        ])
        ->name('xml.upload');

    // store converter pattern
    Route::post('/api/converter/pattern/store',
        [
            ConverterPatternStoreV1Controller::class, 'store'
        ]);

    // Upload csv file
    Route::post('/api/csv/file/upload',
        [
            CsvFileController::class, 'upload_from_mapper'
        ])
        ->name('xml.upload');




});


Route::middleware(['guest'])->group(function () {

    Route::get('/login', function () {
        return Inertia::render('login');
    })->name('login');

    Route::post('/login', [AuthController::class, 'login']);

    Route::get('/register', function () {
        return Inertia::render('register');
    })->name('register');

    Route::post('/register', [AuthController::class, 'register']);
});


Route::get('/api/show/{id}', [XmlFileController::class, 'show'])->name('xml.show');
