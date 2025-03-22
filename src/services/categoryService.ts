import axios from 'axios';

const API_URL = 'http://localhost:3400'; // Укажи свой API

// Получение списка категорий
export const getCategories = async (page: number = 1, limit: number = 10) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Необходимо авторизоваться');
  }

  try {
    const response = await axios.get(`${API_URL}/categories`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { page, limit },
    });

    console.log('Ответ от сервера с категориями:', response.data);

    return response.data; // Возвращаем массив категорий
  } catch (error) {
    console.error('Ошибка при получении категорий:', error);
    throw new Error('Ошибка при получении категорий');
  }
};

// Создание категории
export const createCategory = async (name: string) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Необходимо авторизоваться');
  }

  try {
    const response = await axios.post(
      `${API_URL}/categories`,
      { name },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log('Ответ от сервера при создании категории:', response.data);
    return response.data; // Возвращаем данные о созданной категории
  } catch (error) {
    console.error('Ошибка при создании категории:', error);
    throw new Error('Ошибка при создании категории');
  }
};

// Обновление категории
export const updateCategory = async (id: string, name: string) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Необходимо авторизоваться');
  }

  try {
    const response = await axios.patch(
      `${API_URL}/categories`,
      { id, name },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log('Ответ после обновления категории:', response.data);
    return response.data; // Возвращаем обновленную категорию
  } catch (error) {
    console.error('Ошибка при обновлении категории:', error);
    throw new Error('Ошибка при обновлении категории');
  }
};

// Удаление категории
export const deleteCategory = async (id: string) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Необходимо авторизоваться');
  }

  try {
    const response = await axios.delete(`${API_URL}/categories/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Ответ после удаления категории:', response.data);
    return response.data; // Возвращаем подтверждение удаления
  } catch (error) {
    console.error('Ошибка при удалении категории:', error);
    throw new Error('Ошибка при удалении категории');
  }
};