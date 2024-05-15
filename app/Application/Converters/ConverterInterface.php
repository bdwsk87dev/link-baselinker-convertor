<?php

namespace App\Application\Converters;

interface ConverterInterface
{
    public function convert(string $uploadFilePath, array $params): string;
}
