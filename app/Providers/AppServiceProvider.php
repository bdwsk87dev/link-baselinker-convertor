<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Factories\ConverterFactory;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register(): void
    {
        $this->app->singleton(ConverterFactory::class, function ($app)
        {
            return new ConverterFactory();
        });
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
