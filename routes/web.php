<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\XmlFileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

ini_set('upload_max_filesize', '100M');

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('welcome');

Route::middleware(['auth'])->group(function () {

    Route::get('/logout', [AuthController::class, 'logout'])->name('logout');

    Route::get('/home', function () {
        return Inertia::render('home');
    })->name('home');

    Route::post('/api/upload', [XmlFileController::class, 'upload'])->name('xml.upload');

    Route::post('/delete/{id}', [XmlFileController::class, 'delete'])->name('xml.delete');

    Route::post('/api/deepl/translate', [XmlFileController::class, 'translate'])->name('xml.translate');

    Route::post('/api/deepl/usage', [XmlFileController::class, 'deeplUsage'])->name('xml.deeplusage');

    Route::get('/list', [XmlFileController::class, 'index'])->name('xml.list');

    Route::get('/get-completion-percentage', [XmlFileController::class, 'getCompletionPercentage']);

    Route::get('/api/get-translated-products-count/{id}', [XmlFileController::class, 'getTranslatedCount']);

    // Route::get('/fixer', [XmlFileController::class, 'fix']);
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
