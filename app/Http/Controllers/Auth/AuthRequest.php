<?php

namespace App\Http\Controllers\Auth;


use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Response;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;


class AuthRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => ['required', 'email'],
            'password' => ['required'],
        ];
    }


    protected function failedValidation(Validator $validator)
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
            'error_code' => 'correctly_fields',
            'error_message' => 'Invalid request data : '.implode(' ', $formattedMessages),
        ], 200);

        Log::debug('Invalid request data', $messages);

        throw new HttpResponseException($response);
    }
}
