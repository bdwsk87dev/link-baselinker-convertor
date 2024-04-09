import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { InertiaLink, Head } from '@inertiajs/inertia-react';

const Home = ({ xmlFiles }) => {
    const [file, setFile] = useState(null);
    const [customName, setCustomName] = useState('');
    const [description, setDescription] = useState('');
    const [uploadType, setUploadType] = useState('file');
    const [xmlType, setXmlType] = useState('typeA');
    const [remoteFileLink, setRemoteFileLink] = useState('');
    const [currency, setCurrency] = useState('PLN');

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();

        if (uploadType === 'file') {
            if (!file) {
                return; // Файл не выбран, ничего не делаем
            }
            formData.append('file', file);
        } else if (uploadType === 'link') {
            if (!remoteFileLink) {
                return; // Ссылка на файл не указана, ничего не делаем
            }
            formData.append('remoteFileLink', remoteFileLink);
        }

        formData.append('file', file);
        formData.append('customName', customName);
        formData.append('description', description);
        formData.append('uploadType', uploadType);
        formData.append('xmlType', xmlType);
        formData.append('currency', currency);
        Inertia.post('/api/upload', formData);
    };

    return (
        <div>
            <Head>
                <style>{`
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

                    .example{
                        width:100%;
                    }

                `}</style>
            </Head>
            <div className="home-container">
                <h1>CONVERTEDZILLA</h1>
                <div>
                    <InertiaLink href="/list" target="_blank" rel="noopener noreferrer">
                        show converted links
                    </InertiaLink>
                    <br/>
                    <br/>
                    <InertiaLink href="/logout">logout</InertiaLink>
                </div>
                <form className="upload-form" encType="multipart/form-data" onSubmit={handleSubmit}>

                    <span>Xml upload type</span>
                    <select
                        className="home-upload-type-select"
                        value={uploadType}
                        onChange={(e) => setUploadType(e.target.value)}
                    >
                        <option value="file">Upload file and convert</option>
                        <option value="link">Convert from link</option>
                    </select>

                    <br/>

                    <span>Original Xml type format</span>
                    <select
                        className="home-upload-xmltype-select"
                        value={xmlType}
                        onChange={(e) => setXmlType(e.target.value)}
                    >
                        <option value="typeA">Format A</option>
                        <option value="typeB">Format B</option>
                        <option value="typeC">Format C</option>
                    </select>

                    {/* Условие отображения изображения в зависимости от выбранного типа XML */}
                    {xmlType === 'typeA' && (
                        <img className='example' src="/img/TypeA.png" alt="Type A Image" />
                    )}
                    {xmlType === 'typeB' && (
                        <img className='example' src="/img/TypeB.png" alt="Type B Image" />
                    )}
                    {xmlType === 'typeC' && (
                        <img className='example' src="/img/TypeC.png" alt="Type C Image" />
                    )}

                    <br/>

                    {uploadType === 'file' ? (
                        <input type="file" onChange={(e) => setFile(e.target.files[0])}/>
                    ) : (
                        <input
                            type="text"
                            value={remoteFileLink}
                            onChange={(e) => setRemoteFileLink(e.target.value)}
                            placeholder="Remote File Link"
                        />
                    )}

                    <br/>

                    <label>Currency</label>
                    <input
                        type="text"
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        placeholder="Currency"
                    />

                    <br/>

                    <label>Custom name ( for administration )</label>
                    <input
                        type="text"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        placeholder="Custom name"
                    />

                    <br/>

                    <label>Description ( for administration )</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Descripton"
                    />

                    <br/>

                    <button type="submit">Upload</button>
                </form>
            </div>
        </div>
    );
};

export default Home;
