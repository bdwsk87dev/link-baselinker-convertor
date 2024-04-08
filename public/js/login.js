import{r as o,R as e,H as u}from"./app.js";import{a as d}from"./axios.js";const f=()=>{const[n,c]=o.useState(""),[s,i]=o.useState(""),[l,r]=o.useState(null),m=async t=>{t.preventDefault();try{const a=await d.post("/login",{email:n,password:s});switch(r(null),a.data.error_code){case"user_not_found":r("Такого користувача не існує!");break;case"correctly_fields":r("Заповніть правильно форму ");break;default:r(a.data.error_message)}}catch(a){r(a.message)}};return e.createElement("form",{onSubmit:m},e.createElement("div",null,e.createElement(u,null,e.createElement("style",null,`
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
                    `)),e.createElement("div",{className:"form-container"},e.createElement("h1",null,"Вхід"),l&&e.createElement("div",{className:"error-message"},l),e.createElement("label",null,"Логін ( email ) :"),e.createElement("input",{type:"text",value:n,onChange:t=>c(t.target.value)}),e.createElement("label",null,"Пароль :"),e.createElement("input",{type:"password",value:s,onChange:t=>i(t.target.value)}),e.createElement("button",{type:"submit"},"Увійти"))))};export{f as default};
