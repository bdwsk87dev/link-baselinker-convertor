import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditForm = ({ xml_id, onClose }) => {
    const [formData, setFormData] = useState({
        xml_id: xml_id,
        price_percent: '',
        description: '',
        description_ua: ''
    });

    useEffect(() => {
        const fetchSettings = async () => {
            // display loader
            try {

                setError('Завантажуються данні налаштувань...');

                const response = await axios.get(`/api/xml/settings/get/${xml_id}`);
                const { data } = response;

                console.log(response.status);

                if (response.status === 200 && data.status === 'ok')
                {
                    setFormData({
                        ...formData,
                        price_percent: data.data.price_percent,
                        description: data.data.description,
                        description_ua: data.data.description_ua
                    });
                }

                setError('Налаштування завантажені!');

            } catch (error) {

                if (error.response.status === 404)
                {
                    setError('Налаштувань по цьому файлу ще не існує!');
                }
                else
                {
                    setError('Помилка при отриманні налаштувань.');
                }
            }
        };

        fetchSettings();
    }, [xml_id]); // Запрос будет повторно отправлен при изменении xml_id

    const [translateError , setError] = useState('');

    // Состояние для отслеживания отправки формы
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('Зберігання...');

        setIsSubmitting(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('xml_id', formData.xml_id);
            formDataToSend.append('price_percent', formData.price_percent);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('description_ua', formData.description_ua);

            const response = await axios.post('/api/xml/settings/store', formDataToSend);

            if(response.data['status'] === "ok") {
                setError('Налаштування збережені.');
            }

        } catch (error)
        {
            setError('Помилка при зберіганні налаштуваня.');
        }
        finally
        {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, checked } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: name === 'isChangePrice' || name === 'isChangeDescription' || name === 'isChangeDescriptionUA' ? checked : value,
        }));
    };

    const handleCheckPrice = (e) => {
        const allowedChars = /[0-9,.]/;
        const allowedKeys = ['Backspace'];
        if (!allowedChars.test(e.key) && !allowedKeys.includes(e.key)) {
            e.preventDefault();
        }
    };

    return (
        <div className="modal-background">
            <div className="modal">
                <div className='translate-modal-title'>Налаштування файлу ID: {xml_id}</div>
                <br/>
                <div>
                </div>
                <form onSubmit={handleSubmit}>

                    <div>

                        Змінити ціну на % від ціни:

                        <input
                            type="text"
                            name="price_percent"
                            value={formData.price_percent}
                            onChange={handleChange}
                            onKeyDown={handleCheckPrice}
                            placeholder={'фывыфвы'}
                        />

                        <br/>

                        Додати з початку текст в опис товару:

                        <textarea
                            style={{width: '100%', minHeight: '170px', fontSize: '12px'}}
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        ></textarea>

                        <br/>

                        Додати з початку текст в опис товару UA:

                        <textarea
                            style={{width: '100%', minHeight: '170px', fontSize: '12px'}}
                            name="description_ua"
                            value={formData.description_ua}
                            onChange={handleChange}
                        ></textarea>

                        <div style={{color: 'red', fontSize: '14px'}}>
                            {translateError}
                        </div>

                    </div>

                    <button className="updateButton" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Відправляється...' : 'Зберегти налаштування'}
                    </button>
                    <button className="closeButton" onClick={onClose}>Закрити вікно</button>
                </form>
            </div>
        </div>
    );
};

export default EditForm;
