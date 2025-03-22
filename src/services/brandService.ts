import axios from 'axios';

const API_URL = 'http://localhost:3400'; // Укажи свой API

export const getBrands = async ( page: number = 1, limit: number = 10 ) => {
    const token = localStorage.getItem( 'token' );
    if ( !token ) {
        throw new Error( 'Необходимо авторизоваться' );
    }

    try {
        const response = await axios.get( `${ API_URL }/brands`, {
            headers: {
                Authorization: `Bearer ${ token }`,
            },
            params: { page, limit },
        } );

        console.log( "Ответ от сервера с брендами:", response.data ); // Логируем ответ сервера

        return response.data; // Убедитесь, что тут возвращаются правильные данные (например, { data: [...brands], totalCount: ... })
    } catch ( error ) {
        console.error( 'Ошибка при получении брендов:', error );
        throw new Error( 'Ошибка при получении брендов' );
    }
};


// Функция для создания нового бренда
export const createBrand = async ( name: string ) => {
    try {
        const response = await axios.post(
            `${ API_URL }/brands`,
            { name },
            {
                headers: {
                    Authorization: `Bearer ${ localStorage.getItem( 'token' ) }`,
                },
            }
        );
        return response.data; // Возвращаем данные о созданном бренде
    } catch ( error ) {
        console.error( 'Ошибка при создании бренда:', error );
        throw new Error( 'Ошибка при создании бренда' );
    }
};

// Функция для получения бренда по ID
export const getBrandById = async ( id: string ) => {
    try {
        const response = await axios.get( `${ API_URL }/brands/${ id }`, {
            headers: {
                Authorization: `Bearer ${ localStorage.getItem( 'token' ) }`,
            },
        } );
        return response.data; // Возвращаем данные о бренде
    } catch ( error ) {
        console.error( 'Ошибка при получении бренда по ID:', error );
        throw new Error( 'Ошибка при получении бренда' );
    }
};

// Функция для обновления бренда
export const updateBrand = async ( id: string, name: string ) => {
    const token = localStorage.getItem( 'token' );
    if ( !token ) {
        throw new Error( 'Необходимо авторизоваться' );
    }

    try {
        const response = await axios.patch(
            `${ API_URL }/brands`,
            { id, name },  // Передаем id и name в теле запроса
            {
                headers: {
                    Authorization: `Bearer ${ token }`,
                },
            }
        );

        console.log( 'Ответ после обновления бренда:', response.data );
        return response.data; // Возвращаем обновленный бренд
    } catch ( error ) {
        console.error( 'Ошибка при обновлении бренда:', error );
        throw new Error( 'Ошибка при обновлении бренда' );
    }
};

// Функция для удаления бренда
export const deleteBrand = async ( id: string ) => {
    try {
        const response = await axios.delete( `${ API_URL }/brands/${ id }`, {
            headers: {
                Authorization: `Bearer ${ localStorage.getItem( 'token' ) }`,
            },
        } );
        return response.data; // Возвращаем подтверждение удаления
    } catch ( error ) {
        console.error( 'Ошибка при удалении бренда:', error );
        throw new Error( 'Ошибка при удалении бренда' );
    }
};
