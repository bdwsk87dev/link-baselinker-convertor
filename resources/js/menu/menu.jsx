import React from 'react';
import { Head, InertiaLink } from '@inertiajs/inertia-react';

const Menu = () => {
    return (
        <div className='menu'>
            <Head>
                <style>
                    {`
                        .menu {
                            padding: 8px;
                            padding-left: 5px;
                            width: 100%;
                            background: #ffffff;
                            height: auto;
                            box-sizing: border-box;
                            border-top-left-radius: 5px;
                            border-top-right-radius: 5px;
                            display: flex;
                            justify-content: flex-start;
                            align-items: center;
                            margin-bottom:5px;
                        }

                        .menu a {
                          font-size: 14px;
                          text-decoration: none;
                          font-family: Verdana, sans-serif;
                          color: black;
                          padding: 15px;
                          border-right: 1px solid #bbbbbd;
                        }

                        .menu a:hover {
                            color: blue;
                        }
                    `}
                </style>
            </Head>

            <a href="/home">Домашня</a>
            <a href="/upload">Класична конвертація</a>
            <a href="/mapper">Відкрити Mapper</a>
            <a href="/list">Список лінків</a>
            <a href="/deepl">Deepl</a>
            <a href="/logout">Вийти</a>
            {/* Добавьте другие ссылки, если нужно */}
        </div>
    );
};

export default Menu;
