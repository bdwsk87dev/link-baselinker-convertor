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

    // Stage 2 params

    const [tagProduct, setTagProduct] = useState('');
    const [categoryType, setCategoryType] = useState('separate');
    const [imageParseType, setImageParseType] = useState('separate');
    const [categoryName, setCategoryName] = useState('');
    const [productName, setProductName] = useState('');
    const [prodId, setProdId] = useState('');
    const [prodDescription, setProdDescription] = useState('');
    const [tagParam, setTagParam] = useState('');
    const [tagPrice, setTagPrice] = useState('');
    const [tagImage, setTagImage] = useState('');


    const [imageSeparator, setImageSeparator] = useState('1');

    const [priceFix, setPriceFix] = useState(false);





    const handleClick = (e, path) => {
        if (path !== undefined){
            alert('Полный путь тега от корня: ' + path);
            e.stopPropagation(); // Остановим всплытие события, чтобы клик на родительских элементах не срабатывал
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

            setStage(2);

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
                {Object.entries(data).slice(0, 200).map(([key, value], index) => (
                    <li key={key}  onClick={(e) => handleClick(e, value.path)}>

                        <div className={typeof value === 'object' ? 'xmlKey' : 'keyTag'}>
                            {isNaN(Number(key)) && key}
                        </div>

                        {typeof value === 'object' ? renderTags(value) :
                            <div className={typeof value === 'object' ? '' : 'value'}>  {typeof value === 'string' && value.length > 300 ? `${value.slice(0, 300)}...` : value} </div>}
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
                        width: 400px;
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
                    }

                `}</style>

            </Head>
            <Menu/>

            <div className='block' style={{
                borderTopLeftRadius: '0px',
                borderTopRightRadius: '0px'
            }}>
                {stage === 1 && (
                    <form className="upload-form" encType="multipart/form-data" onSubmit={handleSubmit}>
                        1 Спочатку завантажемо файл...
                        <br/><br/>
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

                {stage === 2 && (
                    <form className="upload-form" encType="multipart/form-data">

                        <label>
                            Product | Оберіть тег товару. У кожного товара є свій тег.
                        </label>

                        <input
                            value={tagProduct}
                            onChange={(e) => setTagProduct(e.target.value)}
                            type="text"
                            placeholder="Оберіть тег товару."
                        />

                        <br/><br/>

                        <label>
                            Як шукати категорії?
                        </label>

                        <select
                            value={categoryType}
                            onChange={(e) => setCategoryType(e.target.value)}
                        >
                            <option value="separate">Категорії в окремих тегах</option>
                            <option value="inProducts">Категорії в товарах у вигляді тегів або параметрів</option>
                        </select>

                        <label>
                            CategoryName | Оберіть тег або атрибут назви категорії
                        </label>

                        <input
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            type="text"
                            placeholder="Оберіть назву товару."
                        />

                        <br/><br/>

                        <label>
                            ProductName | Оберіть тег або атрибут назви товару в тегу товара, який ви обрали вище...
                        </label>

                        <input
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            type="text"
                            placeholder="Оберіть назву товару."
                        />

                        <label>
                            ProductId | ID товару
                        </label>

                        <input
                            value={prodId}
                            onChange={(e) => setProdId(e.target.value)}
                            type="text"
                            placeholder="Оберіть назву товару."
                        />

                        <label>
                            Description | Оберіть тег або атрибут опису товара.
                        </label>

                        <input
                            value={prodDescription}
                            onChange={(e) => setProdDescription(e.target.value)}
                            type="text"
                            placeholder="Оберіть тег опису товара."
                        />

                        <label>
                            Price | Оберіть тег або атрибут ціни товара.
                        </label>

                        <input
                            value={tagPrice}
                            onChange={(e) => setTagPrice(e.target.value)}
                            type="text"
                            placeholder="Оберіть тег ціни."
                        />

                        <br/><br/>

                        <label>
                            Picture | Оберіть тег або атрибут зображення товара.
                        </label>

                        <input
                            value={tagImage}
                            onChange={(e) => setTagImage(e.target.value)}
                            type="text"
                            placeholder="Оберіть тег ціни."
                        />

                        <label>
                            Picture type | Оберіть як парсити зображення.
                        </label>

                        <select
                            value={imageParseType}
                            onChange={(e) => setImageParseType(e.target.value)}
                        >
                            <option value="single">Всі зображення знаходяться в одному тегу.</option>
                            <option value="separate">Кожне зображення в окремому такому тегу</option>
                        </select>

                        <label>
                            Який символ розділяє зображення, якщо всі зображення в одному тегу
                        </label>

                        <select
                            value={imageSeparator}
                            onChange={(e) => setImageSeparator(e.target.value)}
                        >
                            <option value="1">;</option>
                            <option value="2">,</option>
                        </select>

                        <label>
                            Param | Оберіть тег параметрів. Тільки якщо параметри в окремих тегах
                        </label>

                        <input
                            value={tagParam}
                            onChange={(e) => setTagParam(e.target.value)}
                            type="text"
                            placeholder="Оберіть тег параметрів."
                        />

                        <label>
                            Фікс, вставити точку в ціні перед останніми двома цифрами якщо ії немає. ( Андрія фікс! Не
                            чіпати! )
                        </label>

                        <input style={{
                            width: '10px',
                        }}
                               type="checkbox"
                               checked={priceFix}
                               onChange={(e) => setPriceFix(e.target.checked)}
                               placeholder="Descripton"
                        />

                        <button type="">Зберегти</button>

                        <button type="">Перевірити</button>

                    </form>
                )}

                <div className="tagger">
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

        </div>
    );


};

export default Mapper;
