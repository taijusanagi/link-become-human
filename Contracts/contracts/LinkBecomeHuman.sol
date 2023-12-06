// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";

contract LinkBecomeHuman is ERC721, VRFConsumerBaseV2 {

    uint64 private s_subscriptionId;
    VRFCoordinatorV2Interface private COORDINATOR;
    address private vrfCoordinator = 0x2eD832Ba664535e5886b75D64C46EB9a228C2610;
    bytes32 private s_keyHash = 0x354d2f95da55398f44b7cff77da56283d9c6c829a4bdf1bbcaf2ad6a4d081f61;
    uint32 private callbackGasLimit = 40000;
    uint16 private requestConfirmations = 3;
    uint32 private numWords =  1;

    mapping(uint256 => uint256) public requestIdToTokenId;
    mapping(uint256 => uint256) public seeds;

    event SeedUpdated(uint256 indexed tokenId, uint256 seed);

    constructor(uint64 subscriptionId) ERC721("Link:BecomeHuman", "LBH") VRFConsumerBaseV2(vrfCoordinator) {
        COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
        s_subscriptionId = subscriptionId;
    }

    function mint() public {
        uint256 tokenId = getTokenIdByAddress(msg.sender);
        _mint(msg.sender, tokenId);
    }

    function requestRandomness(uint256 _tokenId) public {
        require(ownerOf(_tokenId) == msg.sender, "not token owner");
        uint256 requestId = COORDINATOR.requestRandomWords(
            s_keyHash,
            s_subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
       );
       requestIdToTokenId[requestId] = _tokenId;
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomValues) internal override {
        uint256 tokenId = requestIdToTokenId[requestId];
        uint256 randomValue = randomValues[0];
        seeds[tokenId] = randomValue;
        emit SeedUpdated(tokenId, randomValue);
    }

    // request Chainnlink function to get Gitcoin Passport humanity score
    // function requestHumanityScore(uint256 _tokenId) public {})

    // accept random value from Chainnlink VRF
    // function fulfillRandomness(uint256 _randomness) internal override {}

    // accept Gitcoin Passport humanity score from Chainnlink function
    // function setSeed(uint256 _tokenId, uint256 _seed) public {
    //     require(_exists(_tokenId), "query for nonexistent token");
    //     require(ownerOf(_tokenId) == msg.sender, "not owner");
    //     seeds[_tokenId] = _seed;
    // }

    function getTokenIdByAddress(address _address) public view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(_address)));
    }

    function getMetaData(uint256 _tokenId) public view returns (string memory) {
        require(_exists(_tokenId), "query for nonexistent token");

        string memory name = "Link:BecomeHuman";
        string memory description = "This is Link:BecomeHuman NFT";
        string memory image = "https://placehold.jp/500x500.png";
        string memory animationURL = "https://link-become-human.vercel.app/game/index.html";

        return
            string(
                abi.encodePacked(
                    '{"name":"',
                    name,
                    '","description":"',
                    description,
                    '","image":"',
                    image,
                    '","animation_url":"',
                    animationURL,
                    "?id=",
                    Strings.toString(_tokenId),
                    '"}'
                )
            );
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override 
        returns (string memory)
    {
        return string(
            abi.encodePacked(
                'data:application/json;base64,',
                Base64.encode(
                    bytes(getMetaData(tokenId))
                )
            )
        );
    }

    // This is address bounding token, so it is not transferable
    function _beforeTokenTransfer(
        address from, 
        address to, 
        uint256 tokenId,
        uint256 batchSize
    ) internal override virtual {
        require(from == address(0), "non transferable");   
        super._beforeTokenTransfer(from, to, tokenId, batchSize);  
    }
}
