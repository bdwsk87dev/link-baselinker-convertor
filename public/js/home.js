import{r as l,R as e,H as v,I as s,d as C}from"./app.js";const N=({xmlFiles:r})=>{const[o,d]=l.useState(null),[i,f]=l.useState(""),[c,E]=l.useState(""),[a,g]=l.useState("file"),[m,y]=l.useState("typeA"),[p,x]=l.useState(""),[u,b]=l.useState("PLN"),h=t=>{t.preventDefault();const n=new FormData;if(a==="file"){if(!o)return;n.append("file",o)}else if(a==="link"){if(!p)return;n.append("remoteFileLink",p)}n.append("file",o),n.append("customName",i),n.append("description",c),n.append("uploadType",a),n.append("xmlType",m),n.append("currency",u),C.Inertia.post("/api/upload",n)};return e.createElement("div",null,e.createElement(v,null,e.createElement("style",null,`
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
                `)),e.createElement("div",{className:"home-container"},e.createElement("h1",null,"CONVERTEDZILLA"),e.createElement("div",null,e.createElement(s,{href:"/list",target:"_blank",rel:"noopener noreferrer"},"show converted links"),e.createElement("br",null),e.createElement("br",null),e.createElement(s,{href:"/logout"},"logout")),e.createElement("form",{className:"upload-form",encType:"multipart/form-data",onSubmit:h},e.createElement("span",null,"Xml upload type"),e.createElement("select",{className:"home-upload-type-select",value:a,onChange:t=>g(t.target.value)},e.createElement("option",{value:"file"},"Upload file and convert"),e.createElement("option",{value:"link"},"Convert from link")),e.createElement("br",null),e.createElement("span",null,"Original Xml type format"),e.createElement("select",{className:"home-upload-xmltype-select",value:m,onChange:t=>y(t.target.value)},e.createElement("option",{value:"typeA"},"Format A"),e.createElement("option",{value:"typeB"},"Format B")),e.createElement("br",null),a==="file"?e.createElement("input",{type:"file",onChange:t=>d(t.target.files[0])}):e.createElement("input",{type:"text",value:p,onChange:t=>x(t.target.value),placeholder:"Remote File Link"}),e.createElement("br",null),e.createElement("label",null,"Currency"),e.createElement("input",{type:"text",value:u,onChange:t=>b(t.target.value),placeholder:"Currency"}),e.createElement("br",null),e.createElement("label",null,"Custom name ( for administration )"),e.createElement("input",{type:"text",value:i,onChange:t=>f(t.target.value),placeholder:"Custom name"}),e.createElement("br",null),e.createElement("label",null,"Description ( for administration )"),e.createElement("input",{type:"text",value:c,onChange:t=>E(t.target.value),placeholder:"Descripton"}),e.createElement("br",null),Array.isArray(r)&&r.length>0?r.map(t=>e.createElement("p",{key:t.id},t.filename)):e.createElement("p",null,"No file yet"),e.createElement("button",{type:"submit"},"Upload"))))};export{N as default};
