import React, { useEffect, useState } from 'react';
import { Button, TextField, Typography } from '@mui/material';
import { createBrand, deleteBrand, getBrandById, getBrands, updateBrand } from '../services/brandService';

const BrandPage: React.FC = () => {
    const [ brands, setBrands ] = useState<any[]>( [] ); // Список брендов
    const [ newBrandName, setNewBrandName ] = useState<string>( '' ); // Имя нового бренда
    const [ selectedBrandId, setSelectedBrandId ] = useState<string | null>( null ); // Выбранный бренд
    const [ selectedBrandName, setSelectedBrandName ] = useState<string>( '' ); // Имя выбранного бренда
    const [ page, setPage ] = useState<number>( 1 ); // Номер страницы для пагинации
    const [ limit, setLimit ] = useState<number>( 10 ); // Лимит на количество брендов на странице
    const [ total, setTotal ] = useState<number>( 0 ); // Общее количество брендов
    const [ loading, setLoading ] = useState<boolean>( true ); // Состояние загрузки

    // Загрузка списка брендов с пагинацией
    const loadBrands = async () => {
        try {
            setLoading( true ); // Начинаем загрузку
            const data = await getBrands( page, limit ); // Получаем бренды с пагинацией
            console.log( 'Данные брендов, полученные с сервера на странице:', data ); // Логируем данные брендов

            if ( data ) {
                setBrands( data?.brands ); // Сохраняем список брендов
                setTotal( data?.totalCount ); // Сохраняем общее количество брендов
            } else {
                setBrands( [] ); // Если данные не в формате массива, очищаем список
            }

            setLoading( false ); // Окончание загрузки
        } catch ( error ) {
            console.error( 'Ошибка при загрузке брендов:', error );
            setLoading( false ); // Окончание загрузки, даже если произошла ошибка
        }
    };

    useEffect( () => {
        loadBrands();
    }, [ page, limit ] ); // Загружаем бренды при изменении пагинации

    // Обработчик для добавления нового бренда
    const handleAddBrand = async () => {
        try {
            const newBrand = await createBrand( newBrandName ); // Создаем новый бренд
            setNewBrandName( '' ); // Очищаем поле ввода
            setBrands( prevBrands => [ ...prevBrands, newBrand ] ); // Добавляем новый бренд в список
            setTotal( prevTotal => prevTotal + 1 ); // Увеличиваем количество брендов
        } catch ( error ) {
            console.error( 'Ошибка при добавлении бренда:', error );
        }
    };

    // Обработчик для обновления бренда
    const handleUpdateBrand = async () => {
        if ( selectedBrandId ) {
            try {
                await updateBrand( selectedBrandId, selectedBrandName );
                setSelectedBrandId( null );
                setSelectedBrandName( '' );
                loadBrands(); // Перезагружаем список брендов после обновления
            } catch ( error ) {
                console.error( 'Ошибка при обновлении бренда:', error );
            }
        }
    };

    // Обработчик для удаления бренда
    const handleDeleteBrand = async ( id: string ) => {
        try {
            await deleteBrand( id );
            loadBrands(); // Перезагружаем список брендов после удаления
        } catch ( error ) {
            console.error( 'Ошибка при удалении бренда:', error );
        }
    };

    // Обработчик для получения одного бренда по ID
    const handleGetBrandById = async ( id: string ) => {
        try {
            const brand = await getBrandById( id );
            alert( `Бренд: ${ brand.name }` );
        } catch ( error ) {
            console.error( 'Ошибка при получении бренда по ID:', error );
        }
    };

    return (
        <div>
            <Typography variant="h4">Бренды</Typography>

            {/* Форма для добавления нового бренда */ }
            <div>
                <TextField
                    label="Название бренда"
                    variant="outlined"
                    value={ newBrandName }
                    onChange={ ( e ) => setNewBrandName( e.target.value ) }
                    style={ { marginBottom: 20 } }
                />
                <Button variant="contained" color="primary" onClick={ handleAddBrand }>
                    Добавить бренд
                </Button>
            </div>

            {/* Список брендов с пагинацией */ }
            <div>
                <Typography variant="h6" style={ { marginTop: 20 } }>
                    Существующие бренды
                </Typography>
                { loading ? (
                    <Typography>Загрузка...</Typography> // Отображаем сообщение, пока идет загрузка
                ) : brands.length === 0 ? (
                    <Typography>Нет брендов для отображения.</Typography> // Если бренды не найдены
                ) : (
                    <ul>
                        { brands.map( ( brand ) => (
                            <li key={ brand.id }>
                                <div>
                                    { selectedBrandId === brand.id ? (
                                        <div>
                                            <TextField
                                                value={ selectedBrandName }
                                                onChange={ ( e ) => setSelectedBrandName( e.target.value ) }
                                            />
                                            <Button onClick={ handleUpdateBrand }>Обновить</Button>
                                        </div>
                                    ) : (
                                        <span>{ brand.name }</span>
                                    ) }

                                    <Button onClick={ () => handleDeleteBrand( brand.id ) }>Удалить</Button>
                                    <Button
                                        onClick={ () => {
                                            setSelectedBrandId( brand.id );
                                            setSelectedBrandName( brand.name )
                                        } }>
                                        Редактировать
                                    </Button>
                                    <Button onClick={ () => handleGetBrandById( brand.id ) }>Получить по ID</Button>
                                </div>
                            </li>
                        ) ) }
                    </ul>
                ) }

                {/* Пагинация */ }
                <div>
                    <Button disabled={ page === 1 } onClick={ () => setPage( page - 1 ) }>
                        Предыдущая
                    </Button>
                    <span>{ page }</span>
                    <Button disabled={ brands.length < limit } onClick={ () => setPage( page + 1 ) }>
                        Следующая
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default BrandPage;