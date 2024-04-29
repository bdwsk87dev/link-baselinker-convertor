<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ImageProxyController extends Controller
{
    public function getImage(Request $request)
    {
        // Получаем URL изображения из запроса
        $imageUrl = urldecode($request->input('url'));

        // Делаем запрос к URL изображения
        $response = Http::get($imageUrl);

        // Проверяем, успешно ли выполнен запрос
        if ($response->successful()) {
            // Получаем тип содержимого из заголовка
            $contentType = $response->header('Content-Type');

            // Генерируем уникальное имя файла на основе URL-адреса изображения
            $fileName = basename($imageUrl);

            // Возвращаем изображение с соответствующим заголовком content-type и именем файла
            return response($response->body())->header('Content-Type', $contentType)
                ->header('Content-Disposition', 'inline; filename="' . $fileName . '"');
        } else {
            // Если запрос не удался, возвращаем ошибку 404
            return response()->json(['error' => 'Image not found'], 404);
        }
    }
}

// docker logs -f www_php_1 | tail
