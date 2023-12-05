import { useState } from "react";

import { VT323 } from "next/font/google";
const vt323 = VT323({ weight: "400", subsets: ["latin"] });

export default function Home() {
  const [isMinted, setIsMinted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className={`flex flex-col min-h-screen bg-gradient-to-r from-black to-gray-800 text-white ${vt323.className}`}>
      <main className="flex-grow">
        <header className="flex justify-between items-center p-4">
          <h1 className="text-xl">Link:BecomeHuman</h1>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Connect Wallet
          </button>
        </header>

        <div className="flex justify-center">
          <iframe className="my-8" width="500" height="500" src="/game/index.html"></iframe>
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
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 text-gray-800">
          <div className="absolute inset-0 bg-black opacity-50" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative z-10 bg-white py-4 px-6 rounded-xl shadow-lg max-w-xl w-full mx-4">
            <header className="flex justify-between items-center mb-2">
              <h2 className="text-sm font-bold text-gray-700"></h2>
              <button onClick={() => setIsModalOpen(false)} className="text-2xl text-gray-400 hover:text-gray-500">
                &times;
              </button>
            </header>
            <p>Modal text goes here...</p>
          </div>
        </div>
      )}
      <footer className="fixed bottom-0 w-full flex items-center justify-center p-4">
        <a href="https://passport.gitcoin.co/" target="_blank" className="text-blue-500 hover:underline">
          Go to Gitcoin Passport
        </a>
      </footer>
    </div>
  );
}
