import { ethers, network } from "hardhat";

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
      const testTokenId = await linkBecomeHuman.getTokenIdByAddress("0x3dAf2eAE4Fe3232Ed8a29c5e1be6eEba81C1CFD6");
      console.log("test", testTokenId.toString());

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
