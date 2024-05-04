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


            if(isset($data['delivery_price']))
            {
                $data['delivery_price'] = (float) $data['delivery_price'];
            }

            if (array_key_exists('price_percent', $data) && $data['price_percent'] === "null") {
                $data['price_percent'] = null;
            }
            if (array_key_exists('delivery_price', $data) && $data['delivery_price'] === "null") {
                $data['delivery_price'] = null;
            }

            if (array_key_exists('delivery_price', $data) && is_null($data['delivery_price'])) {
                $data['delivery_price'] = null;
            }

            if (array_key_exists('description', $data) && $data['description'] === "null") {
                $data['description'] = null;
            }


            if (array_key_exists('description_ua', $data) && $data['description_ua'] === "null") {
                $data['description_ua'] = null;
            }



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
            dd($e->getMessage());
            return response()->json([
                'status' => 'fail',
                'message' => 'Помилка при зберіганні налаштуваня.'
            ], 500);
        }

    }
}
