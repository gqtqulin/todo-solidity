import React, { ChangeEvent, FormEvent, useState } from "react";
import { EngineProps, TaskProps } from "../types/types";

const Engine: React.FunctionComponent<
    EngineProps
> = ({
    tasks,
    connection
})=> {
    const [txSent, setTxSent] = useState<boolean>(false);

    const _changeTitle = () => {

    }

    const _changeStatus = async (e: ChangeEvent<HTMLInputElement>, i: number) => {
        e.preventDefault();
        setTxSent(true);

        if (!connection.todo) {
            return false;
        }

        try {
            const tx = await connection.todo.changeTaskStatus(i);
            await tx.wait();

            console.log(`транзакция ${tx.hash}`);
        } catch (e) {
            console.log(e);
            // err msg alert?
        } finally {
            setTxSent(false);
        }
    }

    const _addTask = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setTxSent(true);

        if (!connection.todo) {
            return false;
        }

        try {

            const formData = new FormData(e.currentTarget);

            const title = formData.get("title");
            const desc = formData.get("desc");
            const dl = formData.get("dl");

            if (title && desc && dl) {
                // const tx = await connection.todo.addTask(title, desc, BigInt(dl));
                // tx.wait();
    
                // console.log(`транзакция ${tx.hash}`);
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
                        <p>{`#${i} ${task.title}`}</p>
                        <p>{task.description}</p>

                        <label>
                            Готово:
                            <input type="checkbox" disabled={txSent} checked={task.completed}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => _changeStatus(e, i)} />
                        </label>

                        <p>{task.deadline.toLocaleString()}</p>
                    </>
                </li>
            )
        })
    }

    return (<div>

        {tasks.length > 0 && <ul>_generateTodos(tasks)</ul>}

        <form onSubmit={_addTask}>
            <label>
                Title:
                <input type="text" name="title" />
            </label>

            <label>
                Description:
                <input type="text" name="desc" />
            </label>

            <label>
                Deadline:
                <input type="text" name="dl" />
            </label>

            <input type="submit" disabled={txSent} value="Add task" />
        </form>

    </div>)
}

export default Engine;
