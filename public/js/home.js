import{r as n,R as e,H as h,I as u,d as v}from"./app.js";const F=({xmlFiles:C})=>{const[r,s]=n.useState(null),[p,d]=n.useState(""),[i,f]=n.useState(""),[a,x]=n.useState("file"),[c,E]=n.useState("typeA"),[o,g]=n.useState(""),[m,y]=n.useState("PLN"),b=t=>{t.preventDefault();const l=new FormData;if(a==="file"){if(!r)return;l.append("file",r)}else if(a==="link"){if(!o)return;l.append("remoteFileLink",o)}l.append("file",r),l.append("customName",p),l.append("description",i),l.append("uploadType",a),l.append("xmlType",c),l.append("currency",m),v.Inertia.post("/api/upload",l)};return e.createElement("div",null,e.createElement(h,null,e.createElement("style",null,`
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
                `)),e.createElement("div",{className:"home-container"},e.createElement("h1",null,"CONVERTEDZILLA"),e.createElement("div",null,e.createElement(u,{href:"/list",target:"_blank",rel:"noopener noreferrer"},"show converted links"),e.createElement("br",null),e.createElement("br",null),e.createElement(u,{href:"/logout"},"logout")),e.createElement("form",{className:"upload-form",encType:"multipart/form-data",onSubmit:b},e.createElement("span",null,"Xml upload type"),e.createElement("select",{className:"home-upload-type-select",value:a,onChange:t=>x(t.target.value)},e.createElement("option",{value:"file"},"Upload file and convert"),e.createElement("option",{value:"link"},"Convert from link")),e.createElement("br",null),e.createElement("span",null,"Original Xml type format"),e.createElement("select",{className:"home-upload-xmltype-select",value:c,onChange:t=>E(t.target.value)},e.createElement("option",{value:"typeA"},"Format A"),e.createElement("option",{value:"typeB"},"Format B")),e.createElement("br",null),a==="file"?e.createElement("input",{type:"file",onChange:t=>s(t.target.files[0])}):e.createElement("input",{type:"text",value:o,onChange:t=>g(t.target.value),placeholder:"Remote File Link"}),e.createElement("br",null),e.createElement("label",null,"Currency"),e.createElement("input",{type:"text",value:m,onChange:t=>y(t.target.value),placeholder:"Currency"}),e.createElement("br",null),e.createElement("label",null,"Custom name ( for administration )"),e.createElement("input",{type:"text",value:p,onChange:t=>d(t.target.value),placeholder:"Custom name"}),e.createElement("br",null),e.createElement("label",null,"Description ( for administration )"),e.createElement("input",{type:"text",value:i,onChange:t=>f(t.target.value),placeholder:"Descripton"}),e.createElement("br",null),e.createElement("button",{type:"submit"},"Upload"))))};export{F as default};
