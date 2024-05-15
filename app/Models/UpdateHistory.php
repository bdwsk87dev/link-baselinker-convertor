<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UpdateHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'xmlId',
        'update_id',
        'new_products_count',
        'not_available_count',
        'update_time',
        'update_offers_count',
        'error',
        'backup_file_path',
        'offer_price_updates'
    ];
}
