import React, { useEffect, useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography
} from '@mui/material';
import { getBrands } from '../services/brandService';
import { getCategories } from '../services/categoryService';
import { createProduct, deleteProduct, getProducts } from '../services/productService';

const API_URL = 'localhost:3400';
const ProductPage: React.FC = () => {
    const [ products, setProducts ] = useState<any[]>( [] ); // Список продуктов
    const [ categories, setCategories ] = useState<any[]>( [] ); // Список категорий
    const [ brands, setBrands ] = useState<any[]>( [] ); // Список брендов
    const [ categoryId, setCategoryId ] = useState<string | undefined>( '' ); // ID выбранной категории
    const [ brandId, setBrandId ] = useState<string | undefined>( '' ); // ID выбранного бренда
    const [ page, setPage ] = useState<number>( 1 ); // Номер страницы для пагинации
    const [ limit, setLimit ] = useState<number>( 10 ); // Лимит на количество продуктов на странице
    const [ total, setTotal ] = useState<number>( 0 ); // Общее количество продуктов
    const [ loading, setLoading ] = useState<boolean>( true ); // Состояние загрузки
    const [ openDialog, setOpenDialog ] = useState<boolean>( false ); // Открытие/закрытие попапа
    const [ productName, setProductName ] = useState<string>( '' ); // Название продукта
    const [ productDescription, setProductDescription ] = useState<string>( '' ); // Описание продукта
    const [ productPrice, setProductPrice ] = useState<number>( 0 ); // Цена продукта
    const [ selectedCategoryId, setSelectedCategoryId ] = useState<string>( '' ); // ID категории
    const [ selectedBrandId, setSelectedBrandId ] = useState<string>( '' ); // ID бренда

    const [ categoriesPage, setCategoriesPage ] = useState<number>( 1 ); // Страница для категорий
    const [ brandsPage, setBrandsPage ] = useState<number>( 1 ); // Страница для брендов
    const [ categoriesLoading, setCategoriesLoading ] = useState<boolean>( false ); // Состояние загрузки категорий
    const [ brandsLoading, setBrandsLoading ] = useState<boolean>( false ); // Состояние загрузки брендов

    // Загрузка списка продуктов с пагинацией и фильтрацией
    const loadProducts = async () => {
        try {
            setLoading( true ); // Начинаем загрузку
            const { data, totalCount } = await getProducts( page, limit, categoryId, brandId ); // Получаем продукты с пагинацией и фильтрами
            console.log( 'Данные продуктов, полученные с сервера:', data ); // Логируем данные

            setProducts( data ); // Сохраняем список продуктов
            setTotal( totalCount ); // Сохраняем общее количество продуктов
            setLoading( false ); // Окончание загрузки
        } catch ( error ) {
            console.error( 'Ошибка при загрузке продуктов:', error );
            setLoading( false ); // Окончание загрузки, даже если произошла ошибка
        }
    };

    // Загрузка категорий с пагинацией
    const loadCategories = async () => {
        if ( categoriesLoading ) return; // Если уже идет загрузка, ничего не делаем

        setCategoriesLoading( true ); // Начинаем загрузку категорий

        try {
            const { data } = await getCategories( categoriesPage, limit ); // Получаем категории с API
            if ( Array.isArray( data ) ) { // Проверяем, что это массив
                setCategories( ( prevCategories ) => {
                    const uniqueCategories = [
                        ...prevCategories,
                        ...data.filter( ( newCategory: any ) => !prevCategories.some( ( existingCategory ) => existingCategory.id === newCategory.id ) )
                    ]; // Фильтруем дубликаты по id
                    return uniqueCategories;
                } ); // Дополняем список категорий
                setCategoriesPage( ( prevPage ) => prevPage + 1 ); // Увеличиваем страницу для следующих запросов
            } else {
                console.error( 'Ошибка: сервер вернул некорректный формат категорий', data );
            }
            setCategoriesLoading( false ); // Окончание загрузки категорий
        } catch ( error ) {
            console.error( 'Ошибка при загрузке категорий:', error );
            setCategoriesLoading( false );
        }
    };


    // Загрузка брендов с пагинацией
    const loadBrands = async () => {
        if ( brandsLoading ) return; // Если уже идет загрузка, ничего не делаем

        setBrandsLoading( true ); // Начинаем загрузку брендов

        try {
            const { brands } = await getBrands( brandsPage, limit ); // Получаем бренды с API
            setBrands( ( prevBrands ) => {
                const uniqueBrands = [
                    ...prevBrands,
                    ...brands.filter( ( newBrand: any ) => !prevBrands.some( ( existingBrand ) => existingBrand.id === newBrand.id ) )
                ]; // Фильтруем дубликаты по id
                return uniqueBrands;
            } ); // Дополняем список брендов
            setBrandsPage( ( prevPage ) => prevPage + 1 ); // Увеличиваем страницу для следующих запросов
            setBrandsLoading( false ); // Окончание загрузки брендов
        } catch ( error ) {
            console.error( 'Ошибка при загрузке брендов:', error );
            setBrandsLoading( false );
        }
    };


    // Обработчик для удаления продукта
    const handleDeleteProduct = async ( id: string ) => {
        try {
            await deleteProduct( id ); // Удаляем продукт
            setProducts( ( prevProducts ) => prevProducts.filter( ( product ) => product.id !== id ) ); // Убираем продукт из списка на клиенте
        } catch ( error ) {
            console.error( 'Ошибка при удалении продукта:', error );
        }
    };

    // Обработчик для создания нового продукта
    const handleCreateProduct = async () => {
        try {
            await createProduct( productName, productDescription, productPrice, selectedCategoryId, selectedBrandId );
            setOpenDialog( false ); // Закрываем попап после создания продукта
            loadProducts(); // Обновляем список продуктов
        } catch ( error ) {
            console.error( 'Ошибка при создании продукта:', error );
        }
    };

    // Обработчик для изменения категории
    const handleCategoryChange = ( event: any ) => {
        setCategoryId( event.target.value );
        setPage( 1 ); // Сбрасываем страницу для продуктов
        loadProducts(); // Загружаем продукты заново
    };

    // Обработчик для изменения бренда
    const handleBrandChange = ( event: any ) => {
        setBrandId( event.target.value );
        setPage( 1 ); // Сбрасываем страницу для продуктов
        loadProducts(); // Загружаем продукты заново
    };

    useEffect( () => {
        loadCategories(); // Загружаем категории при инициализации
        loadBrands(); // Загружаем бренды при инициализации
        loadProducts(); // Загружаем продукты
    }, [ page, limit, categoryId, brandId ] );

    return (
        <div>
            <Typography variant="h4">Продукты</Typography>

            {/* Кнопка для открытия попапа создания продукта */ }
            <Button variant="contained" color="primary" onClick={ () => setOpenDialog( true ) }>
                Добавить продукт
            </Button>

            {/* Фильтры для категории и бренда */ }
            <div style={ { marginBottom: 20 } }>
                <FormControl fullWidth>
                    <InputLabel>Категория</InputLabel>
                    <Select
                        value={ categoryId || '' }
                        onChange={ handleCategoryChange }
                        label="Категория"
                    >
                        <MenuItem value="">Все категории</MenuItem>
                        { categories.map( ( category ) => (
                            <MenuItem key={ category.id } value={ category.id }>
                                { category.name }
                            </MenuItem>
                        ) ) }
                    </Select>
                </FormControl>

                <FormControl fullWidth>
                    <InputLabel>Бренд</InputLabel>
                    <Select
                        value={ brandId || '' }
                        onChange={ handleBrandChange }
                        label="Бренд"
                    >
                        <MenuItem value="">Все бренды</MenuItem>
                        { brands.map( ( brand ) => (
                            <MenuItem key={ brand.id } value={ brand.id }>
                                { brand.name }
                            </MenuItem>
                        ) ) }
                    </Select>
                </FormControl>
            </div>

            {/* Список продуктов с пагинацией */ }
            <div>
                { loading ? (
                    <Typography>Загрузка...</Typography> // Отображаем сообщение, пока идет загрузка
                ) : products.length === 0 ? (
                    <Typography>Нет продуктов для отображения.</Typography> // Если продуктов не найдено
                ) : (
                    <ul>
                        { products.map( ( product ) => (
                            <li key={ product.id }>
                                <div>
                                    <Typography variant="body1">{ product.name }</Typography>
                                    <Typography variant="body2">{ product.description }</Typography>
                                    <Typography variant="body1">{ product.price } ₽</Typography>

                                    {/* Отображение изображений продуктов */ }
                                    { product.images && product.images.length > 0 && (
                                        <div>
                                            <img
                                                src={ `http://${ API_URL }/${ product.images[ 0 ].url }` }
                                                alt={ product.name }
                                                style={ { maxWidth: 200, maxHeight: 200 } }
                                            />
                                        </div>
                                    ) }

                                    {/* Кнопка для удаления продукта */ }
                                    <Button onClick={ () => handleDeleteProduct( product.id ) } color="secondary">
                                        Удалить
                                    </Button>
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
                    <Button disabled={ products.length < limit } onClick={ () => setPage( page + 1 ) }>
                        Следующая
                    </Button>
                </div>
            </div>

            {/* Модальное окно для создания продукта */ }
            <Dialog open={ openDialog } onClose={ () => setOpenDialog( false ) }>
                <DialogTitle>Создание продукта</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Название продукта"
                        variant="outlined"
                        fullWidth
                        style={ { marginBottom: 20 } }
                        value={ productName }
                        onChange={ ( e ) => setProductName( e.target.value ) }
                    />
                    <TextField
                        label="Описание"
                        variant="outlined"
                        fullWidth
                        style={ { marginBottom: 20 } }
                        value={ productDescription }
                        onChange={ ( e ) => setProductDescription( e.target.value ) }
                    />
                    <TextField
                        label="Цена"
                        variant="outlined"
                        fullWidth
                        style={ { marginBottom: 20 } }
                        value={ productPrice }
                        onChange={ ( e ) => setProductPrice( Number( e.target.value ) ) }
                        type="number"
                    />
                    <FormControl fullWidth style={ { marginBottom: 20 } }>
                        <InputLabel>Категория</InputLabel>
                        <Select
                            value={ selectedCategoryId }
                            onChange={ ( e ) => setSelectedCategoryId( e.target.value ) }
                            label="Категория"
                        >
                            { categories.map( ( category ) => (
                                <MenuItem key={ category.id } value={ category.id }>
                                    { category.name }
                                </MenuItem>
                            ) ) }
                        </Select>
                    </FormControl>
                    <FormControl fullWidth style={ { marginBottom: 20 } }>
                        <InputLabel>Бренд</InputLabel>
                        <Select
                            value={ selectedBrandId }
                            onChange={ ( e ) => setSelectedBrandId( e.target.value ) }
                            label="Бренд"
                        >
                            { brands.map( ( brand ) => (
                                <MenuItem key={ brand.id } value={ brand.id }>
                                    { brand.name }
                                </MenuItem>
                            ) ) }
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={ () => setOpenDialog( false ) } color="secondary">
                        Отмена
                    </Button>
                    <Button onClick={ handleCreateProduct } color="primary">
                        Создать
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ProductPage;
