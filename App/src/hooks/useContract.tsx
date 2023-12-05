import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useEthersSigner, useEthersProvider } from "@/hooks/useEthers";
import { abi, address } from "@/lib/contracts";

export const useContract = () => {
  const signer = useEthersSigner();
  const provider = useEthersProvider();
  const [contract, setContract] = useState<ethers.Contract>();
  useEffect(() => {
    if (!signer && !provider) {
      return;
    }
    const contract = new ethers.Contract(address, abi, signer || provider);
    setContract(contract);
  }, [signer, provider]);
  return { contract };
};
