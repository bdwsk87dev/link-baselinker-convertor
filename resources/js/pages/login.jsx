import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Head } from "@inertiajs/inertia-react";
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null); // Изначально установим ошибки в null

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('/login', { email, password });
            setError(null);

            switch (response.data.error_code)
            {
                case 'user_not_found':
                    setError('Такого користувача не існує!');
                    break;
                case 'correctly_fields':
                    setError('Заповніть правильно форму ');
                    break;
                default:
                    setError(response.data.error_message);
            }
        } catch (error) {
           setError(error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <Head>
                    <style>{`
                        /* Основной контейнер формы */
                        .form-container {
                            max-width: 700px;
                            margin: 0 auto;
                            padding: 20px;
                            border: 1px solid #ccc;
                            border-radius: 5px;
                            background: #fff;
                            font-size:14px;
                            font-family: Verdana, sans-serif; /* добавляем шрифт Verdana */
                        }
                        /* Стили для инпутов и кнопки */
                        .form-container input,
                        .form-container button {
                            display: block;
                            width: 100%;
                            margin-top:5px;
                            margin-bottom: 10px;
                            padding: 8px;
                            border: 1px solid #ccc;
                            border-radius: 3px;
                            box-sizing: border-box; /* учтитываем ширину и высоту внутренних границ */
                            font-size:14px;
                        }
                        .form-container button {
                            background-color: #007bff;
                            color: #fff;
                            border: none;
                            border-radius: 3px;
                            cursor: pointer;
                        }
                        .form-container button:hover {
                            background-color: #0056b3;
                        }
                        .error-message{
                        margin-bottom:15px;
                        color:blue;
                        }
                    `}</style>
                </Head>
                <div className="form-container">
                    <h1>Вхід</h1>
                    {error && <div className="error-message">{error}</div>}
                    <label>
                        Логін ( email ) :
                    </label>
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label>
                        Пароль :
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit">Увійти</button>
                </div>
            </div>
        </form>
    );
};

export default Login;
