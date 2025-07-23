import React, { useState } from "react";
import type {Task} from '../../types/task.ts';
import styles from "./TaskItem.module.css";

interface Props {
    task: Task;
    onToggle: () => void;
    onDelete: () => void;
    onEdit: (text: string) => void;
    loading?: boolean;
}

export const TaskItem: React.FC<Props> = ({
                                              task,
                                              onToggle,
                                              onDelete,
                                              onEdit,
                                              loading,
                                          }) => {
    const [editMode, setEditMode] = useState(false);
    const [value, setValue] = useState(task.text);

    const handleSave = () => {
        if (value.trim() && value !== task.text) onEdit(value);
        setEditMode(false);
    };

    return (
        <li
            className={[
                styles.taskItem,
                loading ? styles.taskItemLoading : "",
            ].join(" ")}
            data-testid="task-item"
        >
            <input
                type="checkbox"
                checked={task.completed}
                onChange={onToggle}
                disabled={loading}
            />
            {editMode ? (
                <div className={styles.editContainer}>
                    <input
                        className={styles.editInput}
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        disabled={loading}
                        autoFocus
                        onKeyDown={e => {
                            if (e.key === "Enter") handleSave();
                            if (e.key === "Escape") setEditMode(false);
                        }}
                    />
                    <button onClick={handleSave} disabled={loading}>
                        Сохранить
                    </button>
                    <button onClick={() => setEditMode(false)} disabled={loading}>
                        Отмена
                    </button>
                </div>
            ) : (
                <>
          <span
              className={[
                  styles.taskText,
                  task.completed ? styles.taskTextCompleted : "",
              ].join(" ")}
          >
            {task.text}
          </span>
                    <button onClick={() => setEditMode(true)} disabled={loading}>
                        Редактировать
                    </button>
                    <button
                        onClick={onDelete}
                        disabled={loading}
                        style={{ marginLeft: 8 }}
                    >
                        Удалить
                    </button>
                </>
            )}
        </li>
    );
};
