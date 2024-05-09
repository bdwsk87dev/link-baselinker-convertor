<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUpdateHistoriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('update_histories', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('xmlId');
            $table->unsignedBigInteger('update_id');
            $table->integer('new_products_count');
            $table->integer('not_available_count');
            $table->dateTime('update_time');
            $table->timestamps();

            $table->foreign('xmlId')->references('id')->on('xml_files');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('update_histories');
    }
}
