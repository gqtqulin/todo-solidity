import React, { ChangeEvent, FormEvent, useState } from "react";
import { EngineProps, TaskProps, ChangeMode } from "../types/types";

const Engine: React.FunctionComponent<
    EngineProps
> = ({
    tasks,
    setTasks,
    connection
})=> {
    const [txSent, setTxSent] = useState<boolean>(false);
    const [changeMode, setChangeMode] = useState<ChangeMode>({});

    const _handleChangeMode = (i: number) => {
        setChangeMode(() => {

            let v: boolean | undefined = changeMode[i];
            console.log(`_handleChangeMode() - v 1: ${v}`)

            if (v === undefined) {
                v = false;
            }

            v = !v;
            console.log(`_handleChangeMode() - v 2: ${v}`)

            return {
                ...changeMode,
                i: v,
            }
        })
    }

    const _handleTitleChange = () => {

    }

    const _changeTitle = () => {
        
    }

    const _changeStatus = async (e: ChangeEvent<HTMLInputElement>, i: number) => {
        e.preventDefault();

        if (!connection.todo) {
            return false;
        }

        setTxSent(true);

        try {
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
                            <input type="text" value={task.title}
                                onChange={_handleTitleChange} disabled={txSent || changeMode[i]} />
                        </label>

                        <label className="pr-2">
                            Описание:
                            <input type="text" value={task.description} disabled={true} />
                        </label>

                        <label className="pr-2">
                            Статус:
                            <input type="checkbox" disabled={txSent || changeMode[i]} checked={task.completed}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => _changeStatus(e, i)} />
                        </label>

                        <label className="pr-4">
                            Срок:
                            <input type="text" value={task.deadline.toLocaleString()} disabled={true}  />
                        </label>

                        <button disabled={txSent} onClick={() => _handleChangeMode(i)}>
                            Изменить
                        </button>
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
