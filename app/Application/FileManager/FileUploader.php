<?php

namespace App\Application\FileManager;

use Illuminate\Support\Facades\Storage;

class FileUploader
{
    public function __construct(){
    }

    public function upload(
        $file
    ): string
    {
        $fileName = time().'_'.
            $file->getClientOriginalName();

        $file->storeAs('public/uploads/files/', $fileName);
        return Storage::path('public/uploads/files/'.$fileName);
    }
}
