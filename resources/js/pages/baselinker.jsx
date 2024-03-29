import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Head } from "@inertiajs/inertia-react";

function BaselinkerForm() {
    const [method, setMethod] = useState('none'); // Состояние для выбранного метода
    const [formData, setFormData] = useState({});
    const [inventoryId, setInventoryId] = useState(''); // Состояние для поля inventory_id
    const [storageId, setStorageId] = useState('');
    const [productIds, setProductIds] = useState([]); // Состояние для выбора product_id
    const [availableProductIds, setAvailableProductIds] = useState([]); // Состояние для доступных вариантов product_id
    const [newProductId, setNewProductId] = useState(''); // Состояние для нового product_id
    const [token, setToken] = useState('3008835-3032017-6DJYSAMAPZR3WFS0MN9KGAQ75CMQ74VLWU6KR5DE05NJGOT0LG3L0PQFHR3H6HSD'); // Состояние для токена

    // Обработчик изменения выбранного метода
    const handleMethodChange = (event) => {
        setMethod(event.target.value);
    };

    // Обработчик отправки данных
    const handleSubmit = (event) => {
        event.preventDefault();
        // Отправляем данные методом Inertia.post
        Inertia.post('/api/baselinker', { method, inventory_id: inventoryId, token, storageId, ...formData, products: productIds });
    };

    // Обработчик изменения доступных вариантов product_id
    const handleAvailableProductIdsChange = (event) => {
        setProductIds([...event.target.options].map((option) => option.value));
    };

    // Обработчик добавления нового product_id
    const handleAddNewProduct = () => {
        if (newProductId) {
            setAvailableProductIds([...availableProductIds, newProductId]);
            setNewProductId('');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <Head>
                    <style>{`
                        /* Основной контейнер формы */
                        .form-container {
                            max-width: 700px;
                            margin: 0 auto;
                            padding: 20px;
                            border: 1px solid #ccc;
                            border-radius: 5px;
                            background: #fff;
                        }

                        /* Стили для полей ввода */
                        .form-group {
                            margin-bottom: 20px;
                        }

                        .form-group label {
                            display: block;
                            font-weight: bold;
                            margin-bottom: 5px;
                        }

                        .form-group input[type="text"],
                        .form-group select {
                            width: 100%;
                            padding: 10px;
                            border: 1px solid #ccc;
                            border-radius: 5px;
                            font-size: 16px;
                        }

                        /* Стили для кнопки отправки */
                        .submit-button {
                            display: block;
                            width: 100%;
                            padding: 10px;
                            background: #007BFF;
                            color: #fff;
                            border: none;
                            border-radius: 5px;
                            font-size: 16px;
                            cursor: pointer;
                        }

                        .ids{
                            width:100%;
                        }

                        /* Стили для добавления нового product_id */
                        .add-product-button {
                            display: block;
                            padding: 5px 10px;
                            background: #007BFF;
                            color: #fff;
                            border: none;
                            border-radius: 5px;
                            font-size: 14px;
                            cursor: pointer;
                        }
                    `}</style>
                </Head>

                <div className="form-container">
                    <div className="form-group">
                        <label>X-BLToken</label>
                        <br/>
                        <input
                            type="text"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                        />
                        <br/><br/>
                        <label>Выберите метод:</label>
                        <select value={method} onChange={handleMethodChange}>
                            <option value="">Выберите метод</option>
                            <option value="getInventories">getInventories</option>
                            <option value="getInventoryCategories">getInventoryCategories</option>
                            <option value="getInventoryProductsList">getInventoryProductsList</option>
                            <option value="getStoragesList">getStoragesList</option>
                            <option value="getProductsList">getProductsList</option>
                            <option value="getProductsData">getProductsData</option>
                        </select>
                    </div>
                    <br/>
                    {method === 'getInventoryCategories' && (
                        <div>
                            <label>inventory_id</label>
                            <input
                                type="text"
                                value={inventoryId}
                                onChange={(event) => setInventoryId(event.target.value)}
                            />
                        </div>
                    )}

                    {method === 'getInventoryProductsList' && (
                        <div>
                            <label>inventory_id</label>
                            <input
                                type="text"
                                value={inventoryId}
                                onChange={(event) => setInventoryId(event.target.value)}
                            />
                        </div>
                    )}

                    {method === 'getProductsList' && (
                        <div>
                            <label>storage_id</label>
                            <input
                                type="text"
                                value={storageId}
                                onChange={(event) => setStorageId(event.target.value)}
                            />
                        </div>
                    )}
                    {method === 'getProductsData' && (
                        <div>
                            <label>Добавьте product_ids:</label>
                            <select className="ids" multiple onChange={handleAvailableProductIdsChange}>
                                {availableProductIds.map((productId) => (
                                    <option key={productId} value={productId}>
                                        {productId}
                                    </option>
                                ))}
                            </select>
                            <div>
                                <label>Добавить новый product_id:</label>
                                <input
                                    type="text"
                                    value={newProductId}
                                    onChange={(event) => setNewProductId(event.target.value)}
                                />
                                <button type="button" onClick={handleAddNewProduct}>
                                    Добавить
                                </button>
                            </div>
                        </div>
                    )}
                    <div>
                        <button type="submit">Отправить</button>
                    </div>
                </div>
            </div>
        </form>
    );
}

export default BaselinkerForm;
