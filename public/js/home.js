import{r as n,R as e,H as y,I as h,d as b}from"./app.js";const k=({xmlFiles:r})=>{const[o,u]=n.useState(null),[i,s]=n.useState(""),[c,d]=n.useState(""),[l,f]=n.useState("file"),[m,g]=n.useState("typeA"),[p,x]=n.useState(""),E=t=>{t.preventDefault();const a=new FormData;if(l==="file"){if(!o)return;a.append("file",o)}else if(l==="link"){if(!p)return;a.append("remoteFileLink",p)}a.append("file",o),a.append("customName",i),a.append("description",c),a.append("uploadType",l),a.append("xmlType",m),b.Inertia.post("/api/upload",a)};return e.createElement("div",null,e.createElement(y,null,e.createElement("style",null,`
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
                `)),e.createElement("div",{className:"home-container"},e.createElement("h1",null,"CONVERTEDZILLA"),e.createElement("div",null,e.createElement(h,{href:"/logout"},"logout")),e.createElement("form",{className:"upload-form",encType:"multipart/form-data",onSubmit:E},e.createElement("span",null,"Xml upload type"),e.createElement("select",{className:"home-upload-type-select",value:l,onChange:t=>f(t.target.value)},e.createElement("option",{value:"file"},"Upload file and convert"),e.createElement("option",{value:"link"},"Convert from link")),e.createElement("br",null),e.createElement("span",null,"Original Xml type format"),e.createElement("select",{className:"home-upload-xmltype-select",value:m,onChange:t=>g(t.target.value)},e.createElement("option",{value:"typeA"},"Format A"),e.createElement("option",{value:"typeB"},"Format B")),e.createElement("br",null),l==="file"?e.createElement("input",{type:"file",onChange:t=>u(t.target.files[0])}):e.createElement("input",{type:"text",value:p,onChange:t=>x(t.target.value),placeholder:"Remote File Link"}),e.createElement("br",null),e.createElement("input",{type:"text",value:i,onChange:t=>s(t.target.value),placeholder:"Custom name"}),e.createElement("br",null),e.createElement("input",{type:"text",value:c,onChange:t=>d(t.target.value),placeholder:"Descripton"}),e.createElement("br",null),Array.isArray(r)&&r.length>0?r.map(t=>e.createElement("p",{key:t.id},t.filename)):e.createElement("p",null,"No file yet"),e.createElement("button",{type:"submit"},"Upload"))))};export{k as default};
