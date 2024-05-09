<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddLastUpdateToXmlFiles extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('xml_files', function (Blueprint $table) {
            // Добавляем поле 'last_update' в таблицу 'xml_files'
            $table->timestamp('last_update')->nullable()->after('description');
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
            // Удаляем поле 'last_update' из таблицы 'xml_files'
            $table->dropColumn('last_update');
        });
    }
}
