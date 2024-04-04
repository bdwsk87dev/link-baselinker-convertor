import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditForm = ({ productId, onClose }) => {
    const [formData, setFormData] = useState({
        productId: productId,
        apiKey: '0c3ec76f-b35a-5ca9-6989-265c4a3b01d5',
        isTranslateName: false,
        isTranslateDescription: false,
    });

    const [deepLUsage, setUsage ] = useState('');

    const [completionPercentage, setCompletionPercentage] = useState(0);
    const [translated, setTranslated] = useState(0);

    const fetchCompletionPercentage = async () => {
        try {
            const response = await axios.get('/get-completion-percentage');
            const percentage = response.data.percentage;
            console.log(percentage);
            setCompletionPercentage(percentage);
        } catch (error) {
            console.error('Ошибка при получении процента выполнения:', error);
        }
    };

    useEffect(() => {

    }, []);

    const getDeepLUsage = async () => {
        try {

            const formDataToSend = new FormData();
            formDataToSend.append('apiKey', formData.apiKey);

            const response = await axios.post('/api/deepl/usage', formDataToSend);
            const usage = response.data;
            console.log(usage);
            setUsage(usage);
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

            if(response.data['status'] == "ok"){
                window.location.reload();
            }

            setTranslated(response.data['translatedProductCount']);

            console.log('Ответ от сервера:', response.data);

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
                    <button className="updateButton" type="submit">Translate</button>
                    <button className="closeButton" onClick={onClose}>Exit</button>
                </form>
            </div>
        </div>
    );
};

export default EditForm;
