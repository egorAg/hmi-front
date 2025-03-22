import axios from 'axios';

const API_URL = 'http://localhost:3400';

export const login = async ( email: string, password: string ) => {
    try {
        const response = await axios.post( `${ API_URL }/auth/login`, {
            email,
            password,
        } );
        return response.data.access_token; // Возвращаем JWT токен
    } catch ( error ) {
        console.error( 'Ошибка при авторизации:', error );
        throw new Error( 'Ошибка при авторизации' );
    }
};

export const register = async ( email: string, password: string ) => {
    try {
        const response = await axios.post( `${ API_URL }/auth/register`, {
            email,
            password,
        } );
        return response.data;
    } catch ( error ) {
        console.error( 'Ошибка при регистрации:', error );
        throw new Error( 'Ошибка при регистрации' );
    }
};
