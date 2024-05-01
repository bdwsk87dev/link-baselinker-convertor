import React, {useState} from 'react';
import axios from "axios";
import {InertiaLink, Head} from '@inertiajs/inertia-react';
import Menu from "../menu/menu.jsx";

const MapperCSV = () => {

    // Type of the file xml or csv
    const [fileType, setFileType] = useState('xml');

    // File itself
    const [file, setFile] = useState(null);

    // Uploading type
    const [uploadType, setUploadType] = useState('file');

    // Response data from server
    const [responseData, setResponseData] = useState(null);

    // Error message
    const [error, setError] = useState(null);

    // Loading state
    const [isLoading, setIsLoading] = useState(false);

    const [remoteFileLink, setRemoteFileLink] = useState('');

    const [stage, setStage] = useState(1);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('file', file);
            formDataToSend.append('uploadType', uploadType);

            const response = await axios.post('/api/csv/file/upload', formDataToSend);
            // Set response data to state
            setResponseData(response.data);

            setStage(2);

        } catch (error) {
            // Handle error
            console.error('Error occurred:', error);
            setError('Error occurred while uploading file');
        } finally {
            setIsLoading(false);
        }
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
                        width: 400px;
                        margin-right: 20px;
                    }

                    input[type="file"] {
                        padding: 10px;
                        margin: 10px 0;
                        border: 1px solid #ccc;
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
                             font-family: Verdana, sans-serif; /* добавляем шрифт Verdana */
                             font-size:14px;
                    }

                    .block
                    {
                        background-color:#ffffff;
                        padding:15px;
                        border-radius:5px;
                        margin-bottom:5px;

                    }

                    .block-flex{
                     display: flex;
                    }

                    .example{
                        width:100%;
                    }

                    .example-container {
                        display: flex;
                        justify-content: flex-end;
                    }

                    input, select {
                        padding: 8px;
                        margin: 5px 0;
                        box-sizing: border-box;
                        color: #000000;
                        font-family: Verdana, sans-serif;
                        width: 100%;
                        border-radius: 0px;
                        padding-top: 10px;
                        padding-bottom: 14px;
                        font-size: 14px;
                        background: #ffffff;
                        margin-bottom: 16px;
                        margin-top: 16px;
                        border: 1px solid #b5b5b5;
                        font-size: 14px;
                    }

                    label{
                        font-size: 14px;
                        width: 100%;
                        font-weight: bold;
                        font-family: Verdana, sans-serif; /* добавляем шрифт Verdana */
                    }

                    input::placeholder {
                        color: #000000;
                        font-family: Verdana, sans-serif; /* добавляем шрифт Verdana */
                    }


                    select::placeholder {
                        color: #000000;
                        font-family: Verdana, sans-serif; /* добавляем шрифт Verdana */
                    }

                    h1{
                        font-family: Verdana, sans-serif; /* добавляем шрифт Verdana */
                        font-size: 23px;
                        font-family: Verdana, sans-serif;
                        padding: 0px;
                        margin: 0px;
                    }



                    .isUploadImages
                    {
                        width:10px;
                    }

                    ul{
                         list-style-type: none;
                        border-left: 1px solid #ebebeb;
                        /* padding-left: 1px; */
                        border-top: 1px solid #cfcfcf;
                        padding-top: 13px;
                    }

                    .xmlNumeric
                    {
                        border-radius: 25px;
                        background: #e5e2f7;
                        width: fit-content;
                        text-align: center;
                        padding: 9px;
                    }

                    .tag{
                        background: #6deb4d;
                        width: fit-content;
                        text-align: center;
                        padding: 9px;
                        margin: 5px;
                    }
                    .xmlLi{
                        background: #6deb4d;
                        width: fit-content;
                        text-align: center;
                        padding: 9px;
                        margin: 5px;
                    }

                    .value{
                        background: #add1a4;
                        width: 400px;
                        text-align: center;
                        padding: 9px;
                        margin: 5px;
                        border-bottom-left-radius: 10px;
                        border-bottom-right-radius: 10px;
                    }
                    .xmlKey{
                        background: #6deb4d;
                        width: fit-content;
                        text-align: center;
                        padding: 9px;
                        margin: 5px;
                    }
                    .keyTag{
                        border-top-left-radius: 10px;
                        background: #7bff59;
                        width: fit-content;
                        text-align: center;
                        padding: 9px;
                        margin: 5px;

                    }

                    .tagger {
                        justify-content: flex-end;
                        width: 60%;
                         font-family: Verdana, sans-serif; /* добавляем шрифт Verdana */
                         font-size: 12px;
                             margin-top: 40px;
}
                    }

                `}</style>

            </Head>
            <Menu/>

            <div className='block' style={{
                borderTopLeftRadius: '0px',
                borderTopRightRadius: '0px'
            }}>

                <h1>Додавання налаштування для парсера через CSV Mapper</h1>

                <div className='block-flex'>
                    {stage === 1 && (
                        <form className="upload-form" encType="multipart/form-data" onSubmit={handleSubmit}>
                            Перш за все, спочатку завантажемо файл...
                            <br/><br/>
                            Оберіть спосіб завантаження.
                            <br/>
                            <select
                                value={uploadType}
                                onChange={(e) => setUploadType(e.target.value)}
                            >
                                <option value="file">Завантажити файл.</option>
                                <option value="link">Завантажити через лінк.</option>
                            </select>
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
                            <button type="submit">Завантажити</button>
                        </form>
                    )}


                    <div className="tagger">
                        {isLoading && <p>Завантаження...</p>}
                        {error && <p>Error: {error}</p>}

                        {/* Отображение тегов и выбор маппинга */}

                        {stage === 2 && responseData && renderTags(responseData.struct)}

                    </div>


                </div>

            </div>


        </div>
    );
};

export default MapperCSV;
