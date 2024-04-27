<?php

namespace App\Application\FileManager\FileReaders;

class CsvReader
{
    public function getTags
    (
        $filePath
    ): bool|array
    {
        // Открываем CSV файл для чтения
        $file = fopen($filePath, 'r');

        // Читаем первую строку из файла
        $tags = fgetcsv($file);

        // Закрываем файл
        fclose($file);

        // Возвращаем массив полей
        return $tags;
    }
}
