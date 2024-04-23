<?php

namespace App\Application\FileManager;

use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;

class Uploader
{

    public function __construct(
        private readonly FileUploader $uploader,
        private readonly LinkUploader $linkUploader,
    )
    {

    }

    public function upload
    (
        String $uploadType,
        Request $request
    ): string
    {

        return match ($uploadType) {
            'file' => $this->uploader->upload(
                $request->file('file')
            ),
            'link' => $this->linkUploader->upload(
                $request->input('remoteFileLink')
            ),
            default => false,
        };
    }
}
