import React, { useState } from "react";
import styles from "./TaskForm.module.css";

interface Props {
    onAdd: (text: string) => void;
    loading?: boolean;
}

export const TaskForm: React.FC<Props> = ({ onAdd, loading }) => {
    const [value, setValue] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (value.trim()) {
            onAdd(value);
            setValue("");
        }
    };

    return (
        <form className={styles.taskForm} onSubmit={handleSubmit}>
            <input
                className={styles.taskFormInput}
                value={value}
                disabled={loading}
                onChange={e => setValue(e.target.value)}
                placeholder="Новая задача"
            />
            <button type="submit" disabled={loading || !value.trim()}>
                Добавить
            </button>
        </form>
    );
};
