# Link: Become Human

![ui](./Docs/ui.png)

Dynamic NFT that utilizes Chainlink VRF, Chainlink Functions, and Chainlink Automation. It leverages the Gitcoin Passport's humanity score to show an android's transformation into a human within the NFT.

## Live App

https://link-become-human.vercel.app/

## Demo Video

https://youtu.be/bzFmTV1zfTk

## Technical Detail

### Dynamic NFT State

![dynamic](./Docs/dynamic.png)

- The humanity score affects the growth of the android.
- The random seed value affects accessories like hats and eyeglasses.

### Unity for Dynamic NFT

![dynamic-nft](./Docs/dynamic-nft.png)

- Dynamic NFTs are rendered using Unity and WebGL.
- Unity fetches data from The Graph and updates the state dynamically.
- The web app and Opensea display the same dynamic NFT using an iframe.

### Data Integration Diagram

![technical-detail](./Docs/technical-detail.png)

The details of Chainlink integration are maintained [here](./Docs/Chainlink-Integration.md).

- Gitcoin Passport as a source for humanity scores.
- Chainlink Functions for integrating humanity scores into NFT smart contracts.
- Chainlink Automation to automate the data fetching process.
- Chainlink VRF for generating random seed values.
- The Graph for data aggregation purposes.
- ENS for managing identity data, such as names and avatars.

## Avalanche Integration

The dynamic NFT is deployed Avalanche C-Chain Fuji Testnet.

https://testnet.snowtrace.io/address/0x98d80C7a5338fD211544f1f807D19F9191264Ce0#code-43113

Opensea supports Avalanche C-Chain Fuji Testnet and the asset page is here.

https://testnets.opensea.io/assets/avalanche-fuji/0x98d80C7a5338fD211544f1f807D19F9191264Ce0/1098112484341563293955512077999730492067707

## The Graph Integration

The Graph is used in a Unity C# script for data aggregation.
https://github.com/taijusanagi/link-become-human/blob/main/Assets/Scripts/GameManager.cs#L122

The following subgraphs are integrated.

- https://api.studio.thegraph.com/proxy/60667/linkbecomehuman/v0.0.1/graphql (New)
- https://api.thegraph.com/subgraphs/name/ensdomains/ens/graphql (Existing one for ENS)

## ENS Integration

- The ENS name is fetched by The Graph and displayed in the dynamic NFT.
- The ENS avatar is fetched by Rainbow Kit SDK.

![ui](./Docs/ui.png)
