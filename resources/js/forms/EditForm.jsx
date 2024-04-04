import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditForm = ({ productId, onClose }) => {
    const [formData, setFormData] = useState({
        productId: productId,
        apiKey: '',
        translateName: false,
        translateDescription: false,
    });

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('productId', formData.productId);
            formDataToSend.append('apiKey', formData.shop_name);
            formDataToSend.append('translateName', formData.translateName);
            formDataToSend.append('translateDescription', formData.translateDescription);

            const response = await axios.post('/api/translate', formDataToSend);

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

    return (
        <div className="modal-background">
            <div className="modal">
                <h2>Translate file</h2>
                <div>
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
                                name="translateName"
                                checked={formData.translateName}
                                onChange={handleChange}
                            />
                            Переводить имя
                        </label>
                    </div>
                    <div>
                        <label>
                            <input
                                type="checkbox"
                                name="translateDescription"
                                checked={formData.translateDescription}
                                onChange={handleChange}
                            />
                            Переводить описание
                        </label>
                    </div>
                    <button className="updateButton" type="submit">Translate</button>
                    <button className="closeButton" onClick={onClose}>Exit</button>
                </form>
            </div>
        </div>
    );
};

export default EditForm;
