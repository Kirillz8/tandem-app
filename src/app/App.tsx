import { useState } from "react";
import {
    useGetTasksQuery,
    useCreateTaskMutation,
    useUpdateTaskMutation,
    useDeleteTaskMutation,
} from "../api/tasksApi.ts";

import styles from "./App.module.css";
import {Loader} from '../components/Loader/Loader.tsx';
import {TaskForm} from '../components/TaskForm/TaskForm.tsx';
import {TaskList} from '../components/TaskList/TaskList.tsx';

type Filter = "all" | "active" | "completed";

function isFetchBaseQueryError(
    error: unknown
): error is { status: number; data?: string } {
    return (
        typeof error === "object" &&
        error !== null &&
        "status" in error
    );
}

export default function App() {
    const [filter, setFilter] = useState<Filter>("all");
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const { data: tasks = [], isLoading, error } = useGetTasksQuery();
    const [createTask, { isLoading: creating }] = useCreateTaskMutation();
    const [updateTask] = useUpdateTaskMutation();
    const [deleteTask] = useDeleteTaskMutation();

    if (isLoading) return <Loader />;

    if (error) {
        if (isFetchBaseQueryError(error)) {
            return (
                <div style={{ color: "red" }}>
                    {typeof error.data === "string"
                        ? error.data
                        : JSON.stringify(error.data) || "Ошибка запроса"}
                </div>
            );
        }
        return <div style={{ color: "red" }}>{String(error)}</div>;
    }

    return (
        <div className={styles.centered}>
            <div className={styles.todoContainer}>
                <h2>Список задач</h2>
                <TaskForm onAdd={text => createTask(text)} loading={creating} />
                <div style={{ marginBottom: 16 }}>
                    <button onClick={() => setFilter("all")} disabled={filter === "all"}>Все</button>
                    <button onClick={() => setFilter("active")} disabled={filter === "active"} style={{ marginLeft: 8 }}>Активные</button>
                    <button onClick={() => setFilter("completed")} disabled={filter === "completed"} style={{ marginLeft: 8 }}>Выполненные</button>
                </div>
                <TaskList
                    tasks={tasks}
                    filter={filter}
                    onToggle={id => {
                        setLoadingId(id);
                        const t = tasks.find(task => task.id === id)!;
                        updateTask({ id, updates: { completed: !t.completed } }).finally(() => setLoadingId(null));
                    }}
                    onDelete={id => {
                        setLoadingId(id);
                        deleteTask(id).finally(() => setLoadingId(null));
                    }}
                    onEdit={(id, text) => {
                        setLoadingId(id);
                        updateTask({ id, updates: { text } }).finally(() => setLoadingId(null));
                    }}
                    loadingId={loadingId}
                />
            </div>
        </div>
    );
}
