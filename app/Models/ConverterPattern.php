<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConverterPattern extends Model
{
    use HasFactory;

    protected $fillable = [
        'tag_product',
        'category_type',
        'category_name',
        'product_name',
        'product_id',
        'description',
        'price',
        'tag_price',
        'tag_image',
        'image_parse_type',
        'image_separator',
        'tag_param',
        'price_fix',
    ];
}
