import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditForm = ({ productId, onClose }) => {
    const [formData, setFormData] = useState({
        productId: productId,
        // apiKey: '0c3ec76f-b35a-5ca9-6989-265c4a3b01d5',
        apiKey: '06b19aa7-4efd-d195-95af-4a7e74695239',
        isTranslateName: false,
        isTranslateDescription: false,
    });

    const [deepLUsage, setUsage ] = useState('');
    const [translateError , setError] = useState('');
    const [translatedCount, setTranslatedCount] = useState(0);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {

    }, []);


    useEffect(() => {
        // Функция, которая будет вызывать запрос к API и обновлять состояние
        const fetchTranslatedCount = async () => {
            try {

                const translatedCountResponse = await axios.get('/api/get-translated-products-count/' + formData.productId);

                console.log(translatedCountResponse);
                const translatedCount = translatedCountResponse.data.translated;
                const totalProducts = translatedCountResponse.data.totalProducts;
                setTranslatedCount(translatedCount);
                setTotalCount(totalProducts);
            } catch (error) {
                console.error('Ошибка при получении количества переведенных товаров:', error);
            }
        };

        // Вызываем функцию fetchTranslatedCount сразу после монтирования компонента
        fetchTranslatedCount();

        // Устанавливаем интервал, который будет вызывать функцию fetchTranslatedCount каждую секунду
        const intervalId = setInterval(fetchTranslatedCount, 1000);

        // Очищаем интервал при размонтировании компонента, чтобы избежать утечек памяти
        return () => clearInterval(intervalId);
    }, []); // Пустой массив зависимостей гарантирует, что useEffect будет вызван только один раз после монтирования компонента


    const getDeepLUsage = async () => {
        try {

            const formDataToSend = new FormData();
            formDataToSend.append('apiKey', formData.apiKey);

            const response = await axios.post('/api/deepl/usage', formDataToSend);

            if(response.data['status'] === "error") {
                setError(response.data['message']);
            }
            else{
                const usage = response.data;
                setUsage(usage);
            }
        } catch (error) {
            console.error('Ошибка при получении процента выполнения:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('productId', formData.productId);
            formDataToSend.append('apiKey', formData.apiKey);
            formDataToSend.append('isTranslateName', formData.isTranslateName);
            formDataToSend.append('isTranslateDescription', formData.isTranslateDescription);

            const response = await axios.post('/api/deepl/translate', formDataToSend);

            if(response.data['status'] === "ok") {
                setError('ok');
            }
            else{
                setError(response.data['message']);
            }
        } catch (error) {
            console.error('Произошла ошибка при отправке данных:', error);
        }
    };

    const handleChange = (e) => {
        const { name, checked } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: checked,
        }));
    };

    const handleGetDeepLUsage = () => {
        getDeepLUsage(); // Вызываем метод для получения использования DeepL
    };

    return (
        <div className="modal-background">
            <div className="modal">
                <h2>Translate file</h2>
                <div>
                </div>
                <div>
                    DeeplUsage: {deepLUsage} {}
                </div>

                <p>ID: {productId}</p>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>
                            Api key DeepL
                            <input
                                type="text"
                                name="apiKey"
                                value={formData.apiKey}
                                onChange={(e) => setFormData({...formData, apiKey: e.target.value})}
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            <input
                                type="checkbox"
                                name="isTranslateName"
                                checked={formData.isTranslateName}
                                onChange={handleChange}
                            />
                            Translate all product names
                        </label>
                    </div>
                    <div>
                        <label>
                            <input
                                type="checkbox"
                                name="isTranslateDescription"
                                checked={formData.isTranslateDescription}
                                onChange={handleChange}
                            />
                            Translate all product descriptions
                        </label>
                    </div>
                    <button className="usageButton" type="button" onClick={handleGetDeepLUsage}>Get DeepL usage</button>

                    <div>
                        Перекладено {translatedCount} з {totalCount} товарів
                    </div>

                    <div>
                        {translateError}
                    </div>

                    <button className="updateButton" type="submit">Translate</button>
                    <button className="closeButton" onClick={onClose}>Exit</button>
                </form>
            </div>
        </div>
    );
};

export default EditForm;
