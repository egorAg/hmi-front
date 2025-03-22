import { Button, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { createCategory, deleteCategory, getCategories, updateCategory } from '../services/categoryService';

const CategoryPage: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]); // Список категорий
  const [newCategoryName, setNewCategoryName] = useState<string>(''); // Имя новой категории
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null); // Выбранная категория
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>(''); // Имя выбранной категории
  const [page, setPage] = useState<number>(1); // Номер страницы для пагинации
  const [limit, setLimit] = useState<number>(10); // Лимит на количество категорий на странице
  const [total, setTotal] = useState<number>(0); // Общее количество категорий
  const [loading, setLoading] = useState<boolean>(true); // Состояние загрузки

  // Загрузка списка категорий с пагинацией
  const loadCategories = async () => {
    try {
      setLoading(true); // Начинаем загрузку
      const { data, totalCount } = await getCategories(page, limit); // Получаем категории с пагинацией
      console.log('Данные категорий, полученные с сервера:', data); // Логируем данные

      setCategories(data); // Сохраняем список категорий
      setTotal(totalCount); // Сохраняем общее количество категорий
      setLoading(false); // Окончание загрузки
    } catch (error) {
      console.error('Ошибка при загрузке категорий:', error);
      setLoading(false); // Окончание загрузки, даже если произошла ошибка
    }
  };

  useEffect(() => {
    loadCategories();
  }, [page, limit]); // Загружаем категории при изменении пагинации

  // Обработчик для добавления новой категории
  const handleAddCategory = async () => {
    try {
      const newCategory = await createCategory(newCategoryName); // Создаем новую категорию
      setNewCategoryName(''); // Очищаем поле ввода
      setCategories(prevCategories => [...prevCategories, newCategory]); // Добавляем новую категорию в список
      setTotal(prevTotal => prevTotal + 1); // Увеличиваем количество категорий
    } catch (error) {
      console.error('Ошибка при добавлении категории:', error);
    }
  };

  // Обработчик для обновления категории
  const handleUpdateCategory = async () => {
    if (selectedCategoryId) {
      try {
        // Отправляем запрос на обновление категории
        await updateCategory(selectedCategoryId, selectedCategoryName);
        setSelectedCategoryId(null);  // Сбрасываем выбранную категорию
        setSelectedCategoryName('');  // Очищаем имя выбранной категории
        loadCategories();  // Перезагружаем список категорий
      } catch (error) {
        console.error('Ошибка при обновлении категории:', error);
      }
    }
  };

  // Обработчик для удаления категории
  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteCategory(id);
      loadCategories(); // Перезагружаем список категорий после удаления
    } catch (error) {
      console.error('Ошибка при удалении категории:', error);
    }
  };

  return (
    <div>
      <Typography variant="h4">Категории</Typography>

      {/* Форма для добавления новой категории */}
      <div>
        <TextField
          label="Название категории"
          variant="outlined"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          style={{ marginBottom: 20 }}
        />
        <Button variant="contained" color="primary" onClick={handleAddCategory}>
          Добавить категорию
        </Button>
      </div>

      {/* Список категорий с пагинацией */}
      <div>
        <Typography variant="h6" style={{ marginTop: 20 }}>
          Существующие категории
        </Typography>
        {loading ? (
          <Typography>Загрузка...</Typography> // Отображаем сообщение, пока идет загрузка
        ) : categories.length === 0 ? (
          <Typography>Нет категорий для отображения.</Typography> // Если категории не найдены
        ) : (
          <ul>
            {categories.map((category) => (
              <li key={category.id}>
                <div>
                  {selectedCategoryId === category.id ? (
                    <div>
                      <TextField
                        value={selectedCategoryName}
                        onChange={(e) => setSelectedCategoryName(e.target.value)}
                      />
                      <Button onClick={handleUpdateCategory}>Обновить</Button>
                    </div>
                  ) : (
                    <span>{category.name}</span>
                  )}

                  <Button onClick={() => handleDeleteCategory(category.id)}>Удалить</Button>
                        <Button onClick={() => { setSelectedCategoryId(category.id); setSelectedCategoryName(category.name) }}>
                    Редактировать
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Пагинация */}
        <div>
          <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Предыдущая
          </Button>
          <span>{page}</span>
          <Button disabled={categories.length < limit} onClick={() => setPage(page + 1)}>
            Следующая
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;