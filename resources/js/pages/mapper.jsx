import React, {useState} from 'react';
import axios from "axios";
import {InertiaLink, Head} from '@inertiajs/inertia-react';
import Menu from "../menu/menu.jsx";

const Mapper = () => {
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

    const handleClick = (e, path) => {
        // Проверяем, является ли текущий элемент li корневым элементом в иерархии
        if (e.target.tagName.toLowerCase() === 'li') {
            alert('Полный путь тега от корня: ' + path);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('file', file);
            formDataToSend.append('uploadType', uploadType);

            const response = await axios.post('/api/xml/file/upload', formDataToSend);
            // Set response data to state
            setResponseData(response.data);
        } catch (error) {
            // Handle error
            console.error('Error occurred:', error);
            setError('Error occurred while uploading file');
        } finally {
            setIsLoading(false);
        }
    };

    let renderCount = 0;

    const renderTags = (data) => {
        if (renderCount >= 200) {
            return;
        }

        renderCount++;

        return (
            <ul>
                {Object.entries(data).map(([key, value]) => (
                    <li key={key} onClick={(e) => handleClick(e, value.path)}>
                        {isNaN(Number(key)) &&
                            <div className={typeof value === 'object' ? 'xmlKey' : 'keyTag'}>{key}</div>}
                        {typeof value === 'object' ? renderTags(value) :
                            <div className={typeof value === 'object' ? '' : 'value'}>{value}</div>}
                    </li>
                ))}
            </ul>
        );
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
                        width: fit-content;
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
                `}</style>

            </Head>
            <Menu/>

            <div className='block' style={{
                display: 'flex',
                justifyContent: 'space-between',
                borderTopLeftRadius: '0px',
                borderTopRightRadius: '0px'
            }}>
                {stage === 1 && (

                    <form className="upload-form" encType="multipart/form-data" onSubmit={handleSubmit}>

                        Спочатку завантажемо файл...

                        <br/>

                        Оберіть спосіб завантаження.

                        <br/>

                        <select
                            value={uploadType}
                            onChange={(e) => setUploadType(e.target.value)}
                        >
                            <option value="file">Upload file and convert</option>
                            <option value="link">Convert from link</option>
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


                        <button type="submit">Submit</button>
                    </form>
                )}
                );


                {isLoading && <p>Loading...</p>}
                {error && <p>Error: {error}</p>}
                {/*{responseData && (*/}
                {/*    <div>*/}
                {/*        <h2>XML File Structure:</h2>*/}
                {/*        <pre>{JSON.stringify(responseData, null, 2)}</pre>*/}
                {/*    </div>*/}
                {/*)}*/}

                {/* Отображение тегов и выбор маппинга */}


                {responseData && renderTags(responseData.struct.original)}

            </div>

        </div>
    );


};

export default Mapper;
