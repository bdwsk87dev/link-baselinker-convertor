import{r as a,R as e,H as y,I as m,d as v}from"./app.js";const F=({xmlFiles:C})=>{const[r,s]=a.useState(null),[p,d]=a.useState(""),[i,f]=a.useState(""),[l,g]=a.useState("file"),[c,x]=a.useState("typeA"),[o,b]=a.useState(""),[u,E]=a.useState("PLN"),h=t=>{t.preventDefault();const n=new FormData;if(l==="file"){if(!r)return;n.append("file",r)}else if(l==="link"){if(!o)return;n.append("remoteFileLink",o)}n.append("file",r),n.append("customName",p),n.append("description",i),n.append("uploadType",l),n.append("xmlType",c),n.append("currency",u),v.Inertia.post("/api/upload",n)};return e.createElement("div",null,e.createElement(y,null,e.createElement("style",null,`
                    .home-container {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        height: 100vh;
                        text-align: center;
                    }

                    .upload-form {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        margin-top: 20px;
                    }

                    .home-upload-type-select {
                        padding: 10px;
                        width: 245px;
                    }

                    input[type="file"] {
                        padding: 10px;
                        margin: 10px 0;
                        border: 1px solid #ccc;
                        border-radius: 5px;
                    }

                    input[type="text"] {
                        padding: 10px;
                        margin: 5px 0;
                        border: 1px solid #ccc;
                        border-radius: 5px;
                        width: 200px;
                    }

                    select {
                        padding: 10px;
                        margin: 5px 0;
                        border: 1px solid #ccc;
                        border-radius: 5px;
                        width: 200px;
                    }

                    button {
                        padding: 10px 20px;
                        margin-top: 10px;
                        background-color: #007bff;
                        color: #fff;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                    }

                    button:hover {
                        background-color: #0056b3;
                    }

                    p {
                        margin: 5px 0;
                    }

                    body{
                        height: 100%;
                        background: #bbbbbb;
                    }

                    .home-container{
                        background: #ffffff;
                        height: auto;
                        width: 480px;
                        margin: 0 auto;
                        padding: 15px;
                        border-radius: 15px;
                        font-family: Verdana, sans-serif; /* добавляем шрифт Verdana */
                    }

                `)),e.createElement("div",{className:"home-container"},e.createElement("h1",null,"CONVERTEDZILLA"),e.createElement("div",null,e.createElement(m,{href:"/list",target:"_blank",rel:"noopener noreferrer"},"show converted links"),e.createElement("br",null),e.createElement("br",null),e.createElement(m,{href:"/logout"},"logout")),e.createElement("form",{className:"upload-form",encType:"multipart/form-data",onSubmit:h},e.createElement("span",null,"Xml upload type"),e.createElement("select",{className:"home-upload-type-select",value:l,onChange:t=>g(t.target.value)},e.createElement("option",{value:"file"},"Upload file and convert"),e.createElement("option",{value:"link"},"Convert from link")),e.createElement("br",null),e.createElement("span",null,"Original Xml type format"),e.createElement("select",{className:"home-upload-xmltype-select",value:c,onChange:t=>x(t.target.value)},e.createElement("option",{value:"typeA"},"Format A"),e.createElement("option",{value:"typeB"},"Format B")),e.createElement("br",null),l==="file"?e.createElement("input",{type:"file",onChange:t=>s(t.target.files[0])}):e.createElement("input",{type:"text",value:o,onChange:t=>b(t.target.value),placeholder:"Remote File Link"}),e.createElement("br",null),e.createElement("label",null,"Currency"),e.createElement("input",{type:"text",value:u,onChange:t=>E(t.target.value),placeholder:"Currency"}),e.createElement("br",null),e.createElement("label",null,"Custom name ( for administration )"),e.createElement("input",{type:"text",value:p,onChange:t=>d(t.target.value),placeholder:"Custom name"}),e.createElement("br",null),e.createElement("label",null,"Description ( for administration )"),e.createElement("input",{type:"text",value:i,onChange:t=>f(t.target.value),placeholder:"Descripton"}),e.createElement("br",null),e.createElement("button",{type:"submit"},"Upload"))))};export{F as default};
