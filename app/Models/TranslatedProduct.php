<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TranslatedProduct extends Model
{
    protected $fillable = [
        'xmlid',
        'translatedCount',
        'total'
    ];

    public function xmlFile()
    {
        return $this->belongsTo(XmlFile::class, 'xml_file_id', 'id');
    }
}
