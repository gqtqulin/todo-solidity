// import Image from "next/image";
import React from "react";
import { useState, useEffect } from "react";
import ethers from "ethers";

import Auth from "./components/Auth";
import Engine from "./components/Engine";
import Message from "./components/Message";

import type { ConnectionProps, TaskProps } from "./types/types";

export default function Home() {
  const [connection, setConnection] = useState<ConnectionProps>();
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [tasks, setTasks] = useState<Array<TaskProps>>();

  useEffect(() => {

  }, [])

  return (
    <main>
      <Auth connection={connection} setConnection={setConnection} />
      (showMessage && <Message message={message} />)
      (connection.todo && <Engine />)
    </main>
  );
}
