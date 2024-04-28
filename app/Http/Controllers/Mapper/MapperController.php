<?php

namespace App\Http\Controllers\Mapper;

use App\Application\FileManager\FileReaders\csvReader;
use App\Application\FileManager\FileReaders\XmlStructReader;
use App\Application\FileManager\Uploader;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class MapperController extends Controller
{


    public function __construct
    (
        private readonly Uploader        $uploader,
        private readonly XmlStructReader $xmlReader,
        private readonly CsvReader       $csvReader
    )
    {

    }

    /**
     * @param $uploadType
     * @param Request $request
     * @return string
     *
     * Return full patch of upload file.
     */
    public function fileUpload
    (
        $uploadType,
        Request $request
    )
    {
        return $this->uploader->upload
        (
            $uploadType,
            $request
        );
    }


    /**
     * @param $filePath
     * @param $fileType
     * @return false
     *
     * Collect oll tags of the file
     */
    public function getFileTags
    (
        $filePath,
        $fileType
    )
    {
        return match ($fileType) {
            'xml' => $this->xmlReader->getTags
            (
                $filePath
            ),
            'csv' => $this->csvReader->getTags
            (
                $filePath
            ),
            default => false,
        };
    }
}
