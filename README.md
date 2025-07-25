# Todo App (React + TypeScript + RTK Query)

Это тестовое приложение — список задач с возможностью создавать, редактировать, выполнять и удалять задачи.  
Данные хранятся в памяти и localStorage, а все операции эмулируются асинхронно через RTK Query (fakeBaseQuery).

## Функционал
- Создание/удаление/редактирование задач
- Фильтрация по статусу ("все", "активные", "выполненные")
- Валидация формы
- Асинхронность с лоадерами
- Оптимистичные апдейты UI
- Сохранение состояния задач между перезагрузками

## Как запустить проект локально

1. Клонируйте репозиторий:
   - git clone git@github.com:Kirillz8/tandem-app.git
   - cd tandem-app
   
3. Установите зависимости:
   - yarn install

4. Запустите приложение:
    - yarn dev

#### Автор: Кирилл Аканин
