import{R as e,H as r,I as n}from"./app.js";const a=()=>e.createElement("div",null,e.createElement(r,null,e.createElement("style",null,`
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
                    `)),e.createElement("div",null,e.createElement("div",{className:"form-container"},e.createElement("h1",null,"CONVERTEDZILLA"),e.createElement("p",null,"Please login to access the service."),e.createElement(n,{href:"/login"},"Login"))));export{a as default};
