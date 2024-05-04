import React, {useState} from 'react';
import {Head, InertiaLink} from '@inertiajs/inertia-react';
import {format} from 'date-fns';
import {Inertia} from '@inertiajs/inertia'
import {Helmet} from 'react-helmet';
import Menu from '../menu/menu';

import EditForm from '../forms/EditForm'; // Import the EditForm component
import ModForm from '../forms/ModForm.jsx'; // Import the ModForm component

import { FaTrash } from 'react-icons/fa';
import { FaLanguage } from 'react-icons/fa';
import { FaLink } from 'react-icons/fa';
import { FaEdit } from 'react-icons/fa';
import { FaTimes } from 'react-icons/fa';

const List = ({xmlFiles}) => {

    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const [searchString, ssetSarchString] = useState('');
    const [perPage, setperPage] = useState(10);
    const [page, setPage] = useState(1);

    const [isEditFormOpen, setIsEditFormOpen] = useState(false);
    const [editingProductId, setEditingProductId] = useState(null); // Track the editing product ID

    const [isModFormOpen, setIsModFormOpen ] = useState(false);
    const [modProductId, setModProductId] = useState(null); // Track the editing product ID


    // Table font size
    const [fontSize, setFontSize] = useState(12);

    const handleFontSizeChange = (event) => {
        setFontSize(event.target.value); // Оновлюємо розмір шрифту на основі значення ползунка
    };
    //

    const openEditForm = () => {
        setIsEditFormOpen(true);
    };

    const closeEditForm = () => {
        setIsEditFormOpen(false);
    };

    const openModForm = () => {
        setIsModFormOpen(true);
    };

    const closeModForm = () => {
        setIsModFormOpen(false);
    };

    const handleEdit = (id) => {
        openEditForm(id);
        setEditingProductId(id); // Set the editing product ID when the "Edit" button is clicked
    };

    const handleMod = (id) => {
        openModForm(id);
        setModProductId(id); // Set the editing product ID when the "Edit" button is clicked
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
                page: page
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
                page: 1
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
                page: page
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
                    page: 1
                },
                preserveState: true
            });
            setSortColumn(null);
            setSortDirection('asc');
            ssetSarchString(searchString);
        }
    }

    return (
        <div className="p-3">


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
                }

                .file-table tbody tr:nth-child(even) {
                    background-color: #f9f9f9; /* Цвет фона для каждой второй строки */
                }

                 .file-table thead th {
                    height:60px;
                }

                .page-link{
                    font-size:16px;
                }

                .active>.page-link, .page-link.active {
                            background: #16A177;
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

                <table className='file-table' style={{ fontSize: `${fontSize}px` }}>
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
                            textAlign: 'left'
                        }}>Назва
                        </th>
                        <th onClick={() => sortBy('description')} style={{
                            cursor: 'pointer',
                            padding: '8px',
                            border: '1px solid #ddd',
                            backgroundColor: '#f2f2f2',
                            fontWeight: 'bold',
                            textAlign: 'left'
                        }}>Опис
                        </th>
                        <th onClick={() => sortBy('uploadDateTime')} style={{
                            cursor: 'pointer',
                            padding: '8px',
                            border: '1px solid #ddd',
                            backgroundColor: '#f2f2f2',
                            fontWeight: 'bold',
                            textAlign: 'left'
                        }}>Час завантаження
                        </th>

                        <th onClick={() => sortBy('type')} style={{
                            cursor: 'pointer',
                            padding: '8px',
                            border: '1px solid #ddd',
                            backgroundColor: '#f2f2f2',
                            fontWeight: 'bold',
                            textAlign: 'left'
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


                        <th style={{
                            padding: '8px',
                            border: '1px solid #ddd',
                            backgroundColor: '#f2f2f2',
                            fontWeight: 'bold',
                            textAlign: 'left'
                        }}>Лінк
                        </th>
                        <th style={{
                            width: '100px',
                            padding: '8px',
                            border: '1px solid #ddd',
                            backgroundColor: '#f2f2f2',
                            fontWeight: 'bold',
                            textAlign: 'left'
                        }}>Видалити
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {xmlFiles.data.map((xmlFile) => (

                        <tr key={xmlFile.id}>
                            <td style={{padding: '8px', border: '1px solid #ddd'}}>{xmlFile.id}</td>

                            <td className='table-name'
                                style={{padding: '8px', border: '1px solid #ddd'}}>{xmlFile.custom_name}</td>

                            <td className='table-description'
                                style={{padding: '8px', border: '1px solid #ddd'}}>{xmlFile.description}</td>

                            <td style={{
                                padding: '8px',
                                border: '1px solid #ddd'
                            }}>{format(new Date(xmlFile.uploadDateTime), 'dd.MM.yyyy HH:mm:ss')}</td>

                            <td style={{padding: '8px', border: '1px solid #ddd'}}>{xmlFile.type}</td>

                            <td className='table-link'
                                style={{padding: '8px', border: '1px solid #ddd'}}>{xmlFile.source_file_link}</td>

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

                            <td style={{border: '1px solid #ddd', textAlign: 'center', width: '100px'}}>
                                <FaEdit
                                    className="settigns-svg"
                                    onClick={() => handleMod(xmlFile.id)}
                                />
                            </td>

                            <td style={{border: '1px solid #ddd', textAlign: 'center', width: '100px'}}>
                                <a target='_blank'
                                   href={`/api/show/${xmlFile.id}`}>
                                    <FaLink
                                        className="link-svg"
                                    />
                                </a>
                            </td>

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

        </div>
    );
};

export default List;
