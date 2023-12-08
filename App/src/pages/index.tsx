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
  const [modalTitle, setModalTitle] = useState("");
  const [modalText, setModalText] = useState("");
  const [modalFallback, setModalFallback] = useState<{ func?: Function }>({});
  const [modalConfirmedTx, setModalConfirmedTx] = useState("");
  const [modalConfirmedChainlink, setModalConfirmedChainlink] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [isUpkeepNeeded, setIsUpkeepNeeded] = useState(false);

  const { openConnectModal } = useConnectModal();
  const { isConnected } = useIsConnected();
  const { address: userAddress } = useAccount();
  const { contract } = useContract();

  const clearModal = () => {
    setIsModalOpen(false);
    setModalTitle("");
    setModalText("");
    setModalFallback({});
    setModalConfirmedTx("");
    setModalConfirmedChainlink("");
  };

  useEffect(() => {
    if (!userAddress || !contract) {
      return;
    }
    contract.getTokenIdByAddress(userAddress).then((tokenId: ethers.BigNumber) => {
      const _tokenId = tokenId.toString();
      setTokenId(_tokenId);
      console.log("tokenId", _tokenId);
    });
  }, [userAddress, contract]);

  useEffect(() => {
    if (!contract || !tokenId) {
      return;
    }
    const intervalFunction = () => {
      console.log("interval check");
      contract
        .ownerOf(tokenId)
        .then(() => {
          console.log("token minted");
          setIsMinted(true);
        })
        .catch(() => {
          console.log("token not yet minted");
        });
      contract.isUpkeepNeeded(tokenId).then((isUpkeepNeeded: boolean) => {
        console.log("isUpkeepNeeded", isUpkeepNeeded);
        setIsUpkeepNeeded(isUpkeepNeeded);
      });
    };
    intervalFunction();
    const intervalId = setInterval(intervalFunction, 5000);
    return () => {
      setIsMinted(false);
      setIsUpkeepNeeded(false);
      clearInterval(intervalId);
    };
  }, [contract, tokenId]);

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
              <img className="h-12 mx-auto animate-[up-and-down_1s_ease-in-out_infinite]" src="assets/icon.png" />
              <h1 className="text-4xl md:text-7xl mb-4 flashing-text">Link:BecomeHuman</h1>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={openConnectModal}
              >
                Connect Wallet
              </button>
            </div>
          </div>
        )}
        {isConnected && tokenId && (
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
                          href={`https://testnets.opensea.io/assets/avalanche-fuji/${contractAddress}/${tokenId}`}
                          target="_blank"
                          className="text-blue-500 hover:underline"
                        >
                          OpenSea
                        </a>
                      </p>
                    </>
                  )}
                </div>
                <iframe width="504" height="504" src={`/game/index.html?id=${tokenId}`}></iframe>
              </div>
            </div>

            {!isMinted && (
              <div className="flex justify-center">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={async () => {
                    const fallback = async () => {
                      if (!contract) {
                        return;
                      }
                      return await contract.mint();
                    };
                    setModalTitle("Claim Your Humanity NFT");
                    setModalText(`
                      Are you certain you wish to claim your Humanity NFT? 
                      The Humanity NFT is a non-transferable, dynamic NFT that utilizes the Gitcoin Passport humanity score, powered by Chainlink. 
                      This action will prompt you to confirm a transaction using AVAX.
                    `);
                    setModalFallback({ func: fallback });
                    setIsModalOpen(true);
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
                  onClick={async () => {
                    if (!contract) {
                      return;
                    }
                    await contract.sendRequest(tokenId);
                  }}
                >
                  Update Humanity
                </button>
                {!isUpkeepNeeded && (
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={async () => {
                      if (!contract) {
                        return;
                      }
                      await contract.setUpkeep(tokenId, true);
                    }}
                  >
                    Start Automate
                  </button>
                )}
                {isUpkeepNeeded && (
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={async () => {
                      if (!contract) {
                        return;
                      }
                      await contract.setUpkeep(tokenId, false);
                    }}
                  >
                    Stop Automate
                  </button>
                )}
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={async () => {
                    if (!contract) {
                      return;
                    }
                    return await contract.requestRandomness(tokenId);
                  }}
                >
                  Randomize Seed
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 text-gray-800">
          <div className="absolute inset-0 bg-black opacity-50" onClick={clearModal}></div>
          <div className="relative z-10 bg-white py-4 px-6 rounded-xl shadow-lg max-w-xl w-full mx-4">
            <header className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{modalTitle}</h2>
              <button onClick={clearModal} className="text-xl text-gray-400 hover:text-gray-500">
                &times;
              </button>
            </header>
            <div className="mb-8">
              <p className="mb-4">{modalText}</p>
              {modalConfirmedTx && (
                <p>
                  Avalanche Exproler:{" "}
                  <a
                    href={`https://testnet.snowtrace.io/tx/${modalConfirmedTx}`}
                    target="_blank"
                    className="text-blue-500 hover:underline"
                  >
                    {modalConfirmedTx}
                  </a>
                </p>
              )}
              {modalConfirmedChainlink && (
                <p>
                  <a
                    href={`https://testnets.opensea.io/assets/avalanche-fuji/${contractAddress}/${tokenId}`}
                    target="_blank"
                    className="text-blue-500 hover:underline"
                  >
                    Chainlink Exproler: {modalConfirmedTx}
                  </a>
                </p>
              )}
            </div>
            <div className="text-right">
              {!modalConfirmedTx && (
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={async () => {
                    if (!modalFallback.func) {
                      return;
                    }
                    const { hash } = await modalFallback.func();
                    setModalConfirmedTx(hash);
                  }}
                >
                  Confirm
                </button>
              )}
              {modalConfirmedTx && (
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={clearModal}
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
