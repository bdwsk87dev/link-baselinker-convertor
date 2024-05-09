<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class XmlFile extends Model
{
    // Assign table
    protected $table = 'xml_files';

    protected $fillable = [
        'custom_name',
        'description',
        'upload_full_patch',
        'converted_full_patch',
        'source_file_link',
        'uploadDateTime',
        'type',
        'converter_type',
        'classic_converter_name',
        'mapper_converter_id',
        'TLD'
    ];

    public function translatedProducts
    (
    ): HasOne
    {
        return $this->hasOne(
            TranslatedProduct::class,
            'xmlid',
            'id'
        );
    }

    public function xmlSettings
    (
    ): HasOne
    {
        return $this->hasOne(
            XmlSetting::class,
            'xml_id',
            'id');
    }
}
