import { ethers, network } from "hardhat";
import { expect } from "chai";

describe("LinkBecomeHuman", function () {
  const subscriptionId = 0;
  const subscriptionId_2 = 0;
  describe("Test", function () {
    const fixture = async () => {
      const [owner] = await ethers.getSigners();
      const LinkBecomeHuman = await ethers.getContractFactory("LinkBecomeHuman");
      const linkBecomeHuman = await LinkBecomeHuman.deploy(subscriptionId, subscriptionId_2);
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
      await expect(
        linkBecomeHuman.transferFrom(owner.address, ethers.Wallet.createRandom().address, tokenId)
      ).to.be.revertedWith("non transferable");
    });
  });
});
