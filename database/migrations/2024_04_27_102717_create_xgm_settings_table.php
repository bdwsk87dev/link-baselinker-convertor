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
        Schema::create('xml_settings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('xml_id');
            $table->boolean('allow_update')->default(false);
            $table->integer('price_percent')->nullable();
            $table->text('description')->nullable();
            $table->text('description_ua')->nullable();
            $table->timestamps();

            $table->foreign('xml_id')->references('id')->on('xml_files');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('xgm_settings');
    }
};
