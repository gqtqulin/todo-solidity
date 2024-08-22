import React from "react";



import { MessageProps } from "../types/types";



const Message: React.FC<MessageProps> = (
    { message, showMessage, setShowMessage }
) => {

    const switchShowMessage = () => {
        setShowMessage(() => !showMessage)
    }

    return (showMessage && <div>
        {message}
        <button type="button" onClick={switchShowMessage}>
            <span aria-hidden="true">&times;</span>
        </button>
    </div>)
}



export default Message;