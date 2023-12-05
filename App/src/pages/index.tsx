import { VT323 } from "next/font/google";
import { useState } from "react";

const vt323 = VT323({ weight: "400", subsets: ["latin"] });

export default function Home() {
  const [isMinted, setIsMinted] = useState(false);

  return (
    <main className={`${vt323.className}`}>
      <div>Link:BecomeHuman</div>
      <div>Connect Wallet</div>
      <iframe width="500" height="500" src="/game/index.html"></iframe>
      {!isMinted && (
        <button
          onClick={() => {
            setIsMinted(true);
          }}
        >
          Claim Your Humanity NFT
        </button>
      )}
      {isMinted && (
        <div>
          <button>Update Your Humanity NFT</button>
        </div>
      )}
      {isMinted && (
        <div>
          <button>Automate Update by Chainlink Automation</button>
        </div>
      )}
      <div>Go to Gitcoin Passport</div>
      <div>Powered by Chainlink</div>
    </main>
  );
}
