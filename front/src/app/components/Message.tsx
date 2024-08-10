import React from "react";

type MessageProps = {
    message: string;
    dismiss: React.MouseEventHandler<HTMLButtonElement>;
}

const Message: React.FunctionComponent<MessageProps> 
    = ({message, dismiss}) => {
    return (<>
        {message}
        <button type="button" onClick={dismiss}>
            <span aria-hidden="true">&times;</span>
        </button>
    </>)
}

export default Message;