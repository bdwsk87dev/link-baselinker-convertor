<?php

namespace App\Providers;

use App\Application\Converters\ConverterTypeA;
use App\Application\Converters\ConverterTypeB;
use Illuminate\Support\ServiceProvider;
use League\CommonMark\ConverterInterface;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
