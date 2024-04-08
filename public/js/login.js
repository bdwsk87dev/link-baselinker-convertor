import{r as o,R as e,H as d}from"./app.js";import{a as u}from"./axios.js";const f=()=>{const[n,c]=o.useState(""),[l,i]=o.useState(""),[s,t]=o.useState(null),m=async r=>{r.preventDefault();try{const a=await u.post("/login",{email:n,password:l});switch(t(null),a.data.status==="ok"&&(location.href="/home"),a.data.error_code){case"user_not_found":t("Такого користувача не існує!");break;case"correctly_fields":t("Заповніть правильно форму ");break;default:t(a.data.error_message)}}catch(a){t(a.message)}};return e.createElement("div",null,e.createElement(d,null,e.createElement("style",null,`
                        body{
                            height: 100%;
                            background: #161616;
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
                        .error-message{
                        margin-bottom:15px;
                        color:blue;
                        }
                    `)),e.createElement("form",{onSubmit:m},e.createElement("div",null,e.createElement("div",{className:"form-container"},e.createElement("h1",null,"Вхід"),s&&e.createElement("div",{className:"error-message"},s),e.createElement("label",null,"Логін ( email ) :"),e.createElement("input",{type:"text",value:n,onChange:r=>c(r.target.value)}),e.createElement("label",null,"Пароль :"),e.createElement("input",{type:"password",value:l,onChange:r=>i(r.target.value)}),e.createElement("button",{type:"submit"},"Увійти")))))};export{f as default};
