<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('converter_patterns', function (Blueprint $table) {
            $table->id();
            $table->string('tag_product')->nullable();
            $table->string('category_type')->nullable();
            $table->string('category_name')->nullable();
            $table->string('product_name')->nullable();
            $table->string('product_id')->nullable();
            $table->string('description')->nullable();
            $table->string('tag_price')->nullable();
            $table->string('tag_image')->nullable();
            $table->string('image_parse_type')->nullable();
            $table->string('image_separator')->nullable();
            $table->string('tag_param')->nullable();
            $table->boolean('price_fix')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('converter_pattern');
    }
};
