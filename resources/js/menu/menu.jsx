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
                            padding-left:15px;
                        }

                        .menu a {
                            font-size: 16px;
                            text-decoration: none;
                            font-family: Verdana, sans-serif;
                            color: white;
                            padding: 15px;
                            padding-right: 70px;
                            background:#16A177;
                            margin-right: 1px;
                            padding-left: 15px;
                            border:1px solid #16A177;
                        }

                        .menu a:hover {
                            font-size: 16px;
                            text-decoration: none;
                            font-family: Verdana, sans-serif;
                            color: #16A177;
                            padding: 15px;
                            padding-right: 70px;
                            background:#ffffff;
                            margin-right: 1px;
                            padding-left: 15px;
                            border:1px solid #16A177;
                        }



                    `}
                </style>
            </Head>

            <a href="/home">Домашня</a>
            <a href="/upload">Класична конвертація</a>
            <a href="/mapper/xml">Mapper xml</a>
            <a href="/mapper/csv">Mapper csv</a>
            <a href="/list">Список лінків</a>
            <a href="/deepl">Deepl</a>
            <a href="/logout">Вийти</a>
            {/* Добавьте другие ссылки, если нужно */}
        </div>
    );
};

export default Menu;
