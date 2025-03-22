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
    const [ products, setProducts ] = useState<any[]>( [] );
    const [ categories, setCategories ] = useState<any[]>( [] );
    const [ brands, setBrands ] = useState<any[]>( [] );
    const [ categoryId, setCategoryId ] = useState<string | undefined>( '' );
    const [ brandId, setBrandId ] = useState<string | undefined>( '' );
    const [ page, setPage ] = useState<number>( 1 );
    const [ limit, setLimit ] = useState<number>( 10 );
    const [ total, setTotal ] = useState<number>( 0 );
    const [ loading, setLoading ] = useState<boolean>( true );
    const [ openDialog, setOpenDialog ] = useState<boolean>( false );
    const [ productName, setProductName ] = useState<string>( '' );
    const [ productDescription, setProductDescription ] = useState<string>( '' );
    const [ productPrice, setProductPrice ] = useState<number>( 0 );
    const [ selectedCategoryId, setSelectedCategoryId ] = useState<string>( '' );
    const [ selectedBrandId, setSelectedBrandId ] = useState<string>( '' );
    const [ categoriesPage, setCategoriesPage ] = useState<number>( 1 );
    const [ brandsPage, setBrandsPage ] = useState<number>( 1 );
    const [ categoriesLoading, setCategoriesLoading ] = useState<boolean>( false );
    const [ brandsLoading, setBrandsLoading ] = useState<boolean>( false );

    // --- Новое состояние для второго шага ---
    const [ createdProductId, setCreatedProductId ] = useState<string | null>( null );
    const [ imageFile, setImageFile ] = useState<File | null>( null );
    const [ uploading, setUploading ] = useState<boolean>( false );

    const loadProducts = async () => {
        try {
            setLoading( true );
            const { data, totalCount } = await getProducts( page, limit, categoryId, brandId );
            setProducts( data );
            setTotal( totalCount );
            setLoading( false );
        } catch ( error ) {
            console.error( 'Ошибка при загрузке продуктов:', error );
            setLoading( false );
        }
    };

    const loadCategories = async () => {
        if ( categoriesLoading ) return;
        setCategoriesLoading( true );
        try {
            const { data } = await getCategories( categoriesPage, limit );
            if ( Array.isArray( data ) ) {
                setCategories( ( prev ) => {
                    const unique = [
                        ...prev,
                        ...data.filter( ( item ) => !prev.some( ( cat ) => cat.id === item.id ) )
                    ];
                    return unique;
                } );
                setCategoriesPage( ( prev ) => prev + 1 );
            }
            setCategoriesLoading( false );
        } catch ( error ) {
            console.error( 'Ошибка при загрузке категорий:', error );
            setCategoriesLoading( false );
        }
    };

    const loadBrands = async () => {
        if ( brandsLoading ) return;
        setBrandsLoading( true );
        try {
            const { brands: data } = await getBrands( brandsPage, limit );
            setBrands( ( prev ) => {
                const unique = [
                    ...prev,
                    ...data.filter( ( item: any ) => !prev.some( ( brand ) => brand.id === item.id ) )
                ];
                return unique;
            } );
            setBrandsPage( ( prev ) => prev + 1 );
            setBrandsLoading( false );
        } catch ( error ) {
            console.error( 'Ошибка при загрузке брендов:', error );
            setBrandsLoading( false );
        }
    };

    const handleDeleteProduct = async ( id: string ) => {
        try {
            await deleteProduct( id );
            setProducts( ( prev ) => prev.filter( ( p ) => p.id !== id ) );
        } catch ( error ) {
            console.error( 'Ошибка при удалении продукта:', error );
        }
    };

    const handleCreateProduct = async () => {
        try {
            const created = await createProduct(
                productName,
                productDescription,
                productPrice,
                selectedCategoryId,
                selectedBrandId
            );
            setOpenDialog( false );
            setCreatedProductId( created.id ); // Переход ко второму шагу
            loadProducts();
        } catch ( error ) {
            console.error( 'Ошибка при создании продукта:', error );
        }
    };

    const handleCategoryChange = ( event: any ) => {
        setCategoryId( event.target.value );
        setPage( 1 );
        loadProducts();
    };

    const handleBrandChange = ( event: any ) => {
        setBrandId( event.target.value );
        setPage( 1 );
        loadProducts();
    };

    useEffect( () => {
        loadCategories();
        loadBrands();
        loadProducts();
    }, [ page, limit, categoryId, brandId ] );

    return (
        <div>
            <Typography variant="h4">Продукты</Typography>
            <Button variant="contained" color="primary" onClick={ () => setOpenDialog( true ) }>
                Добавить продукт
            </Button>

            <div style={ { marginBottom: 20 } }>
                <FormControl fullWidth>
                    <InputLabel>Категория</InputLabel>
                    <Select value={ categoryId || '' } onChange={ handleCategoryChange } label="Категория">
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
                    <Select value={ brandId || '' } onChange={ handleBrandChange } label="Бренд">
                        <MenuItem value="">Все бренды</MenuItem>
                        { brands.map( ( brand ) => (
                            <MenuItem key={ brand.id } value={ brand.id }>
                                { brand.name }
                            </MenuItem>
                        ) ) }
                    </Select>
                </FormControl>
            </div>

            <div>
                { loading ? (
                    <Typography>Загрузка...</Typography>
                ) : products.length === 0 ? (
                    <Typography>Нет продуктов для отображения.</Typography>
                ) : (
                    <ul>
                        { products.map( ( product ) => (
                            <li key={ product.id }>
                                <div>
                                    <Typography variant="body1">{ product.name }</Typography>
                                    <Typography variant="body2">{ product.description }</Typography>
                                    <Typography variant="body1">{ product.price } ₽</Typography>
                                    { product.images && product.images.length > 0 && (
                                        <div>
                                            <img
                                                src={ `http://${ API_URL }/${ product.images[ 0 ].url }` }
                                                alt={ product.name }
                                                style={ { maxWidth: 200, maxHeight: 200 } }
                                            />
                                        </div>
                                    ) }
                                    <Button onClick={ () => handleDeleteProduct( product.id ) } color="secondary">
                                        Удалить
                                    </Button>
                                </div>
                            </li>
                        ) ) }
                    </ul>
                ) }
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

            {/* Диалог создания продукта — первый шаг */ }
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

            {/* Диалог загрузки изображения — второй шаг */ }
            <Dialog open={ !!createdProductId } onClose={ () => setCreatedProductId( null ) }>
                <DialogTitle>Загрузить изображение</DialogTitle>
                <DialogContent>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={ ( e ) => {
                            if ( e.target.files && e.target.files.length > 0 ) {
                                setImageFile( e.target.files[ 0 ] );
                            }
                        } }
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={ () => setCreatedProductId( null ) } color="secondary">
                        Пропустить
                    </Button>
                    <Button
                        onClick={ async () => {
                            if ( !imageFile || !createdProductId ) return;

                            const formData = new FormData();
                            formData.append( 'productId', createdProductId );
                            formData.append( 'file', imageFile );

                            setUploading( true );
                            try {
                                await fetch( 'http://localhost:3400/product-image/upload', {
                                    method: 'POST',
                                    headers: {
                                        Authorization: `Bearer ${ localStorage.getItem( 'token' ) || '' }`,
                                    },
                                    body: formData,
                                } );

                                setCreatedProductId( null );
                                setImageFile( null );
                                loadProducts(); // обновим список продуктов
                            } catch ( err ) {
                                console.error( 'Ошибка при загрузке изображения:', err );
                            } finally {
                                setUploading( false );
                            }
                        } }
                        color="primary"
                        disabled={ !imageFile || uploading }
                    >
                        { uploading ? 'Загрузка...' : 'Загрузить' }
                    </Button>

                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ProductPage;
