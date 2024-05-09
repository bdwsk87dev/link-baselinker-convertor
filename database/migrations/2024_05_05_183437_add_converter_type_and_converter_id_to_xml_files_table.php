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
        Schema::table('xml_files', function (Blueprint $table) {
            $table->enum('converter_type', ['classic', 'mapper'])->nullable();
            $table->string('classic_converter_name')->nullable();
            $table->unsignedBigInteger('mapper_converter_id')->nullable();
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
            $table->dropColumn('converter_type');
            $table->dropColumn('classic_converter_name');
            $table->dropColumn('mapper_converter_id');
        });
    }
};
