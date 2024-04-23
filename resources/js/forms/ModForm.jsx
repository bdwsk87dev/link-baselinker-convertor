import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditForm = ({ productId, onClose }) => {
    const [formData, setFormData] = useState({
        productId: productId,
        isChangeDescription : false,
        isChangeDescriptionUA : false,
        isChangePrice: false,
        newPrice: '',
        newDescription: '',
        newDescriptionUA: ''
    });

    useEffect(() => {

    }, []);

    const [translateError , setError] = useState('Увага, якщо плануєте зробити переклад опису товарів, спочатку зробіть його. Потім змінюйте опис. Так як якщо спочатку змінити опис а потім перекладати - це будуть додаткові витрати на DeepL');

    // Состояние для отслеживания отправки формы
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsSubmitting(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('productId', formData.productId);
            formDataToSend.append('isChangeDescription', formData.isChangeDescription);
            formDataToSend.append('isChangeDescriptionUA', formData.isChangeDescription);
            formDataToSend.append('isChangePrice', formData.isChangePrice);
            formDataToSend.append('newPrice', formData.newPrice);
            formDataToSend.append('newDescription', formData.newDescription);
            formDataToSend.append('newDescriptionUA', formData.newDescriptionUA);

            const response = await axios.post('/api/modification/', formDataToSend);

            if(response.data['status'] === "ok") {
                setError('Зміна документу успішно виконана.');
            }

            else{
                setError(response.data['message']);
            }
        } catch (error)
        {
            console.error('Произошла ошибка при отправке данных:', error);
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
                <div className='translate-modal-title'>Модифікація файлу ID: {productId}</div>
                <br/>
                <div>
                </div>
                <form onSubmit={handleSubmit}>


                    <div>

                        Збільшити ціну на %
                        <input
                            type="checkbox"
                            name="isChangePrice"
                            checked={formData.isChangePrice}
                            onChange={handleChange}
                        />

                        <input
                            type="text"
                            name="newPrice"
                            value={formData.newPrice}
                            onChange={handleChange}
                            onKeyDown={handleCheckPrice}
                        />

                        Змінити опис
                        <input
                            type="checkbox"
                            name="isChangeDescription"
                            checked={formData.isChangeDescription}
                            onChange={handleChange}
                        />

                        <br/>

                        <textarea
                            style={{width: '100%', minHeight: '170px', fontSize: '12px'}}
                            name="newDescription"
                            value={formData.newDescription}
                            onChange={handleChange}
                        ></textarea>

                        Змінити опис UA
                        <input
                            type="checkbox"
                            name="isChangeDescriptionUA"
                            checked={formData.isChangeDescriptionUA}
                            onChange={handleChange}
                        />

                        <br/>

                        <textarea
                            style={{width: '100%', minHeight: '170px', fontSize: '12px'}}
                            name="newDescriptionUA"
                            value={formData.newDescriptionUA}
                            onChange={handleChange}
                        ></textarea>

                        <div style={{color: 'red', fontSize: '14px'}}>
                            {translateError}
                        </div>

                    </div>


                    <button className="updateButton" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Відправляється...' : 'Змінити документ'}
                    </button>
                    <button className="closeButton" onClick={onClose}>Закрити вікно</button>
                </form>
            </div>
        </div>
    );
};

export default EditForm;
