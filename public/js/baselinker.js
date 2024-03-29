import{r as n,R as e,H as P,d as S}from"./app.js";function L(){const[a,i]=n.useState("none"),[m,C]=n.useState({}),[r,o]=n.useState(""),[u,p]=n.useState(""),[g,v]=n.useState([]),[c,b]=n.useState([]),[l,s]=n.useState(""),[d,E]=n.useState("3008835-3032017-6DJYSAMAPZR3WFS0MN9KGAQ75CMQ74VLWU6KR5DE05NJGOT0LG3L0PQFHR3H6HSD"),f=t=>{i(t.target.value)},x=t=>{t.preventDefault(),S.Inertia.post("/api/baselinker",{method:a,inventory_id:r,token:d,storageId:u,...m,products:g})},y=t=>{v([...t.target.options].map(I=>I.value))},h=()=>{l&&(b([...c,l]),s(""))};return e.createElement("form",{onSubmit:x},e.createElement("div",null,e.createElement(P,null,e.createElement("style",null,`
                        /* Основной контейнер формы */
                        .form-container {
                            max-width: 700px;
                            margin: 0 auto;
                            padding: 20px;
                            border: 1px solid #ccc;
                            border-radius: 5px;
                            background: #fff;
                        }

                        /* Стили для полей ввода */
                        .form-group {
                            margin-bottom: 20px;
                        }

                        .form-group label {
                            display: block;
                            font-weight: bold;
                            margin-bottom: 5px;
                        }

                        .form-group input[type="text"],
                        .form-group select {
                            width: 100%;
                            padding: 10px;
                            border: 1px solid #ccc;
                            border-radius: 5px;
                            font-size: 16px;
                        }

                        /* Стили для кнопки отправки */
                        .submit-button {
                            display: block;
                            width: 100%;
                            padding: 10px;
                            background: #007BFF;
                            color: #fff;
                            border: none;
                            border-radius: 5px;
                            font-size: 16px;
                            cursor: pointer;
                        }

                        .ids{
                            width:100%;
                        }

                        /* Стили для добавления нового product_id */
                        .add-product-button {
                            display: block;
                            padding: 5px 10px;
                            background: #007BFF;
                            color: #fff;
                            border: none;
                            border-radius: 5px;
                            font-size: 14px;
                            cursor: pointer;
                        }
                    `)),e.createElement("div",{className:"form-container"},e.createElement("div",{className:"form-group"},e.createElement("label",null,"X-BLToken"),e.createElement("br",null),e.createElement("input",{type:"text",value:d,onChange:t=>E(t.target.value)}),e.createElement("br",null),e.createElement("br",null),e.createElement("label",null,"Выберите метод:"),e.createElement("select",{value:a,onChange:f},e.createElement("option",{value:""},"Выберите метод"),e.createElement("option",{value:"getInventories"},"getInventories"),e.createElement("option",{value:"getInventoryCategories"},"getInventoryCategories"),e.createElement("option",{value:"getInventoryProductsList"},"getInventoryProductsList"),e.createElement("option",{value:"getStoragesList"},"getStoragesList"),e.createElement("option",{value:"getProductsList"},"getProductsList"),e.createElement("option",{value:"getProductsData"},"getProductsData"))),e.createElement("br",null),a==="getInventoryCategories"&&e.createElement("div",null,e.createElement("label",null,"inventory_id"),e.createElement("input",{type:"text",value:r,onChange:t=>o(t.target.value)})),a==="getInventoryProductsList"&&e.createElement("div",null,e.createElement("label",null,"inventory_id"),e.createElement("input",{type:"text",value:r,onChange:t=>o(t.target.value)})),a==="getProductsList"&&e.createElement("div",null,e.createElement("label",null,"storage_id"),e.createElement("input",{type:"text",value:u,onChange:t=>p(t.target.value)})),a==="getProductsData"&&e.createElement("div",null,e.createElement("label",null,"Добавьте product_ids:"),e.createElement("select",{className:"ids",multiple:!0,onChange:y},c.map(t=>e.createElement("option",{key:t,value:t},t))),e.createElement("div",null,e.createElement("label",null,"Добавить новый product_id:"),e.createElement("input",{type:"text",value:l,onChange:t=>s(t.target.value)}),e.createElement("button",{type:"button",onClick:h},"Добавить"))),e.createElement("div",null,e.createElement("button",{type:"submit"},"Отправить")))))}export{L as default};
