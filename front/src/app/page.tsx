// import Image from "next/image";
import React from "react";
import { useState, useEffect } from "react";
import ethers from "ethers";

import type { BrowserProvider } from "ethers";

type ConnectionProps = {
  provider: BrowserProvider | undefined;
  signer: ethers.JsonRpcSigner | undefined;
}


export default function Home() {
  const [connection, setConnection] = useState<ConnectionProps>();

  return (
    <>
      
    </>
  );
}
