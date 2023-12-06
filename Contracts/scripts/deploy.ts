import { ethers } from "hardhat";

async function main() {
  const subscriptionId = 836;
  const subscriptionId_2 = 1689;
  const LinkBecomeHuman = await ethers.getContractFactory("LinkBecomeHuman");
  const linkBecomeHuman = await LinkBecomeHuman.deploy(subscriptionId, subscriptionId_2);
  await linkBecomeHuman.deployed();
  console.log(`LinkBecomeHuman deployed to ${linkBecomeHuman.address}`);
  // if (!process.env.SKIP_MINT) {
  //   // wait 5 seconds
  //   console.log("waiting 5 seconds...");
  //   await new Promise((r) => setTimeout(r, 5000));
  //   const [owner] = await ethers.getSigners();
  //   const tokenMintTx = await linkBecomeHuman.mint();
  //   await tokenMintTx.wait();
  //   const tokenId = await linkBecomeHuman.getTokenIdByAddress(owner.address);
  //   console.log("minted token: ", tokenId);
  // }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
