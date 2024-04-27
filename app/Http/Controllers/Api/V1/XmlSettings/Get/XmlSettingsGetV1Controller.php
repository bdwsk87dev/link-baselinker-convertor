<?php

namespace App\Http\Controllers\Api\V1\XmlSettings\Get;

use App\Http\Controllers\Api\V1\XmlSettings\Store\XmlSettingsStoreV1Request;
use App\Http\Controllers\Controller;
use App\Models\XmlSetting;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;

class XmlSettingsGetV1Controller extends Controller
{
    public function getById
    (
        $id
    ) : JsonResponse
    {
        try
        {
            $xgmSetting = XmlSetting::where('xml_id', $id)->first();

            if (!$xgmSetting) {
                return response()->json(
                    [
                        'status' => 'not_found'
                    ], 404);
            }

            return response()->json(
                [
                    'status' => 'ok',
                    'data' => $xgmSetting
                ], 200);

        } catch (QueryException $e)
        {
            return response()->json(
                [
                    'status' => 'fail'
                ], 500);
        }
    }
}
