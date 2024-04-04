<?php

namespace App\Application\FileManager;

use Illuminate\Support\Facades\Storage;

class Uploader
{
    public function __construct(){
    }

    public function upload(
        $file
    ): string
    {
        $fileName = time().'_'.
            $file->getClientOriginalName();

        $file->storeAs('public/uploads/xml/', "F_".$fileName);
        return Storage::path('public/uploads/xml/'."F_".$fileName);
    }
}
