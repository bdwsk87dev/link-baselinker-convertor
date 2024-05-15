<?php

namespace App\Factories;

use App\Application\Converters\ConverterTypeA;
use App\Application\Converters\ConverterTypeB;
use App\Application\Converters\ConverterTypeC;
use App\Application\Converters\ConverterTypeD;
use App\Application\Converters\ConverterTypeE;

class ConverterFactory
{
    public function createConverter(string $type)
    {
        return match ($type)
        {
            'typeA' => app(ConverterTypeA::class),
            'typeB' => app(ConverterTypeB::class),
            'typeC' => app(ConverterTypeC::class),
            'typeD' => app(ConverterTypeD::class),
            'typeE' => app(ConverterTypeE::class),
            default => throw new \InvalidArgumentException("Unknown converter type: $type"),
        };
    }
}
