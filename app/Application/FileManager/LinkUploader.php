<?php

namespace App\Application\FileManager;

use GuzzleHttp\Exception\RequestException;
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
        /** Устанавливаем тайм-аут на 60 секунд для HTTP-запроса */
        $timeout = 60;

        /** Получаем имя файла из URL */
        $fileName = time().'_'.basename($remoteFileLink);

        try {
            /** Получаем содержимое файла по ссылке */
            $response = $this->httpClient->timeout($timeout)->get($remoteFileLink);

            /** Проверяем, был ли успешным запрос */
            if ($response->successful())
            {
                $fileContent = $response->body();

                /** Сохраняем содержимое файла в хранилище */
                Storage::put('public/uploads/files/'.$fileName, $fileContent);

                /** Возвращаем путь к загруженному файлу */
                return Storage::path('public/uploads/files/'.$fileName);
            } else {
                /** Обработка ошибки запроса */
                throw new \Exception('Failed to download file: ' . $response->status());
            }
        } catch (RequestException $e) {

            /** Обработка ошибок запроса */
            throw new \Exception('HTTP request failed: ' . $e->getMessage());

        } catch (\Exception $e) {

            /** Обработка всех остальных ошибок */
            throw new \Exception('An error occurred: ' . $e->getMessage());

        }
    }
}
