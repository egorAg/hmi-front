import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/apiService'; // Импортируем функцию для регистрации

const RegisterPage: React.FC = () => {
    const [ email, setEmail ] = useState( '' );
    const [ password, setPassword ] = useState( '' );
    const [ error, setError ] = useState( '' );
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            await register( email, password ); // Вызываем функцию для регистрации
            navigate( '/login' ); // После регистрации перенаправляем на страницу логина
        } catch ( e ) {
            setError( 'Ошибка при регистрации' );
        }
    };

    return (
        <div style={ { width: 300, margin: '0 auto', paddingTop: 100 } }>
            <h2>Регистрация</h2>
            <TextField
                label="Email"
                variant="outlined"
                fullWidth
                value={ email }
                onChange={ ( e ) => setEmail( e.target.value ) }
                style={ { marginBottom: 20 } }
            />
            <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                value={ password }
                onChange={ ( e ) => setPassword( e.target.value ) }
                style={ { marginBottom: 20 } }
            />
            <Button variant="contained" color="primary" fullWidth onClick={ handleRegister }>
                Зарегистрироваться
            </Button>
            { error && <p style={ { color: 'red' } }>{ error }</p> }
        </div>
    );
};

export default RegisterPage;
