import { ethers, network } from "hardhat";

async function increaseTime(duration: number) {
  await network.provider.send("evm_increaseTime", [duration]);
  await network.provider.send("evm_mine"); // this is necessary to apply the time increase
}

describe("LinkBecomeHuman", function () {
  describe("Test", function () {
    const fixture = async () => {
      const [owner] = await ethers.getSigners();
      const LinkBecomeHuman = await ethers.getContractFactory("LinkBecomeHuman");
      const linkBecomeHuman = await LinkBecomeHuman.deploy();
      await linkBecomeHuman.deployed();
      return { linkBecomeHuman, owner };
    };

    it("integration", async function () {
      const { linkBecomeHuman, owner } = await fixture();
      const tokenId = await linkBecomeHuman.getTokenIdByAddress(owner.address);
      await linkBecomeHuman.connect(owner).mint();
      const metaData = await linkBecomeHuman.getMetaData(tokenId);
      console.log("metaData", metaData);
      JSON.parse(metaData);
      const tokenURI = await linkBecomeHuman.tokenURI(tokenId);
      console.log("tokenURI", tokenURI);
    });
  });
});
