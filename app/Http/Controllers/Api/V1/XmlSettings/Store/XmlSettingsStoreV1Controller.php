<?php

namespace App\Http\Controllers\Api\V1\XmlSettings\Store;

use App\Http\Controllers\Controller;
use App\Models\XmlSetting;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;

class XmlSettingsStoreV1Controller extends Controller
{

    public function store
    (
        XmlSettingsStoreV1Request $request
    ) : JsonResponse
    {
        try {

            $data = $request->validated();

            $xgmSetting = XmlSetting::updateOrCreate
            (
                [
                    'xml_id' => $data['xml_id']
                ],
                $data
            );

            return response()->json(
                [
                    'status' => 'ok',
                    'message' => 'Налаштування збережені.',
                    'data' => $xgmSetting
                ], 201);

        }  catch (QueryException $e) {
            return response()->json([
                'status' => 'fail',
                'message' => 'Помилка при зберіганні налаштуваня.'
            ], 500);
        }

    }
}
