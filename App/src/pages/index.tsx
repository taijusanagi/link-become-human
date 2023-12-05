import { useEffect, useState } from "react";

import { VT323 } from "next/font/google";
const vt323 = VT323({ weight: "400", subsets: ["latin"] });

import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

import { useIsConnected } from "@/hooks/useIsConnected";
import { useContract } from "@/hooks/useContract";
import { address as contractAddress } from "@/lib/contracts";
import { ethers } from "ethers";

export default function Home() {
  const [isMinted, setIsMinted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("Modal Title");
  const [modalText, setModalText] = useState("Modal Text");
  const [tokenId, setTokenId] = useState("");

  const { openConnectModal } = useConnectModal();
  const { isConnected } = useIsConnected();
  const { address: userAddress } = useAccount();
  const { contract } = useContract();

  useEffect(() => {
    if (!userAddress || !contract) {
      return;
    }
    contract.getTokenIdByAddress(userAddress).then((tokenId: ethers.BigNumber) => {
      setTokenId(tokenId.toString());
    });
  }, [userAddress, contract]);

  return (
    <div className={`flex flex-col min-h-screen bg-gradient-to-r from-black to-gray-800 text-white ${vt323.className}`}>
      <main className="flex-grow">
        <header className="flex justify-between items-center p-4">
          <h1 className="text-2xl">Link:BecomeHuman</h1>
          <ConnectButton showBalance={false} />
        </header>
        {!isConnected && (
          <div className="flex justify-center">
            <div className="my-52 text-center">
              <img className="h-12 mx-auto" src="assets/icon.png" />
              <h1 className="text-4xl md:text-7xl mb-4">Link:BecomeHuman</h1>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={openConnectModal}
              >
                Connect Wallet
              </button>
            </div>
          </div>
        )}
        {isConnected && (
          <div>
            <div className="flex justify-center my-8">
              <div>
                <div className="flex justify-end mb-2 space-x-4">
                  <p>
                    <a href="https://passport.gitcoin.co/" target="_blank" className="text-blue-500 hover:underline">
                      Gitcoin Passport
                    </a>
                  </p>
                  {isMinted && (
                    <>
                      <p>|</p>
                      <p>
                        <a
                          href={`https://testnets.opensea.io/assets/goerli/${contractAddress}/${tokenId}`}
                          target="_blank"
                          className="text-blue-500 hover:underline"
                        >
                          OpenSea
                        </a>
                      </p>
                    </>
                  )}
                </div>
                <iframe width="500" height="500" src={`/game/index.html?tokenId=${tokenId}`}></iframe>
              </div>
            </div>

            {!isMinted && (
              <div className="flex justify-center">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => {
                    setIsMinted(true);
                  }}
                >
                  Claim Your Humanity NFT
                </button>
              </div>
            )}

            {isMinted && (
              <div className="flex justify-center space-x-2">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => {
                    setIsModalOpen(true);
                  }}
                >
                  Update Your Humanity NFT
                </button>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Automate Update by Chainlink Automation
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 text-gray-800">
          <div className="absolute inset-0 bg-black opacity-50" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative z-10 bg-white py-4 px-6 rounded-xl shadow-lg max-w-xl w-full mx-4">
            <header className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold">{modalTitle}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-xl text-gray-400 hover:text-gray-500">
                &times;
              </button>
            </header>
            <p>{modalText}</p>
          </div>
        </div>
      )}
    </div>
  );
}
