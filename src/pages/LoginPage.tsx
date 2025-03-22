import React, { useState } from 'react';
import { Button, Link, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/apiService';

const LoginPage: React.FC = () => {
    const [ email, setEmail ] = useState( '' );
    const [ password, setPassword ] = useState( '' );
    const [ error, setError ] = useState( '' );
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const token = await login( email, password );
            console.log( token )
            localStorage.setItem( 'token', token );
            navigate( '/dashboard' );
        } catch ( e ) {
            setError( 'Неверные данные для входа' );
        }
    };

    return (
        <div style={ { width: 300, margin: '0 auto', paddingTop: 100 } }>
            <h2>Авторизация</h2>
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
            <Button variant="contained" color="primary" fullWidth onClick={ handleLogin }>
                Войти
            </Button>
            { error && <p style={ { color: 'red' } }>{ error }</p> }
            <div style={ { marginTop: 10 } }>
                <Link href="/register">Нет аккаунта? Зарегистрируйтесь!</Link>
            </div>
        </div>
    );
};

export default LoginPage;
