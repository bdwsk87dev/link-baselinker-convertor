<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateXmlFilesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('xml_files', function (Blueprint $table) {
            $table->id();
            $table->string('custom_name')->nullable();
            $table->string('description')->nullable();
            $table->string('upload_full_patch');
            $table->string('converted_full_patch');
            $table->string('source_file_link');
            $table->enum('type', ['file','link']);
            $table->timestamp('uploadDateTime')->nullable();
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
        Schema::dropIfExists('xml_files');
    }
}
