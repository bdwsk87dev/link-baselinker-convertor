<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(AuthRequest $request): JsonResponse | RedirectResponse
    {
        $request->validated();
        // Валидация прошла успешно благодаря AuthRequest

        if (Auth::attempt(
            [
                'email' => $request->input('email'),
                'password' => $request->input('password')
            ]))
        {
            // Авторизация прошла успешно
            return response()->json(
                [
                    'status' => 'ok'
                ],200
            );

        } else {
            // Неверные учетные данные
            return response()->json(
                [
                    'status' => 'failed',
                    'error_code' => 'user_not_found'
                ],200
            );
        }
    }

    public function register(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255'
            ],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                'unique:users'
            ],
            'password' => [
                'required',
                'string',
                'min:8',
                'confirmed'
            ],
        ]);

        User::create(
            [
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => bcrypt($data['password']),
            ]
        );

        return redirect()->intended('/upload');
    }

    public function logout(Request $request): RedirectResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/');
    }
}
