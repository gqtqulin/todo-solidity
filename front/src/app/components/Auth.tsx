import React from "react";
import { useState } from "react";
import { ethers } from "ethers";
import { TodoEngine__factory } from "../../../../typechain-types/factories/contracts/TodoEngine__factory";
import { HARDHAT_NETWORK_ID, TODO_ADDRESS } from "../constant/constant";

import type { ConnectionProps } from "../types/types";

type AuthProps = {
    connect: React.MouseEventHandler<HTMLButtonElement>;
    dismiss: React.MouseEventHandler<HTMLButtonElement>;
    connection: ConnectionProps;
    setConnection: React.Dispatch<React.SetStateAction<ConnectionProps>>;
}

declare let window: any;

const Auth: React.FunctionComponent<
    AuthProps
> = ({
    connect,
    dismiss,
    connection,
    setConnection,
}) => {
    const [showMsg, setShowMsg] = useState<boolean>(true);
    const [msg, setMsg] = useState<string>("Подключите Metamask!")

    const _switchShowingMsg = () => {
        setShowMsg(() => {
            return !showMsg;
        })
    }

    const _init = async (address: string) => {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner(address);

        setConnection({
            ...connection,
            provider: provider,
            signer: signer,
            todo: TodoEngine__factory.connect(TODO_ADDRESS, signer),
        })
    }

    const _checkNetwork = async (): Promise<boolean> => {
        const chainId = await window.ethereum.request({
            method: "eth_chainId",
        });

        console.log(`connecting user with chain id: ${chainId}`);

        const r = chainId == HARDHAT_NETWORK_ID;

        if (!r) {
            setMsg("Выбранная сеть не соответствует тестовой Hardhat сети!");
        }

        return r;
    }

    const _resetState = () => {
        setConnection({
            provider: undefined,
            signer: undefined,
            todo: undefined,
        })
    }

    const _connectToMetamask = async () => {
        if (window.ethereum == undefined) {
            setMsg("Metamask не найден, может его забыли установить? :(");
            return;
        }

        if (!(await _checkNetwork())) {
            return;
        }

        const [address] = await window.ethereum.request({
            method: "eth_requestAccounts",
        });

        await _init(address);

        window.ethereum.on(
            "accountsChanged",
            async ([newAccount]: [newAccount: string]) => {
                console.log(`user swithed account: ${newAccount}`);
                // if (newAccount !== undefined) {
                //     return _resetState();
                // }

                if (newAccount == undefined) {
                    return;
                }

                _resetState();

                await _init(newAccount);
            },
        );

        window.ethereum.on(
            "chainChanged",
            ([_networkId]: any) => {
                _resetState();
            }
        );
    }

    return (<>
        (showMsg && <p>{msg}</p>)
        {/* <span onClick={_switchShowingMsg}>✖️</span> */}
        <button onClick={_connectToMetamask}>connect</button>
    </>)
}

export default Auth;