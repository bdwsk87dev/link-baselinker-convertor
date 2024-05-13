import React, {useState, useEffect} from 'react';
import {Head, InertiaLink} from '@inertiajs/inertia-react';
import {format} from 'date-fns';
import {Inertia} from '@inertiajs/inertia'
import {Helmet} from 'react-helmet';
import Menu from '../menu/menu';

import EditForm from '../forms/EditForm';
import ModForm from '../forms/ModForm.jsx';
import XmlEditForm from '../forms/XmlEditForm.jsx';
import axios from 'axios';

import { FaTrash } from 'react-icons/fa';
import { FaLanguage } from 'react-icons/fa';
import { FaLink } from 'react-icons/fa';
import { FaEdit } from 'react-icons/fa';
import { FaTimes } from 'react-icons/fa';
import { FaFile,FaGlobe } from 'react-icons/fa';
import { FaSync } from 'react-icons/fa';
import { FaSpinner } from 'react-icons/fa';

const List = ({xmlFiles, data}) => {

    const [mode, setMode] = useState(data.view_mode);

    const handleChangeMode = (e) => {
        setMode(e.target.value);

        Inertia.visit('/list', {
            method: 'get',
            data: {
                sort_by: sortColumn,
                order: sortDirection,
                per_page: perPage,
                search: searchString,
                page: page,
                view_mode: e.target.value
            },
            preserveState: true
        });
    };


    const updateTable = ()=>{
        Inertia.visit('/list', {
            method: 'get',
            data: {
                sort_by: sortColumn,
                order: sortDirection,
                per_page: perPage,
                search: searchString,
                page: page,
                view_mode: mode
            },
            preserveState: true
        });
    }

    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const [searchString, ssetSarchString] = useState('');
    const [perPage, setperPage] = useState(25);
    const [page, setPage] = useState(1);




    const [isEditFormOpen, setIsEditFormOpen] = useState(false);
    const [editingProductId, setEditingProductId] = useState(null); // Track the editing product ID

    const [isModFormOpen, setIsModFormOpen ] = useState(false);
    const [modProductId, setModProductId] = useState(null); // Track the editing product ID

    // Форма редактирования записи
    const [isXmlEditFormOpen, setIsXmlEditFormOpen] = useState(false);
    const [editXmlId, setEditXmlId] = useState(null);





    const [syncStatus, setSyncStatus] = useState({});

    // Функция для обновления состояния синхронизации
    const updateSyncStatus = (id, status) => {
        setSyncStatus(prevState => ({
            ...prevState,
            [id]: status,
        }));
    };





    /** Переключение чекбоксов обновления **/
    const handleUpdateable = (
        xmlId,
        currentValue
    ) => {
        axios.post('/api/xml/settings/store', {
            xml_id: xmlId,
            allow_update: currentValue
        })
            .then(response => {
                Inertia.visit('/list', {
                    method: 'get',
                    data: {
                        per_page: perPage,
                        sort_by: sortColumn,
                        order: sortDirection,
                        search: searchString,
                        page: page,
                        view_mode: mode
                    },
                    preserveState: true,
                    replace: true, // Это предотвратит автоматическую прокрутку страницы вверх
                    preserveScroll: true // Этот параметр сохраняет текущую позицию прокрутки
                });
            })

    };


    const handleSync = (id) => {
        // Устанавливаем статус синхронизации для текущей записи в true перед отправкой запроса
        updateSyncStatus(id, true);
        axios.get(`/api/update/${id}`)
            .then(response => {
                // Обработка успешного ответа от сервера
                const data = response.data;
                // Устанавливаем статус синхронизации для текущей записи в false после получения ответа
                updateSyncStatus(id, false);
            })
            .catch(error => {
                // Обработка ошибки при запросе к серверу
                // Устанавливаем статус синхронизации для текущей записи в false после получения ошибки
                updateSyncStatus(id, false);
            });
        Inertia.visit('/list', {
            method: 'get',
            data: {
                per_page: 1,
                sort_by: sortColumn,
                order: sortDirection,
                search: searchString,
                page: 1,
                view_mode: mode
            },
            preserveState: true
        });
    };



    // Table font size
    const [fontSize, setFontSize] = useState(12);

    const handleFontSizeChange = (event) => {
        setFontSize(event.target.value); // Оновлюємо розмір шрифту на основі значення ползунка
    };
    //



    // Обработчик двойного клика на <tr>
    const handleDoubleClick = (xmlFileId) =>
    {
        handleEditXmlForm(xmlFileId);
    };


    // // // // // // // //

    const handleEdit = (id) =>
    {
        openEditForm(id);
        setEditingProductId(id);
    };

    const handleMod = (id) =>
    {
        openModForm(id);
        setModProductId(id);
    };

    const handleEditXmlForm = (id) =>
    {
        openEditXmlForm();
        setEditXmlId(id);
    };

    // // // // // // // //

    const openEditForm = () => {
        setIsEditFormOpen(true);
    };

    const closeEditForm = () => {
        setIsEditFormOpen(false);
    };

    //

    const openModForm = () => {
        setIsModFormOpen(true);
    };

    const closeModForm = () => {
        setIsModFormOpen(false);
    };

    //

    const openEditXmlForm = () => {
        setIsXmlEditFormOpen(true);
    };

    const closeEditXmlForm = () => {
        setIsXmlEditFormOpen(false);
        updateTable();
    };







    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this file?')) {
            Inertia.post(`/delete/${id}`, {}, {
                onSuccess: () => {
                    // Обновите список после успешного удаления
                    Inertia.reload();
                },
            });
        }
    }

    const sortBy = (column) => {
        let order = 'asc';
        if (sortColumn === column && sortDirection === 'asc') {
            order = 'desc';
        }
        Inertia.visit('/list', {
            method: 'get',
            data: {
                sort_by: column,
                order,
                per_page: perPage,
                search: searchString,
                page: page,
                view_mode: mode
            },
            preserveState: true
        });

        setSortColumn(column);
        setSortDirection(order);
    };

    const changePerPage = (e) => {
        const perPage = e.target.value;
        setperPage(perPage);
        Inertia.visit('/list', {
            method: 'get',
            data: {
                per_page: perPage,
                sort_by: sortColumn,
                order: sortDirection,
                search: searchString,
                page: 1,
                view_mode: mode
            },
            preserveState: true
        });
    }

    const changePage = (page) => {
        setPage(page);
        Inertia.visit('/list', {
            method: 'get',
            data: {
                sort_by: sortColumn,
                order: sortDirection,
                per_page: perPage,
                search: searchString,
                page: page,
                view_mode: mode
            },
            preserveState: true
        });
    }


    const search = (e) => {
        const searchString = e.target.value;
        if (e.key === 'Enter') {
            Inertia.visit('/list', {
                method: 'get',
                data: {
                    search: searchString,
                    sort_by: sortColumn,
                    order: sortDirection,
                    per_page: xmlFiles.per_page,
                    page: 1,
                    view_mode: mode
                },
                preserveState: true
            });
            setSortColumn(null);
            setSortDirection('asc');
            ssetSarchString(searchString);
        }
    }




    useEffect(() => {
        const moveImage = () => {
            const pageItems = document.querySelectorAll('.pagination .page-item');


            let position = window.innerWidth-150;
            let creature = 1; // Начальное значение для переменной creature

            const move = () => {
                position -= 1;
                document.getElementById(`movingImage_${creature}`).style.left = `${position}px`;

                if (position <= ((pageItems.length/2)*35 ) + 60 + (creature *100 )) {
                    position = window.innerWidth-150; // Перенос картинки за пределы экрана справа
                    creature = creature === 6 ? 10 : creature + 1; // Циклическое изменение значения creature от 1 до 2
                }
            };

            setInterval(move, 10);
        };

        moveImage();

        return () => clearInterval(moveImage);
    }, []);

    const randomTexts = [
        'Кря',
        '',
        ''
        ]

    // const randomTexts = [
    //     "Привет",
    //     "Где Usmall ?",
    //     "",
    //     "Парсер Александра - полный Usmall",
    //     "",
    //     "Зачем ты так?",
    //     "",
    //     "Кто-нибудь проверял работу переводчика?",
    //     "",
    //     "Это всё не правда! Это был не я!",
    //     "",
    //     "Александр не программист",
    //     "",
    //     "Александра спарсили тюлени",
    //     "",
    //     "Александр жульничает",
    //     "",
    //     "Ну и дизайн...",
    //     "",
    //     "Где-то в далике плачет кошка... Потому-что её мучает четвероклошка!",
    //     "",
    //     "Друзья, а ведь я чувствую ошибку своей жопой",
    //     "",
    //     "Лозиняки тобі не вистачає!",
    //     "",
    //     "Сколько всего уже места занято на сервере?",
    //     "",
    //     "Ну не знаю...",
    //     "",
    //     "Это не шутки! Мы встретились в маршрутке...",
    //     "",
    //     "Что ты несёшь ?",
    //     "",
    //     "Какой-то бред!",
    //     "",
    //     "Утака-мандаринка самая красивая утка в мире!",
    //     "",
    //     "Я не готов к таким шуткам...",
    //     "",
    //     "А меня вчера спарсили, теперь я спарсенный.",
    //     "",
    //     "Мой папа побьет твоего папу и тут и в Шанхае!",
    //     "",
    //     "Охнедичка канич нич сейн!",
    //     "",
    //     "Ого! 2 ядра по 1.7!",
    //     "",
    //     "Ого!",
    //     "",
    //     "Смотрите, снова 403!",
    //     "",
    //     "Смотрите, есть не скомпилированные коды Vite!",
    //     "",
    //     "Когда заработает маппер, я вижу что оего нет!",
    //     "",
    //     "Ну, я не знаю!",
    //     "",
    //     "Я зачем-то утка и я зачем-то тут...",
    //     "",
    //     "Джордж Клуни самый невкусный бэтмен из всех бэтменов!",
    //     "",
    //     "Если долго смотреть на белок то увидите как насилуют её или насилует она!",
    //     "",
    //     "У меня палец в .... застрял!",
    //     "",
    //     "Ого, новый дизайн!",
    //     "",
    //     "Скорее всего нет!",
    //     "",
    //     "Наверное...",
    //     "",
    //     "Морган Фримен - левша! А сайт всё равер не доделан!",
    //     "",
    //     "Я гусь, разрешите дое..сь",
    //     "",
    //     "Посмотрите в левое окно - там вы видите тоже самое что и в правом окне!",
    //     "",
    //     "Меня штырит!",
    //     "",
    //     "Кто?",
    //     "",
    //     "Мой надзиратель отвлёкся, теперь я тут!",
    //     "",
    //     "Мне нужен транквилизатор!",
    //     "",
    //     "Рэнэ Зельвеггер не красивая!",
    //     "",
    //     "Ешьие дети Николая в майонез его макая!",
    //     "",
    //     "Фокаччу с цукини!",
    //     "",
    //     "Фокаччу с цукини и луком!",
    //     "",
    //     "Макашечка вместо соли и майонеза!",
    //     "",
    //     "Сейчас бы накручивать спагетти, макая их в мясной ...",
    //     "",
    //     "Анастасия Волочкова, Я И БАЛЛ! Куда не скажу!",
    //     "",
    //     "У меня генеталии растут с обратной стороны!",
    //     "",
    //     "Я умею ловить рыбу языком!"
    //
    //
    //
    // ];

    const getRandomText = () => {
        const randomIndex = Math.floor(Math.random() * randomTexts.length);
        return randomTexts[randomIndex];
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            const images = document.querySelectorAll('.movingImage');

            // Удаляем все существующие элементы с классом "randomText"
            const existingTextElements = document.querySelectorAll('.randomText');
            existingTextElements.forEach(element => {
                element.parentNode.removeChild(element);
            });

            let i = 0;
            images.forEach(image => {
                i+=1;
                const randomText = getRandomText();
                const textElement = document.createElement('div');
                textElement.classList.add('randomText');
                textElement.textContent = randomText;
                textElement.style.position = 'absolute';


                if (i % 3 === 0) {
                    textElement.style.top = `${image.offsetTop - 100}px`; // Смещение текста над изображением для каждого третьего элемента
                } else if (i % 2 === 0) {
                    textElement.style.top = `${image.offsetTop - 60}px`; // Смещение текста над изображением для четных элементов
                } else {
                    textElement.style.top = `${image.offsetTop - 80}px`; // Смещение текста над изображением для нечетных элементов
                }


                textElement.style.left = `${image.offsetLeft}px`;

                // Добавляем текстовый элемент к родительскому элементу изображения
                image.parentNode.appendChild(textElement);
            });
        }, 5000); // Обновляем текст каждые 5 секунд

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="p-3">

            <div className="p-3" style={{position: 'relative', marginTop: '-30px', display: 'none'}}>
                <img
                    className="movingImage"
                    style={{position: 'absolute', top: '235px', transform: 'translateY(-50%)', width: '86px'}}
                     id="movingImage_1" src="/img/Creature_1.gif"/>
                <img
                    className="movingImage"
                    style={{
                    left: '-100px',
                    position: 'absolute',
                    top: '235px',
                    transform: 'translateY(-50%)',
                    width: '86px'
                }}
                     id="movingImage_2" src="/img/Creature_2.gif"/>
                <img
                    className="movingImage"
                    style={{
                    left: '-100px',
                    position: 'absolute',
                    top: '235px',
                    transform: 'translateY(-50%)',
                    width: '86px'
                }}
                     id="movingImage_3" src="/img/Creature_3.gif"/>
                <img
                    className="movingImage"
                    style={{
                    left: '-200px',
                    position: 'absolute',
                    top: '235px',
                    transform: 'translateY(-50%)',
                    width: '100px'
                }}
                     id="movingImage_4" src="/img/Creature_4.gif"/>

                <img
                    className="movingImage"
                    style={{
                    left: '-200px',
                    position: 'absolute',
                    top: '235px',
                    transform: 'translateY(-50%)',
                    width: '86px'
                }}
                     id="movingImage_5" src="/img/Creature_5.gif"/>

                <img
                    className="movingImage"
                    style={{
                    left: '-200px',
                    position: 'absolute',
                    top: '235px',
                    transform: 'translateY(-50%)',
                    width: '86px'
                }}
                     id="movingImage_6" src="/img/Creature_6.gif"/>

            </div>


            <Head>
                <style>{`

                body{
                 font-family: Verdana, sans-serif;
                 height: 100%;
                 background: #bbbbbb;
                }

                h1{
                    font-size:1rem;
                    font-weight:bold;
                }

                label{
                    font-size:0.8rem;
                }

                .modal-block{
                    display:flex;
                    justify-content: space-between;
                }

                .ml-5 {
                    margin-left: 1.25rem;
                }

                .custom-edit-button,
                .custom-delete-button,
                .link-button
                {
                    font-size:12px;
                    padding: 3px 8px;
                    margin-right: 5px;
                    min - height: 38px;
                }

                .modal-background {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

               .modal {
                  position: relative;
                  z-index: 9999;
                  background: white;
                  padding: 20px;
                  border-radius: 3px;
                  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
                  text-align: center;
                  display: block; /* Отображаем окно */
                  width: 80%; /* Ширина окна */
                  height:800px;
                  max-width: 500px; /* Максимальная ширина окна */
                }

                input, select {
                  padding: 8px;
                  margin: 5px 0;
                  border: 1px solid #ccc;
                  border-radius: 4px;
                  box-sizing: border-box;
                  font-size: 1rem;
                  color:#0d6efd;
                  font-family: Verdana, sans-serif; /* добавляем шрифт Verdana */
                  border:1px solid #16A177;
                  border-radius:0px !important;
                }

                select:hover {
                cursor:pointer;
                }

                .pagination li:hover{
                cursor:pointer;
                }

                .modal label {
                    display: block;
                    margin-bottom: 10px;
                    font-weight: bold;
                }

                .modal input[type="text"],
                .modal input[type="file"],
                .modal button {
                    width: 100%;
                    padding: 10px;
                    margin-bottom: 15px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    font-size: 0.8rem;
                }

                .modal input[type="checkbox"] {
                    margin-left: 5px;
                }

                .modal button[type="submit"] {
                    background-color: #007bff;
                    color: white;
                    cursor: pointer;
                }

                .modal button[type="submit"]:hover {
                    background-color: #0056b3;
                }



                .modal button:hover {
                    background-color: #999;
                }
                .modal checkbox{
                    margin-left:10px;
                }

                .modal .updateButton{
                    min-height: 3rem;
                }

                .modal .closeButton{
                    min-height: 3rem;
                }

                .loading-image
                {
                    width:5rem;
                    height:5rem;
                }

                .modal .button-confirm{
                    background-color: #dc3545 !important;
                }



                .usageButton{
                    background-color: #292e69ee !important;
                }

                .block
                {
                    background-color:#ffffff;
                    padding:15px;
                    border-radius:5px;
                    margin-bottom:3px;
                    border-top-left-radius: 0px;
                    border-top-right-radius: 0px;
                }

                .file-table{
                    font-size:14px;
                    width: 100%;
                    borderCollapse: collapse;
                    margin: 0 auto;
                    font-size: 12px;

                }

                .per-page{
                    font-size:14px;
                }

                .per-page{
                    margin-left:15px;
                }

                .page-link{
                    font-size:12px;
                    background:none;
                }

                .file-table tbody tr:nth-child(even) {
                    background-color: #f9f9f9; /* Цвет фона для каждой второй строки */
                }

                 .file-table thead th {
                    height:60px;
                }

                .file-table tbody tr:hover {
                    background:#eeebf1 !important;
                }

                .page-link{
                    font-size:16px;
                }

                .active>.page-link, .page-link.active {
                            background: #16A177;
                }

                .randomText{
                    font-size:8px;
                }

                .page-link{
                    border:1px solid #16A177;
                    border-radius:0px !important;
                }

                .translate-modal-title{
                    font-size:1.5rem;
                }

                .elements-block{
                    display:flex;
                }

                progress{
                    width: 100%;
                    vertical-align: baseline;
                    height: 38px;
                }

                .translatedCount{
                    float:left;
                }

                td.table-link, td.table-description{
                    max-width:200px;
                    word-wrap: break-word; /* Якщо ви хочете переносити слова */
                    /* або */
                    overflow-wrap: break-word; /* Якщо ви хочете переносити слова, якщо вони не поміщаються в контейнер */
                }

                td.table-link{
                    max-width:200px;
                    word-wrap: break-word; /* Якщо ви хочете переносити слова */
                    /* або */
                    overflow-wrap: break-word; /* Якщо ви хочете переносити слова, якщо вони не поміщаються в контейнер */
                }


                .translate-svg-div{
                    vertical-align: middle;
                    display: flex;
                    align-items: center;
                }

                .translate-svg{
                    font-size: 36px;
                    color: #1d6eb3;

                }

               .translate-svg:hover{
                    cursor:pointer;
                    font-size: 36px;
                    color: #0dbcff;
                }

                .settigns-svg{
                    font-size: 20px;
                    color: #228d15;
                }

                .settigns-svg:hover{
                    cursor:pointer;
                    font-size: 22px;
                    color: #8d1515;
                }


                .link-svg{
                    font-size: 20px;
                    color: #228d15;
                }

                .link-svg:hover{
                    cursor:pointer;
                    font-size: 22px;
                    color: #8d1515;
                }

                .delete-svg{
                    font-size: 20px;
                    color: #cd2626;
                }

                .delete-svg:hover{
                    cursor:pointer;
                    font-size: 22px;
                    color: #8d1515;
                }

                .shync-checkbox{
                    transform: scale(1.3);
                    border-color: green;

                }



                # Modal
                 `}</style>
            </Head>

            <Helmet>
                <link
                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
                    integrity="sha384-..."
                    crossorigin="anonymous"
                />

            </Helmet>

            <Menu/>

            <div className='block' style={{borderTopLeftRadius: '0px', borderTopRightRadius: '0px'}}>

                <div style={{display: 'flex', justifyContent: 'flex-start'}}>
                    <input type="text" placeholder="Search..." onKeyDown={search}/>
                    <select className='per-page' onChange={changePerPage} value={xmlFiles.per_page}>
                        <option value="10">10 per page</option>
                        <option value="25">25 per page</option>
                        <option value="50">50 per page</option>
                        <option value="100">100 per page</option>
                        <option value="200">200 per page</option>
                        {/* Добавили опцию для 40 элементов на странице */}
                    </select>

                    <select className='per-page' onChange={handleChangeMode} value={mode}>
                        <option value="view">Режим перегляду</option>
                        <option value="sync">Режим оновлення</option>
                        {/* Добавили опцию для 40 элементов на странице */}
                    </select>


                </div>

                <input
                    type="range"
                    min="10"
                    max="24"
                    value={fontSize}
                    onChange={handleFontSizeChange}
                    step="1"
                />

                <br/>

                <table className='file-table' style={{fontSize: `${fontSize}px`}}>
                    <thead>
                    <tr>
                        <td colSpan="6" style={{textAlign: 'center'}}>
                        {xmlFiles.links.length > 0 && (
                                <ul className="pagination">
                                    {xmlFiles.links.map((link, key) => (
                                        <li key={key} className={`page-item ${link.active ? 'active' : ''}`}>
                                            {link.label !== "..." ? (
                                                    <p onClick={() => changePage(link.url.match(/page=(\d+)/)?.[1])}
                                                       className="page-link">
                                                        {link.label.replace(/&laquo;/g, '').replace(/&raquo;/g, '')}
                                                    </p>
                                                ) :
                                                <p className="page-link">
                                                    ...
                                                </p>
                                            }
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </td>
                    </tr>

                    <tr>
                        <th onClick={() => sortBy('id')} style={{
                            cursor: 'pointer',
                            padding: '8px',
                            border: '1px solid #ddd',
                            backgroundColor: '#f2f2f2',
                            fontWeight: 'bold',
                            textAlign: 'left'
                        }}>ID
                        </th>


                        <th onClick={() => sortBy('custom_name')} style={{
                            cursor: 'pointer',
                            padding: '8px',
                            border: '1px solid #ddd',
                            backgroundColor: '#f2f2f2',
                            fontWeight: 'bold',
                            textAlign: 'left',
                            minWidth: '220px'
                        }}>Назва
                        </th>

                        <th onClick={() => sortBy('tld')} style={{
                            cursor: 'pointer',
                            padding: '8px',
                            border: '1px solid #ddd',
                            backgroundColor: '#f2f2f2',
                            fontWeight: 'bold',
                            textAlign: 'left',

                            width: '110px',
                        }}>TLD
                        </th>


                        {/*{ mode === 'view' &&*/}
                        {/*    <th onClick={() => sortBy('description')} style={{*/}
                        {/*        cursor: 'pointer',*/}
                        {/*        padding: '8px',*/}
                        {/*        border: '1px solid #ddd',*/}
                        {/*        backgroundColor: '#f2f2f2',*/}
                        {/*        fontWeight: 'bold',*/}
                        {/*        textAlign: 'left'*/}
                        {/*    }}>Опис*/}
                        {/*    </th>*/}
                        {/*}*/}

                        {mode === 'view' &&
                            <th onClick={() => sortBy('uploadDateTime')} style={{
                                cursor: 'pointer',
                                padding: '8px',
                                border: '1px solid #ddd',
                                backgroundColor: '#f2f2f2',
                                fontWeight: 'bold',
                                textAlign: 'left',
                                width: '50px'
                            }}>Дата
                            </th>
                        }

                        {mode === 'view' &&
                            <th onClick={() => sortBy('uploadDateTime')} style={{
                                cursor: 'pointer',
                                padding: '8px',
                                border: '1px solid #ddd',
                                backgroundColor: '#f2f2f2',
                                fontWeight: 'bold',
                                textAlign: 'left',
                                width: '50px'
                            }}>Час
                            </th>
                        }

                        <th onClick={() => sortBy('type')} style={{
                            cursor: 'pointer',
                            padding: '8px',
                            border: '1px solid #ddd',
                            backgroundColor: '#f2f2f2',
                            fontWeight: 'bold',
                            textAlign: 'left',
                            width: '60px'
                        }}>Тип
                        </th>

                        <th onClick={() => sortBy('source_file_link')} style={{
                            cursor: 'pointer',
                            padding: '8px',
                            border: '1px solid #ddd',
                            backgroundColor: '#f2f2f2',
                            fontWeight: 'bold',
                            textAlign: 'left'
                        }}>Лінк на оригінал
                        </th>

                        <th style={{
                            padding: '8px',
                            border: '1px solid #ddd',
                            backgroundColor: '#f2f2f2',
                            fontWeight: 'bold',
                            textAlign: 'left'
                        }}>Переклад
                        </th>

                        {mode === 'view' &&
                            <th onClick={() => sortBy('')} style={{
                                cursor: 'pointer',
                                padding: '8px',
                                border: '1px solid #ddd',
                                backgroundColor: '#f2f2f2',
                                fontWeight: 'bold',
                                textAlign: 'left'
                            }}> Налаш-<br/>
                                тування<br/>
                            </th>
                        }

                        <th style={{
                            padding: '8px',
                            border: '1px solid #ddd',
                            backgroundColor: '#f2f2f2',
                            fontWeight: 'bold',
                            textAlign: 'left'
                        }}>Лінк
                        </th>

                        {mode === 'view' &&
                            <th style={{
                                width: '100px',
                                padding: '8px',
                                border: '1px solid #ddd',
                                backgroundColor: '#f2f2f2',
                                fontWeight: 'bold',
                                textAlign: 'left'
                            }}>Видалити
                            </th>
                        }

                        {mode === 'sync' &&
                            <th style={{
                                width: '180px',
                                padding: '8px',
                                border: '1px solid #ddd',
                                backgroundColor: '#f2f2f2',
                                fontWeight: 'bold',
                                textAlign: 'left'
                            }}>
                                Останнє
                                <br/>
                                оновлення
                            </th>
                        }

                        {mode === 'sync' &&
                            <th style={{
                                width: '100px',
                                padding: '8px',
                                border: '1px solid #ddd',
                                backgroundColor: '#f2f2f2',
                                fontWeight: 'bold',
                                textAlign: 'left'
                            }}>
                                Тип парсеру
                            </th>
                        }

                        {mode === 'sync' &&
                            <th style={{
                                width: '100px',
                                padding: '8px',
                                border: '1px solid #ddd',
                                backgroundColor: '#f2f2f2',
                                fontWeight: 'bold',
                                textAlign: 'left'
                            }}>
                                Шаблон
                                <br/>
                                оновлення
                            </th>
                        }

                        {mode === 'sync' &&
                            <th style={{
                                width: '100px',
                                padding: '8px',
                                border: '1px solid #ddd',
                                backgroundColor: '#f2f2f2',
                                fontWeight: 'bold',
                                textAlign: 'left'
                            }}>Оновлювати
                            </th>
                        }

                        {mode === 'sync' &&
                            <th style={{
                                width: '100px',
                                padding: '8px',
                                border: '1px solid #ddd',
                                backgroundColor: '#f2f2f2',
                                fontWeight: 'bold',
                                textAlign: 'left'
                            }}>Оновити вручнну
                            </th>
                        }

                    </tr>
                    </thead>
                    <tbody>
                    {xmlFiles.data.map((xmlFile) => (

                        <tr
                            key={xmlFile.id}
                            onDoubleClick={() => handleDoubleClick(xmlFile.id)}
                        >

                            <td style={{
                                padding: '8px',
                                border: '1px solid #ddd',
                                width: '50px',
                                fontWeight: 'bold'
                            }}>{xmlFile.id}</td>

                            <td className='table-name'
                                style={{padding: '8px', border: '1px solid #ddd', width: '8%',}}>

                                <div style={{
                                    wordBreak: 'break-word'
                                }}>
                                    {xmlFile.custom_name}
                                </div>

                            </td>

                            <td className='table-name'
                                style={{padding: '8px', border: '1px solid #ddd', width: '8%',}}>
                                <div style={{
                                    wordBreak: 'break-word'
                                }}>
                                    {xmlFile.TLD}
                                </div>
                            </td>

                            {/*{ mode === 'view' &&*/}
                            {/*    <td className='table-description'*/}
                            {/*        style={{padding: '8px', border: '1px solid #ddd', width: '15%'}}>*/}
                            {/*        <div style={{*/}
                            {/*            wordBreak: 'break-word'*/}
                            {/*        }}>*/}
                            {/*            {xmlFile.description}*/}
                            {/*        </div>*/}
                            {/*    </td>*/}
                            {/*}*/}

                            {mode === 'view' &&

                                <td style={{
                                    padding: '8px',
                                    border: '1px solid #ddd'
                                }}>{format(new Date(xmlFile.uploadDateTime), 'dd.MM')}</td>

                            }

                            {mode === 'view' &&

                                <td style={{
                                    padding: '8px',
                                    border: '1px solid #ddd'
                                }}>{format(new Date(xmlFile.uploadDateTime), 'HH:mm:ss')}</td>

                            }

                            <td style={{padding: '8px', border: '1px solid #ddd', textAlign: 'center'}}>


                                {xmlFile.type === 'file' ? (
                                    <FaFile style={{color: '#6a4730', fontSize: '20px'}}/>
                                ) : (
                                    <FaGlobe style={{color: '#28640b', fontSize: '20px'}}/>
                                )}

                            </td>

                            <td className='table-link'
                                style={{padding: '8px', border: '1px solid #ddd'}}>

                                <div style={{

                                    overflow: 'hidden',
                                    wordBreak: 'break-word'
                                }}>
                                    {xmlFile.source_file_link}
                                </div>


                            </td>

                            <td style={{
                                padding: '8px',
                                border: '1px solid #ddd',
                                width: '300px',
                            }}>
                                <div style={{
                                    display: 'flex', width: '300px',
                                    justifyContent: 'space-between'
                                }}>

                                    {xmlFile.translated_products && xmlFile.translated_products.translatedCount && xmlFile.translated_products.total ? (
                                        <>
                                            {xmlFile.translated_products.translatedCount !== xmlFile.translated_products.total ? (
                                                <>
                                                    <div style={{
                                                        padding: '8px',
                                                        border: '1px solid #ddd',
                                                        backgroundColor: '#f59595',
                                                        borderRadius: '4px'
                                                    }}>
                                                        Не
                                                        закінчено {xmlFile.translated_products.translatedCount} / {xmlFile.translated_products.total}
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div style={{
                                                        padding: '8px',
                                                        border: '1px solid rgb(221, 221, 221)',
                                                        backgroundColor: '#5a8f28',
                                                        borderRadius: '4px',
                                                        color: '#ffffff'
                                                    }}>
                                                        {xmlFile.translated_products.translatedCount} / {xmlFile.translated_products.total} Переклад
                                                        готовий
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <div style={{
                                                padding: '8px',
                                                border: '1px solid #ddd',
                                                backgroundColor: 'lightyellow',
                                                borderRadius: '4px'
                                            }}>
                                                Дані відсутні
                                            </div>
                                        </>
                                    )}

                                    <div className="translate-svg-div">
                                        <FaLanguage
                                            className="translate-svg"
                                            onClick={() => handleEdit(xmlFile.id)}
                                        />

                                    </div>


                                </div>
                            </td>

                            {mode === 'view' &&
                                <td style={{border: '1px solid #ddd', textAlign: 'center', width: '100px'}}>
                                    <FaEdit
                                        className="settigns-svg"
                                        onClick={() => handleMod(xmlFile.id)}
                                    />
                                </td>
                            }

                            <td style={{border: '1px solid #ddd', textAlign: 'center', width: '100px'}}>
                                <a target='_blank'
                                   href={`/api/show/${xmlFile.id}`}>
                                    <FaLink
                                        className="link-svg"
                                    />
                                </a>
                            </td>

                            {mode === 'view' &&

                                <td style={{
                                    width: '100px',
                                    fontSize: '14px',
                                    textAlign: 'center',
                                    border: '1px solid #ddd',

                                }}>
                                    <FaTimes
                                        className="delete-svg"
                                        onClick={() => handleDelete(xmlFile.id)}
                                    />
                                </td>
                            }

                            {mode === 'sync' &&
                                <td style={{
                                    width: '100px',
                                    fontSize: '14px',
                                    textAlign: 'center',
                                    border: '1px solid #ddd',
                                }}>
                                    {xmlFile.new_last_update}

                                </td>
                            }

                            {mode === 'sync' &&
                                <td style={{
                                    width: '100px',
                                    fontSize: '14px',
                                    textAlign: 'center',
                                    border: '1px solid #ddd',
                                }}>
                                    {xmlFile.converter_type}
                                </td>
                            }

                            {mode === 'sync' &&
                                <td style={{
                                    width: '100px',
                                    fontSize: '14px',
                                    textAlign: 'center',
                                    border: '1px solid #ddd',
                                }}>
                                    {xmlFile.classic_converter_name}
                                </td>
                            }
                            {mode === 'sync' &&
                                <td style={{
                                    width: '100px',
                                    fontSize: '14px',
                                    textAlign: 'center',
                                    border: '1px solid #ddd',
                                }}>
                                    <input
                                        data-xml-id={xmlFile.id}
                                        className="shync-checkbox"
                                        type="checkbox"
                                        name="isTranslateName"
                                        checked={xmlFile.xml_settings?.allow_update || false}
                                        onChange={(e) => handleUpdateable
                                        (
                                            xmlFile.id,
                                            e.target.checked
                                        )
                                        }
                                    />
                                </td>
                            }

                            {mode === 'sync' &&
                                <td style={{
                                    width: '100px',
                                    fontSize: '14px',
                                    textAlign: 'center',
                                    border: '1px solid #ddd',
                                }}>
                                    {syncStatus[xmlFile.id] ? (
                                        // Если статус синхронизации для текущей записи true, показываем иконку загрузки
                                        <FaSpinner className="link-svg"/>
                                    ) : (
                                        // Если статус синхронизации для текущей записи false, показываем иконку синхронизации
                                        <FaSync onClick={() => handleSync(xmlFile.id)} className="link-svg"/>
                                    )}
                                </td>
                            }

                        </tr>
                    ))}
                    </tbody>
                    <tfoot>
                    <tr>
                        <td colSpan="6" style={{textAlign: 'center'}}>
                            <br></br>
                            {xmlFiles.links.length > 0 && (
                                <ul className="pagination">
                                    {xmlFiles.links.map((link, key) => (
                                        <li key={key} className={`page-item ${link.active ? 'active' : ''}`}>
                                            {link.label !== "..." ? (
                                                    <p onClick={() => changePage(link.url.match(/page=(\d+)/)?.[1])}
                                                       className="page-link">
                                                        {link.label.replace(/&laquo;/g, '').replace(/&raquo;/g, '')}
                                                    </p>
                                                ) :
                                                <p className="page-link">
                                                    ...
                                                </p>
                                            }
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </td>
                    </tr>
                    </tfoot>
                </table>
            </div>

            {isEditFormOpen && <EditForm productId={editingProductId} onClose={closeEditForm}/>}

            {isModFormOpen && <ModForm xml_id={modProductId} onClose={closeModForm}/>}

            {isXmlEditFormOpen && <XmlEditForm xml_id={editXmlId} onClose={closeEditXmlForm}/>}

            setIsXmlEditFormOpen

        </div>
    );
};

export default List;
