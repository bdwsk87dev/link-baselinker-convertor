<?php

namespace App\Http\Controllers;

use App\Application\FileManager\Uploader;
use App\Models\XmlFile;
use Illuminate\Http\Request;

class CsvFileController
{


    public function  __construct(
        private readonly Uploader $uploader,
    ){

    }

    public function upload_from_mapper
    (
        Request $request
    ): array
    {
        /* Checking upload type */
        $uploadType = $request->input('uploadType');

        $uploadFilePath = $this->uploader->upload
        (
            $uploadType,
            $request
        );


        $newXmlFile = XmlFile::create
        (
            [
                'custom_name' => $request->input('customName'),
                'description' => $request->input('description'),
                'upload_full_patch' => $uploadFilePath,
                'converted_full_patch' => '',
                'source_file_link' => $request->input('remoteFileLink') ?: '',
                'uploadDateTime' => now(),
                'type' => $uploadType,
                'original_file_type' => 'xml'
            ]
        );

        $xmlStruct = $this->xmlStructReader->getTags
        (
            $uploadFilePath
        );

    }

}
