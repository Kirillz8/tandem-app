import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Task } from '../types/task';

const LS_KEY = 'todo-tasks';

let tasks: Task[] = JSON.parse(localStorage.getItem(LS_KEY) || 'null') || [
    { id: '1', text: 'Сделать тестовое задание', completed: false },
    { id: '2', text: 'Позвонить бабушке', completed: true },
];

function saveTasks() {
    localStorage.setItem(LS_KEY, JSON.stringify(tasks));
}
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const tasksApi = createApi({
    reducerPath: 'tasksApi',
    baseQuery: fakeBaseQuery(),
    tagTypes: ['Tasks'],
    endpoints: builder => ({
        getTasks: builder.query<Task[], void>({
            async queryFn() {
                await delay(600);
                return { data: [...tasks] };
            },
            providesTags: ['Tasks'],
        }),
        createTask: builder.mutation<Task, string>({
            async queryFn(text) {
                await delay(600);
                if (!text.trim())
                    return { error: { status: 400, data: 'Текст не может быть пустым' } };
                const newTask: Task = {
                    id: Date.now().toString(),
                    text,
                    completed: false,
                };
                tasks = [newTask, ...tasks];
                saveTasks();
                return { data: newTask };
            },
            invalidatesTags: ['Tasks'],
            async onQueryStarted(text, { dispatch, queryFulfilled }) {
                const tempId = 'tmp-' + Date.now() + Math.random();
                const optimisticTask: Task = {
                    id: tempId,
                    text,
                    completed: false,
                };

                const patchResult = dispatch(
                    tasksApi.util.updateQueryData('getTasks', undefined, draft => {
                        draft.unshift(optimisticTask);
                    })
                );

                try {
                    const { data: realTask } = await queryFulfilled;
                    dispatch(
                        tasksApi.util.updateQueryData('getTasks', undefined, draft => {
                            const idx = draft.findIndex(t => t.id === tempId);
                            if (idx !== -1 && realTask) draft[idx] = realTask;
                        })
                    );
                } catch {
                    patchResult.undo();
                }
            },
        }),

        updateTask: builder.mutation<Task, { id: string; updates: Partial<Omit<Task, 'id'>> }>({
            async queryFn({ id, updates }) {
                await delay(600);
                const idx = tasks.findIndex(t => t.id === id);
                if (idx === -1) return { error: { status: 404, data: 'Задача не найдена' } };
                tasks[idx] = { ...tasks[idx], ...updates };
                saveTasks();
                return { data: tasks[idx] };
            },
            invalidatesTags: ['Tasks'],
            async onQueryStarted({ id, updates }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    tasksApi.util.updateQueryData('getTasks', undefined, draft => {
                        const task = draft.find(t => t.id === id);
                        if (task) Object.assign(task, updates);
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
        }),
        deleteTask: builder.mutation<null, string>({
            async queryFn(id) {
                await delay(600);
                tasks = tasks.filter(t => t.id !== id);
                saveTasks();
                return { data: null };
            },
            invalidatesTags: ['Tasks'],
            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    tasksApi.util.updateQueryData('getTasks', undefined, draft => {
                        const idx = draft.findIndex(t => t.id === id);
                        if (idx !== -1) draft.splice(idx, 1);
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
        }),
    }),
});

export const {
    useGetTasksQuery,
    useCreateTaskMutation,
    useUpdateTaskMutation,
    useDeleteTaskMutation,
} = tasksApi;
