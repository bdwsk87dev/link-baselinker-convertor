<?php

namespace App\Application\FileManager;

use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Client\Factory as HttpClient;

class LinkUploader
{
    protected $httpClient;

    public function __construct(
        HttpClient $httpClient
    )
    {
        $this->httpClient = $httpClient;
    }

    public function upload(
        $remoteFileLink,
    ): string
    {

        // Получаем имя файла из URL
        $fileName = basename($remoteFileLink);

        // Получаем содержимое файла по ссылке
        $fileContent = $this->httpClient->get($remoteFileLink)->body();

        // Сохраняем содержимое файла в хранилище
        Storage::put('public/uploads/originals/'.'L_'.$fileName.'.xml', $fileContent);

        // Возвращаем путь к загруженному файлу
        return Storage::path('public/uploads/originals/'.'L_'. $fileName.'.xml');
    }
}
