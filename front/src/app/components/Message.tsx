import React from "react";

import { MessageProps } from "../types/types";


const Message: React.FC<MessageProps> = ({ message }) => {

    const switchShowMessage = () => {

    }

    return (<>
        {message}
        <button type="button" onClick={switchShowMessage}>
            <span aria-hidden="true">&times;</span>
        </button>
    </>)
}



export default Message;