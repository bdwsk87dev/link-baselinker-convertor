<?php

namespace App\Http\Controllers\Api\V1\ConverterPattern\Store;

use App\Http\Controllers\Controller;
use App\Models\ConverterPattern;

use Illuminate\Http\Request;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;

class ConverterPatternStoreV1Controller extends Controller
{

    public function store
    (
        Request $request
    ) : JsonResponse
    {
        try {

            $data = $request->input();

            $pattern = ConverterPattern::create(
                $data
            );

            return response()->json(
                [
                    'status' => 'ok',
                    'message' => 'Паттерн збережено.',
                    'data' => $pattern
                ], 201);

        }  catch (QueryException $e) {
            return response()->json([
                'status' => 'fail',
                'message' => 'Помилка при зберіганні паттерну.'.$e->getMessage()
            ], 500);
        }

    }
}
