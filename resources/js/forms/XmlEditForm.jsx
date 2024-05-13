import React, {useState, useEffect} from 'react';
import axios from 'axios';

const EditForm = ({xml_id, onClose}) => {

    const [formData, setFormData] = useState({
        xml_id: xml_id,
        custom_name: '',
        TLD: '',
        source_file_link: '',
        description: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        const fetchSettings = async () => {
            // display loader
            try {

                setIsSubmitting(true);
                setMessage('Завантажуються данні...');

                const response = await axios.get(`/api/xml/get/${xml_id}`);
                const {data} = response;

                if (response.status === 200 && data.status === 'ok') {
                    setFormData({
                        ...formData,
                        custom_name: data.data.custom_name,
                        TLD: data.data.TLD,
                        source_file_link: data.data.source_file_link,
                        description: data.data.description,
                    });
                }

                setMessage('Налаштування завантажені!');
                setIsSubmitting(false);

            } catch (error) {

                if (error.response.status === 404) {
                    setMessage('Налаштувань по цьому файлу ще не існує!');
                } else {
                    setMessage('Помилка при отриманні налаштувань.');
                }

                setIsSubmitting(false);
            }
        };

        fetchSettings();
    }, [xml_id]); // Запрос будет повторно отправлен при изменении xml_id


    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage('Зберігання...');
        setIsSubmitting(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('xml_id', formData.xml_id);
            formDataToSend.append('custom_name', formData.custom_name);
            formDataToSend.append('TLD', formData.TLD);
            formDataToSend.append('source_file_link', formData.source_file_link);
            formDataToSend.append('description', formData.description);

            const response = await axios.post(`/api/xml/get/${xml_id}`, formDataToSend);

            if (response.data['status'] === "ok") {
                setMessage('Налаштування збережені.');
            }

        } catch (error) {
            setMessage('Помилка при зберіганні налаштуваня.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-background">
            <div className="modal">
                <form onSubmit={handleSubmit} className="h-100">
                    <div className="d-flex flex-column h-100">
                        <h1>Редагування запису: {xml_id}</h1>
                        <br/>
                        <div>
                            <div className="modal-block" style={{display: 'flex', flexDirection: 'column'}}>
                                <label>Назва</label>
                                <input
                                    className="form-control w-100"
                                    style={{width: '100%', fontSize: '12px'}}
                                    name="custom_name"
                                    value={formData.custom_name}
                                    onChange={handleChange}
                                />
                                <label className="mt-2">TLD</label>
                                <input
                                    className="form-control w-100"
                                    style={{width: '100%', fontSize: '12px'}}
                                    name="TLD"
                                    value={formData.TLD}
                                    onChange={handleChange}
                                />
                                <label className="mt-2">Link</label>
                                <input
                                    className="form-control w-100"
                                    style={{width: '100%', fontSize: '12px'}}
                                    name="source_file_link"
                                    value={formData.source_file_link}
                                    onChange={handleChange}
                                />
                                <label className="mt-2">Опис (приховано в таблиці)</label>
                                <textarea
                                    className="form-control w-100"
                                    style={{width: '100%', minHeight: '170px', fontSize: '12px'}}
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                                <br/>
                                <div style={{color: 'red', fontSize: '14px'}}>{message}</div>
                            </div>
                            {!isSubmitting && (
                                <div className="mt-auto">
                                    <br/>
                                    <br/>
                                    <br/>
                                    <br/>
                                    <br/>
                                    <br/>
                                    <br/>
                                    <div className="d-flex justify-content-between">
                                        <div className="modal-side-block w-50">
                                            <button className="btn button-confirm" type="submit">
                                                Зберегти
                                            </button>
                                        </div>
                                        <div className="modal-side-block w-50 ml-5">
                                            <button className="btn btn-secondary" onClick={onClose}>
                                                Закрити вікно
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {isSubmitting && (
                                <img className="m-auto loading-image" src="/img/loading_a.gif" alt="Loading..."/>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
        ;
};

export default EditForm;
