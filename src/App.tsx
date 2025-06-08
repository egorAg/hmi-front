import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Drawer } from '@mui/material';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CategoryPage from './pages/CategoryPage';
import BrandPage from './pages/BrandPage';
import ProductPage from './pages/ProductPage';
import Sidebar from './components/Sidebar';

const drawerWidth = 240;

const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log('Token from localStorage:', token); // Для отладки
        if (token) {
            setIsAuthenticated(true); // Если токен есть, считаем, что пользователь авторизован
        }
    }, []);

    return (
        <Router>
            <div style={{ display: 'flex' }}>
                {/* Только если пользователь авторизован, показываем Sidebar */}
                {isAuthenticated && (
                    <Drawer
                        sx={{
                            width: drawerWidth,
                            flexShrink: 0,
                            '& .MuiDrawer-paper': {
                                width: drawerWidth,
                                boxSizing: 'border-box',
                            },
                        }}
                        variant="permanent"
                        anchor="left"
                    >
                        <Sidebar />
                    </Drawer>
                )}

                <div style={{ flexGrow: 1, padding: '16px' }}>
                    <Routes>
                        {/* Редирект с корня */}
                        <Route
                            path="/"
                            element={
                                isAuthenticated ? (
                                    <Navigate to="/dashboard" />
                                ) : (
                                    <Navigate to="/login" />
                                )
                            }
                        />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/categories" element={<CategoryPage />} />
                        <Route path="/brands" element={<BrandPage />} />
                        <Route path="/products" element={<ProductPage />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;
