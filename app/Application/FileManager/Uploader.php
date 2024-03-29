<?php

namespace App\Application\FileManager;

use Illuminate\Support\Facades\Storage;

class Uploader
{
    public function __construct(){
    }

    public function upload(
        $file,
        $fileName
    ): string
    {
        $file->storeAs('public/uploads/originals/', $fileName);
        return Storage::path('public/uploads/originals/' . $fileName);
    }
}
