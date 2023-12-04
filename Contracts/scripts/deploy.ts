import { ethers } from "hardhat";

async function main() {
  const LinkBecomeHuman = await ethers.getContractFactory("LinkBecomeHuman");
  const linkBecomeHuman = await LinkBecomeHuman.deploy();
  await linkBecomeHuman.deployed();
  console.log(`LinkBecomeHuman deployed to ${linkBecomeHuman.address}`);
  if (!process.env.SKIP_MINT) {
    const [owner] = await ethers.getSigners();
    const tokenId = await linkBecomeHuman.getTokenIdByAddress(owner.address);
    const tokenMintTx = await linkBecomeHuman.mint();
    await tokenMintTx.wait();
    console.log("minted token: ", tokenId);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
