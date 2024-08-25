"use client"

import React from "react";
import { useState, useEffect } from "react";
import { ethers } from "ethers";

import Auth from "./components/Auth";
import Engine from "./components/Engine";
import Message from "./components/Message";

import type { ConnectionProps, TaskProps } from "./types/types";

export default function Home() {
  const [connection, setConnection] = useState<ConnectionProps>();
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [tasks, setTasks] = useState<TaskProps[]>([]);

  const _resetStates = () => {
    // setConnection(undefined);
    setShowMessage(false);
    setIsOwner(false);
    setMessage("");
    setTasks([]);
  }

  useEffect(() => {
    (async() => {
      if (connection?.signer && connection?.todo) {
        const newTasks = (await connection.todo.getAllTasks()).
          map((task) => {
            return {
              title: task.title,
              description: task.description,
              completed: task.completed,
              deadline: task.deadline,
            }
          });
        
        setTasks(() => [...tasks, ...newTasks]);

        setIsOwner(
          ethers.getAddress(await connection.todo.owner()) ===
            (await connection.signer.getAddress())
        )
      }
    })();
  }, [connection])

  return (
    <main>
      {!connection?.todo && <Auth connection={connection} setConnection={setConnection} />}
      {showMessage && 
      <Message
        message={message} showMessage={showMessage} setShowMessage={setShowMessage}
      />}
      {connection?.todo && isOwner &&
        <Engine connection={connection} tasks={tasks} setTasks={setTasks} />
      }
    </main>
  );
}
