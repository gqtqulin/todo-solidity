import ethers from "ethers";

import type { BrowserProvider } from "ethers";
import type { TodoEngine } from "../../../../typechain-types/contracts/TodoEngine";

export type ConnectionProps = {
    provider: BrowserProvider | undefined;
    signer: ethers.JsonRpcSigner | undefined;
    todo: TodoEngine | undefined;
}

export type TaskProps = {
    
}