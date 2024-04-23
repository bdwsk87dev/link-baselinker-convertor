import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { InertiaLink, Head } from '@inertiajs/inertia-react';
import Menu from '../menu/menu.jsx';

const Upload = ({ xmlFiles }) => {
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
                    .upload-form {
                        display: flex;
                        flex-direction: column;
                        align-items: baseline;
                        margin-top: 20px;
                        width: 50%;
                        margin-right: 20px;
                    }

                    input[type="file"] {
                        padding: 10px;
                        margin: 10px 0;
                        border: 1px solid #ccc;
                        border-radius: 5px;
                    }


                    select {
                        padding: 10px;
                        margin: 5px 0;
                        border: 1px solid #ccc;
                        border-radius: 5px;
                        width: 100%;
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

                    .block
                    {
                        background-color:#ffffff;
                        padding:15px;
                        border-radius:5px;
                        margin-bottom:5px;
                    }

                    .example{
                        width:100%;
                    }

                    .example-container {
                        display: flex;
                        justify-content: flex-end; /* Выравнивание изображения по правому краю */
                    }

                    input, select {
                        padding: 8px;
                        margin: 5px 0;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                        box-sizing: border-box;
                        font-size: 12px;
                        color:#0d6efd;
                        font-family: Verdana, sans-serif; /* добавляем шрифт Verdana */
                        border:1px solid #16A177;
                        border-radius:0px !important;
                        width:100%;
                    }

                `}</style>
            </Head>

            <Menu/>

            <div className='block' style={{display: 'flex', justifyContent: 'space-between', borderTopLeftRadius: '0px', borderTopRightRadius: '0px'}}>

                <form className="upload-form" encType="multipart/form-data" onSubmit={handleSubmit}>

                    <span>Як завантажувати файл</span>
                    <select
                        value={uploadType}
                        onChange={(e) => setUploadType(e.target.value)}
                    >
                        <option value="file">Upload file and convert</option>
                        <option value="link">Convert from link</option>
                    </select>

                    <br/>

                    <span>Тип оригіналу</span>
                    <select
                        className="home-upload-xmltype-select"
                        value={xmlType}
                        onChange={(e) => setXmlType(e.target.value)}
                    >
                        <option value="typeA">Format A [ BL__Produkty ] [ Поляки ]</option>
                        <option value="typeB">Format B [ https://api.takedrop.pl/merchant/export ]</option>
                        <option value="typeC">Format C [ integration-google_product_search ]</option>
                        <option value="typeD">USMALL формат CSV від Сергія</option>
                    </select>

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

                    <label>Валюта</label>
                    <input
                        type="text"
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        placeholder="Currency"
                    />

                    <br/>

                    <label>Назва ( лише для таблиці сконвертованих лінків )</label>
                    <input
                        type="text"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        placeholder="Custom name"
                    />

                    <br/>

                    <label>Опис ( лише для таблиці сконвертованих лінків )</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Descripton"
                    />

                    <br/>

                    <button type="submit">Upload</button>


                </form>


                <div className="example-container">
                    {/* Условие отображения изображения в зависимости от выбранного типа XML */}
                    {xmlType === 'typeA' && (
                        <img className='example' src="/img/TypeA.png" alt="Type A Image"/>
                    )}
                    {xmlType === 'typeB' && (
                        <img className='example' src="/img/TypeB.png" alt="Type B Image"/>
                    )}
                    {xmlType === 'typeC' && (
                        <img className='example' src="/img/TypeC.png" alt="Type C Image"/>
                    )}
                </div>

            </div>


        </div>
    );
};

export default Upload;
