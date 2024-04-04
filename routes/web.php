<?php

use App\Http\Controllers\XmlFileController;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

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

    Route::post('/api/translate', [XmlFileController::class, 'translate'])->name('xml.translate');

    Route::get('/list', [XmlFileController::class, 'index'])->name('xml.list');

    Route::get('/get-completion-percentage', [XmlFileController::class, 'getCompletionPercentage']);
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
