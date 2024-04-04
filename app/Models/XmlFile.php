<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class XmlFile extends Model
{
    protected $table = 'xml_files';

    protected $fillable = [
        'custom_name',
        'description',
        'upload_full_patch',
        'converted_full_patch',
        'source_file_link',
        'uploadDateTime',
        'type'
    ];

}
