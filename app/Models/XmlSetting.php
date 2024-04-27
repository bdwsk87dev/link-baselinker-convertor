<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class XmlSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'xml_id',
        'allow_update',
        'price_percent',
        'description',
        'description_ua',
    ];
}
