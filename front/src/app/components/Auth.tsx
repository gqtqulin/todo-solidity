import React from "react";
import { useState } from "react"

type AuthProps = {
    connect: React.MouseEventHandler<HTMLButtonElement>;
    dismiss: React.MouseEventHandler<HTMLButtonElement>;
}
const Auth: React.FunctionComponent<
    AuthProps
> = ({
    connect,
    dismiss,
}) => {
    const [showMsg, setShowMsg] = useState<boolean>(true);
    const [msg, setMsg] = useState<string>("connect to metamask!")

    const _switchShowingMsg = () => {
        setShowMsg(() => {
            return !showMsg;
        })
    }

    const _connectToMetamask = () => {

    }

    return (<>
        (showMsg && <p>{msg}</p>)
        {/* <span onClick={_switchShowingMsg}>✖️</span> */}
        <button onClick={_connectToMetamask}>connect</button>
    </>)
}

export default Auth;