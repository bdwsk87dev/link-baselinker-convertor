<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RemoveOnUpdateFromXmlFiles extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('xml_files', function (Blueprint $table) {
            // Удаляем поле 'on_update' из таблицы 'xml_files'
            $table->dropColumn('on_update');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('xml_files', function (Blueprint $table) {
            // Добавляем поле 'on_update' обратно в таблицу 'xml_files'
            $table->boolean('on_update')->default(false);
        });
    }
}
