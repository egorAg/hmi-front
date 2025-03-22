import React, { useEffect } from 'react';
import { Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
    const navigate = useNavigate();

    useEffect( () => {
        const token = localStorage.getItem( 'token' );
        if ( !token ) {
            navigate( '/login' ); // Если токена нет, перенаправляем на страницу логина
        }
    }, [ navigate ] );

    return (
        <div>
            <Typography variant="h4">Добро пожаловать в админ-панель!</Typography>
            <Button
                variant="contained"
                color="secondary"
                style={ { marginTop: 20 } }
                onClick={ () => {
                    localStorage.removeItem( 'token' );
                    navigate( '/login' );
                } }
            >
                Выйти
            </Button>
        </div>
    );
};

export default DashboardPage;
