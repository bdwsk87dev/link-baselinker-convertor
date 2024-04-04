<?php

namespace App\Application\Translations;

use DeepL\DeepLException;
use DeepL\TextResult;
use DeepL\Translator;
use DeepL\Usage;

class DeepLApplication
{

    /**
     * @throws DeepLException
     */
    private function getTranslator($apiKey): Translator
    {
        return new Translator($apiKey);
    }

    /**
     * @throws DeepLException
     */
    public function translate(array $data, $apiKey): array|TextResult
    {
        return $this->getTranslator($apiKey)->translateText(
            $data['text'], null, $data['lang'],
            [
                'preserve_formatting' => true,
                'tag_handling' => 'html',
                'outline_detection' => false
            ]
        );
    }

    /**
     * @throws DeepLException
     */
    public function usage($apiKey): Usage
    {
        return $this->getTranslator($apiKey)->getUsage();
    }


}
