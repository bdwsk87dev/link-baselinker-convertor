<?php

namespace App\Application\FileManager;

use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Client\Factory as HttpClient;

class LinkUploader
{
    protected HttpClient $httpClient;

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
        $fileName = time().'_'.basename($remoteFileLink);

        // Получаем содержимое файла по ссылке
        $fileContent = $this->httpClient->get($remoteFileLink)->body();

        // Сохраняем содержимое файла в хранилище
        Storage::put('public/uploads/files/'.$fileName, $fileContent);

        // Возвращаем путь к загруженному файлу
        return Storage::path('public/uploads/files/'.$fileName);
    }
}
