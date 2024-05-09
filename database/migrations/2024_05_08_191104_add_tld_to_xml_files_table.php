<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddTldToXmlFilesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('xml_files', function (Blueprint $table) {
            $table->string('TLD')->nullable()->after('source_file_link');
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
            $table->dropColumn('TLD');
        });
    }
}
