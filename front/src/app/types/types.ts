import ethers from "ethers";

import type { BrowserProvider } from "ethers";
import type { TodoEngine } from "../../../../typechain-types/contracts/TodoEngine";



export type ConnectionProps = {
    provider: BrowserProvider | undefined;
    signer: ethers.JsonRpcSigner | undefined;
    todo: TodoEngine | undefined;
}

export type AuthProps = {
    connection: ConnectionProps | undefined;
    setConnection: React.Dispatch<React.SetStateAction<ConnectionProps | undefined>>;
}

export type EngineProps = {

}

export type MessageProps = {
    message: string;
}



export type TaskProps = {
    title: string;
    description: string;
    completed: boolean;
    deadline: BigInt;
}



