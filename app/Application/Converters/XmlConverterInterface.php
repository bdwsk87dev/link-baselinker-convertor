<?php

namespace App\Application\Converters;

interface XmlConverterInterface
{
    public function convert
    (
        $uploadFilePath, $params
    );
}
