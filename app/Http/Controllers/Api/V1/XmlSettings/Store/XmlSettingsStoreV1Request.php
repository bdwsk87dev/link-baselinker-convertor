<?php

namespace App\Http\Controllers\Api\V1\XmlSettings\Store;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\Log;

class XmlSettingsStoreV1Request extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'xml_id' => 'required',
            'price_percent' => 'nullable|numeric',
            'description' => 'nullable|string',
            'description_ua' => 'nullable|string',
        ];
    }

    protected function failedValidation
    (
        Validator $validator
    ): void
    {
        $messages = $validator->errors()->messages();
        $formattedMessages = [];

        foreach ($messages as $field => $fieldMessages) {
            $formattedMessages[] = implode(' ', array_map(function ($message) use ($field) {
                return "$field -> $message";
            }, $fieldMessages));
        }

        $response = response()->json([
            'status' => 'failed',
            'error_message' => 'Invalid request data : '.implode(' ', $formattedMessages),
        ], 422);

        Log::debug('Invalid request data', $messages);

        throw new HttpResponseException($response);

    }

}
