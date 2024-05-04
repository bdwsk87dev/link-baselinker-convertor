import React, {useState, useEffect} from 'react';
import axios from 'axios';

const EditForm = ({xml_id, onClose}) => {

    const [formData, setFormData] = useState({
        xml_id: xml_id,
        price_percent: '',
        delivery_price: '',
        description: '',
        description_ua: ''
    });

    const [confirmAction, setConfirmAction] = useState(false);
    const [translateError, setError] = useState('');
    // Состояние для отслеживания отправки формы
    const [isSubmitting, setIsSubmitting] = useState(false);


    useEffect(() => {
        const fetchSettings = async () => {
            // display loader
            try {

                setIsSubmitting(true);
                setError('Завантажуються данні налаштувань...');

                const response = await axios.get(`/api/xml/settings/get/${xml_id}`);
                const {data} = response;

                if (response.status === 200 && data.status === 'ok') {
                    setFormData({
                        ...formData,
                        price_percent: data.data.price_percent,
                        delivery_price: data.data.delivery_price,
                        description: data.data.description,
                        description_ua: data.data.description_ua
                    });
                }

                setError('Налаштування завантажені!');
                setIsSubmitting(false);

            } catch (error) {

                if (error.response.status === 404) {
                    setError('Налаштувань по цьому файлу ще не існує!');
                } else {
                    setError('Помилка при отриманні налаштувань.');
                }

                setIsSubmitting(false);
            }
        };

        fetchSettings();
    }, [xml_id]); // Запрос будет повторно отправлен при изменении xml_id



    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('Зберігання...');
        setIsSubmitting(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('xml_id', formData.xml_id);
            formDataToSend.append('price_percent', formData.price_percent);
            formDataToSend.append('delivery_price', formData.delivery_price);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('description_ua', formData.description_ua);

            const response = await axios.post('/api/xml/settings/store', formDataToSend);

            if (response.data['status'] === "ok") {
                setError('Налаштування збережені.');
                setConfirmAction(false);
            }

        } catch (error) {
            setError('Помилка при зберіганні налаштуваня.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const {name, value, checked} = e.target;
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

    const handleCheckDeliveryPrice = (e) => {
        // Разрешаем только цифры, десятичную точку и специальные клавиши (Backspace, Delete и т. д.)
        const allowedChars = /[0-9.]/;
        const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
        if (!allowedChars.test(e.key) && !allowedKeys.includes(e.key)) {
            e.preventDefault();
        }
    };

    return (
        <div className="modal-background">
            <div className="modal">

                <form onSubmit={handleSubmit} className="h-100">


                    <div className="d-flex flex-column h-100">

                        <h1>Налаштування файлу ID: {xml_id}</h1>
                        <br/>


                        <div>

                            <div className="modal-block">

                                <div className="modal-side-block w-50">

                                    <label>
                                        Збільшити ціну на %
                                    </label>

                                    <input
                                        className=""
                                        type="text"
                                        name="price_percent"
                                        value={formData.price_percent}
                                        onChange={handleChange}
                                        onKeyDown={handleCheckPrice}
                                        placeholder={'%'}
                                    />

                                </div>

                                <div className="modal-side-block w-50 ml-5">

                                    <label>
                                        Вартість доставки
                                    </label>

                                    <input
                                        className=""
                                        type="text"
                                        name="delivery_price"
                                        value={formData.delivery_price}
                                        onChange={handleChange}
                                        onKeyDown={handleCheckDeliveryPrice}
                                        placeholder={'Ціна доставки'}
                                    />

                                </div>
                            </div>

                            <label>
                                Текст перед описом:
                            </label>

                            <textarea
                                className="form-control w-100"
                                style={{width: '100%', minHeight: '170px', fontSize: '12px'}}
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                            ></textarea>

                            <label className="mt-2">
                                Текст перед описом UA:
                            </label>

                            <textarea
                                className="form-control w-100"
                                style={{width: '100%', minHeight: '170px', fontSize: '12px'}}
                                name="description_ua"
                                value={formData.description_ua}
                                onChange={handleChange}
                            ></textarea>

                            <br/>

                            <div style={{color: 'red', fontSize: '14px'}}>
                                {translateError}
                            </div>


                        </div>

                        {!isSubmitting && (
                            <div className="mt-auto">
                                {confirmAction ?
                                    <div className="d-flex justify-content-between">
                                        <div className="modal-side-block w-50">
                                            <button className="btn button-confirm" type="submit">
                                                Підтвердити зберігання
                                            </button>
                                        </div>
                                        <div className="modal-side-block w-50 ml-5">
                                            <button className="btn btn-secondary" onClick={(e) => {
                                                e.preventDefault();
                                                setConfirmAction(false);
                                            }}>
                                                Скасувати
                                            </button>
                                        </div>
                                    </div>
                                    :
                                    <div className="d-flex justify-content-between">
                                        <div className="modal-side-block w-50">
                                            <button className="updateButton btn btn-primary" type="button"
                                                    onClick={(e) => {
                                                        setConfirmAction(true);
                                                        e.preventDefault(); // Избегаем отправки формы
                                                    }}>
                                                Зберегти налаштування
                                            </button>
                                        </div>
                                        <div className="modal-side-block w-50 ml-5">
                                            <button className="closeButton btn btn-secondary" onClick={onClose}>Закрити
                                                вікно
                                            </button>
                                        </div>
                                    </div>
                                }
                            </div>
                        )}

                        {isSubmitting && (
                            <img className="m-auto loading-image" src="/img/loading_a.gif" alt="Loading..." />
                        )}

                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditForm;
