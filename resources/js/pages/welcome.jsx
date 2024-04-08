import React from 'react';
import {Head, InertiaLink} from '@inertiajs/inertia-react';

const Welcome = () => {
    return (
        <div>
            <Head>
                <style>{`
                        body{
                            height: 100%;
                            background: #161616;
                            font-family: Verdana, sans-serif; /* добавляем шрифт Verdana */
                        }
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
                    `}</style>
            </Head>

            <div>
                <div className="form-container">
                    <h1>CONVERTEDZILLA</h1>
                    <p>Please login to access the service.</p>
                    <InertiaLink href="/login">Login</InertiaLink>
                </div>
            </div>
        </div>
    );
};

export default Welcome;
