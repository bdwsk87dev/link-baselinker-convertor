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
        Schema::table('xml_settings', function (Blueprint $table) {
            $table->decimal('delivery_price', 10, 2)->nullable()->after('description_ua');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('xml_settings', function (Blueprint $table) {
            $table->dropColumn('delivery_price');
        });
    }
};
