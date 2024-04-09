<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTranslatedProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('translated_products', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('xmlid');
            $table->integer('translatedCount');
            $table->integer('total');
            $table->timestamps();

            // Define foreign key constraint
            $table->foreign('xmlid')->references('id')->on('xml_files')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('translated_products');
    }
}
