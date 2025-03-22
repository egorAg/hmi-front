import axios from 'axios';

const API_URL = 'http://localhost:3400'; // Укажи свой API

// Получение всех продуктов с пагинацией и фильтрами
export const getProducts = async ( page: number = 1, limit: number = 10, categoryId?: string, brandId?: string ) => {
    const token = localStorage.getItem( 'token' );
    if ( !token ) {
        throw new Error( 'Необходимо авторизоваться' );
    }

    try {
        const response = await axios.get( `${ API_URL }/products`, {
            headers: {
                Authorization: `Bearer ${ token }`,
            },
            params: {
                page,
                limit,
                categoryId, // Если фильтр категории передан
                brandId,    // Если фильтр бренда передан
            },
        } );

        console.log( 'Ответ от сервера с продуктами:', response.data ); // Логируем ответ от сервера

        return response.data; // Возвращаем массив продуктов и общее количество
    } catch ( error ) {
        console.error( 'Ошибка при получении продуктов:', error );
        throw new Error( 'Ошибка при получении продуктов' );
    }
};


// Удаление продукта по ID
export const deleteProduct = async ( id: string ) => {
    const token = localStorage.getItem( 'token' );
    if ( !token ) {
        throw new Error( 'Необходимо авторизоваться' );
    }

    try {
        await axios.delete( `${ API_URL }/products/${ id }`, {
            headers: {
                Authorization: `Bearer ${ token }`,
            },
        } );

        console.log( 'Продукт удалён успешно' );
    } catch ( error ) {
        console.error( 'Ошибка при удалении продукта:', error );
        throw new Error( 'Ошибка при удалении продукта' );
    }
};

// Создание продукта
export const createProduct = async ( name: string, description: string, price: number, categoryId: string, brandId: string ) => {
    const token = localStorage.getItem( 'token' );
    if ( !token ) {
        throw new Error( 'Необходимо авторизоваться' );
    }

    try {
        const response = await axios.post(
            `${ API_URL }/products`,
            { name, description, price, categoryId, brandId },
            {
                headers: {
                    Authorization: `Bearer ${ token }`,
                },
            }
        );

        console.log( 'Продукт создан успешно:', response.data );
        return response.data; // Возвращаем ID созданного продукта
    } catch ( error ) {
        console.error( 'Ошибка при создании продукта:', error );
        throw new Error( 'Ошибка при создании продукта' );
    }
};

// Загрузка изображения продукта
export const uploadProductImage = async ( productId: string, file: File ) => {
    const token = localStorage.getItem( 'token' );
    if ( !token ) {
        throw new Error( 'Необходимо авторизоваться' );
    }

    const formData = new FormData();
    formData.append( 'file', file );
    formData.append( 'productId', productId );

    try {
        const response = await axios.post( `${ API_URL }/product-image/upload`, formData, {
            headers: {
                Authorization: `Bearer ${ token }`,
                'Content-Type': 'multipart/form-data',
            },
        } );

        console.log( 'Изображение загружено успешно:', response.data );
        return response.data; // Возвращаем информацию о загруженном изображении
    } catch ( error ) {
        console.error( 'Ошибка при загрузке изображения:', error );
        throw new Error( 'Ошибка при загрузке изображения' );
    }
};
