import React, { ChangeEvent, FormEvent, useState } from "react";
import { EngineProps, TaskProps, ChangeMode } from "../types/types";

const BACKUP_TASK = "backupTask";

const Engine: React.FunctionComponent<
    EngineProps
> = ({
    tasks,
    setTasks,
    connection
})=> {
    const [txSent, setTxSent] = useState<boolean>(false);
    const [changeMode, setChangeMode] = useState<number>(-1);


    const _saveStorage = (obj: any) => {
        localStorage.setItem(BACKUP_TASK, JSON.stringify(obj, (_, v) => {
            return typeof(v) === "bigint" ? v.toString() : v;
        }));
    }

    const _loadStorage = () => {
        let r = null;
        const backupTask = localStorage.getItem(BACKUP_TASK)
        if (backupTask) {
            r = JSON.parse(backupTask, (k, v) => {
                return k === "deadline" ? BigInt(v) : v;
            });
        }
        return r;
    }

    const _handleChangeStatus = (e: ChangeEvent<HTMLInputElement>, i: number) => {
        //console.log(`_handleChangeStatus() - e.target.checked: ${e.target.checked}`)

        const newStatus: boolean = e.target.checked;
        
        const newTasks: TaskProps[] = tasks;
        newTasks[i].completed = newStatus;

        setTasks([
            ...newTasks,
        ])
    }

    const _handleChangeTitle = (e: ChangeEvent<HTMLInputElement>, i: number) => {
        // console.log(e.target.value);

        const newTitle: string = e.target.value;

        const newTasks: TaskProps[] = tasks;
        newTasks[i].title = newTitle;

        setTasks([
            ...newTasks,
        ])
    }

    const _handleChangeMode = (i: number) => {
        setChangeMode(i);
        _saveStorage({
            i: i,
            data: tasks[i],
        });
    }

    const _handleCancelChangeMode = (i: number) => {
        const backupTask = _loadStorage();
        if (backupTask) {
            const backupTasks: TaskProps[] = tasks;
            backupTasks[i] = backupTask.data;
    
            setTasks([
                ...backupTasks
            ]);
        }

        localStorage.removeItem(BACKUP_TASK);
        setChangeMode(-1);
    }

    const _handleSaveChanges = (i: number) => {
        const backupTask = _loadStorage();

        if (backupTask) {
            try {
                const keys = Object.keys(backupTask);
                keys.forEach((k) => {
                    // if (tasks[i][k] !== backupTask[k]) {

                    // }
                });
            } catch (e) {

            } finally {

            }
        }

        localStorage.removeItem(BACKUP_TASK);
    }

    const _changeStatus = async (e: ChangeEvent<HTMLInputElement>, i: number) => {
        e.preventDefault();

        if (!connection.todo) {
            return false;
        }

        try {
            setTxSent(true);

            const tx = await connection.todo.changeTaskStatus(i);
            await tx.wait();

            const updTask = tasks[i];
            updTask.completed = !updTask.completed;

            const newTasks = tasks;
            newTasks[i] = updTask;

            setTasks([
                ...newTasks,
            ]);

            console.log(`изменение статуса задачи, хэш транзакци: ${tx.hash}`);
        } catch (e) {
            console.log(e);
            // err msg alert?
        } finally {
            setTxSent(false);
        }
    }

    const _changeTitle = async (e: ChangeEvent<HTMLInputElement>, i: number) => {
        e.preventDefault();

        if (!connection.todo) {
            return false;
        }

        try {
            setTxSent(true);

            const tx = await connection.todo.changeTaskTitle("", i);
            tx.wait();

            console.log(`изменение названия задачи, хэш транзакци: ${tx.hash}`);
        } catch (e) {
            console.log(e);
        } finally {
            setTxSent(false);
        }
    }

    const _addTask = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!connection.todo) {
            return false;
        }

        try {
            const formData = new FormData(e.currentTarget);

            const title = formData.get("title")?.toString();
            const desc = formData.get("desc")?.toString();
            const dl = formData.get("dl")?.toString();

            setTxSent(true);

            if (
                title && title !== "" &&
                desc && desc !== "" &&
                dl && dl !== ""
            ) {
                const deadline = BigInt(dl)

                const tx = await connection.todo.addTask(
                    title, desc, deadline
                );
                tx.wait();

                setTasks([
                    ...tasks,
                    {
                        title: title,
                        description: desc,
                        deadline: deadline,
                        completed: false,
                    }
                ]);
    
                console.log(`добавление задачи, хэш транзакции: ${tx.hash}`);

                formData.set("title", "");
                formData.set("desc", "");
                formData.set("dl", "");
            }
        } catch (e) {
            console.log(e);
        } finally {
            setTxSent(false);
        }
    }

    const _generateTodos = (tasks: TaskProps[]): JSX.Element[] => {
        return tasks.map((task, i) => {
            return (
                <li key={i}>
                    <>
                        <p>{`#${i + 1}`}</p>

                        <label className="pr-2">
                            Имя:
                            <input type="text" value={task.title} disabled={txSent || !(changeMode === i)} 
                                onChange={(e) => {
                                    _handleChangeTitle(e, i)
                                }} />
                        </label>

                        <label className="pr-2">
                            Описание:
                            <input type="text" value={task.description} disabled={true} />
                        </label>

                        <label className="pr-2">
                            Статус:
                            <input type="checkbox" disabled={txSent || !(changeMode === i)} checked={task.completed}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                    _handleChangeStatus(e, i);
                                }} />
                        </label>

                        <label className="pr-4">
                            Срок:
                            <input type="text" value={task.deadline.toLocaleString()} disabled={true}  />
                        </label>

                        <div className="flex flex-row ">
                            <button 
                                disabled={txSent || (changeMode === i)}
                                className="flex-1"
                                onClick={() => _handleChangeMode(i)}>
                                    Редактировать
                            </button>
                            <button
                                className="flex-1"
                                disabled={txSent || !(changeMode === i)}
                                onClick={() => _handleSaveChanges(i)}>
                                    Сохранить
                            </button>
                            <button
                                className="flex-1"
                                disabled={txSent || !(changeMode === i)}
                                onClick={() => _handleCancelChangeMode(i)}>
                                    Отмена
                            </button>
                        </div>
                    </>
                </li>
            )
        })
    }

    return (<div>

        <form className="pt-16" onSubmit={_addTask}>
            <label>
                Имя:
                <input type="text" name="title" />
            </label>

            <label>
                Описание:
                <input type="text" name="desc" />
            </label>

            <label>
                Срок:
                <input type="text" name="dl" />
            </label>

            <input type="submit" disabled={txSent} value="Add task" />
        </form>

        {tasks.length > 0 && <ul className="pt-8">{_generateTodos(tasks)}</ul>}

    </div>)
}

export default Engine;
