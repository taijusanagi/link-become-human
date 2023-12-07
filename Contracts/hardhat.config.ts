import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";

const accounts = process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [];

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  etherscan: {
    apiKey: {
      avalancheFujiTestnet: "fuji",
    },
  },
  networks: {
    goerli: {
      url: "https://rpc.ankr.com/eth_goerli",
      accounts,
    },
    mumbai: {
      url: "https://rpc.ankr.com/polygon_mumbai",
      accounts,
    },
    fuji: {
      url: "https://rpc.ankr.com/avalanche_fuji",
      accounts,
    },
  },
};

export default config;
