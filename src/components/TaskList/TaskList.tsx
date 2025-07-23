import React from "react";

import styles from './TaskList.module.css';
import type {Task} from '../../types/task.ts';
import {TaskItem} from '../TaskItem/TaskItem.tsx';

type Filter = "all" | "active" | "completed";

interface Props {
    tasks: Task[];
    filter: Filter;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit: (id: string, text: string) => void;
    loadingId?: string | null;
}

export const TaskList: React.FC<Props> = ({
                                              tasks,
                                              filter,
                                              onToggle,
                                              onDelete,
                                              onEdit,
                                              loadingId,
                                          }) => {
    const filtered = tasks.filter(task =>
        filter === "all" ? true : filter === "active" ? !task.completed : task.completed
    );

    if (filtered.length === 0) {
        return <div className="task-list__empty">Нет задач</div>;
    }

    return (
        <ul className={styles.taskList}>
            {filtered.map(task => (
                <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={() => onToggle(task.id)}
                    onDelete={() => onDelete(task.id)}
                    onEdit={text => onEdit(task.id, text)}
                    loading={loadingId === task.id}
                />
            ))}
        </ul>
    );
};
