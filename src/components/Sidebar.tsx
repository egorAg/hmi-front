import React from 'react';
import { Divider, Drawer, List, ListItem, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const Sidebar: React.FC = () => {
    const navigate = useNavigate();

    const handleNavigate = ( path: string ) => {
        navigate( path ); // Переход по маршруту
    };

    return (
        <Drawer
            sx={ {
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
            } }
            variant="permanent"
            anchor="left"
        >
            <div>
                <List>
                    <ListItem
                        component="button" // Указываем компонент как кнопку
                        onClick={ () => handleNavigate( '/dashboard' ) }
                    >
                        <ListItemText primary="Главная"/>
                    </ListItem>
                    <ListItem
                        component="button"
                        onClick={ () => handleNavigate( '/categories' ) }
                    >
                        <ListItemText primary="Категории"/>
                    </ListItem>
                    <ListItem
                        component="button"
                        onClick={ () => handleNavigate( '/brands' ) }
                    >
                        <ListItemText primary="Бренды"/>
                    </ListItem>
                    <ListItem
                        component="button"
                        onClick={ () => handleNavigate( '/products' ) }
                    >
                        <ListItemText primary="Продукты"/>
                    </ListItem>
                </List>
                <Divider/>
            </div>
        </Drawer>
    );
};

export default Sidebar;
