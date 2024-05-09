<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ChangeLastUpdateTypeInXmlFiles extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('xml_files', function (Blueprint $table) {
            // Удаляем старое поле 'last_update'
            $table->dropColumn('last_update');

            // Добавляем новое поле 'new_last_update' с типом datetime
            $table->dateTime('new_last_update')->nullable();
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
            // Удаляем новое поле 'new_last_update'
            $table->dropColumn('new_last_update');

            // Восстанавливаем старое поле 'last_update' обратно с типом timestamp
            $table->timestamp('last_update')->nullable();
        });
    }
}
