// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";

import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/FunctionsClient.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/libraries/FunctionsRequest.sol";

contract LinkBecomeHuman is ERC721, VRFConsumerBaseV2, FunctionsClient, ConfirmedOwner {

    /*
     * Chainlink VRF states
     * https://docs.chain.link/vrf/v2/subscription/supported-networks
     * Configured for Avalanche Fuji Testnet
    */
    uint64 private s_subscriptionId;
    VRFCoordinatorV2Interface private COORDINATOR;
    address private vrfCoordinator = 0x2eD832Ba664535e5886b75D64C46EB9a228C2610;
    bytes32 private s_keyHash = 0x354d2f95da55398f44b7cff77da56283d9c6c829a4bdf1bbcaf2ad6a4d081f61;
    uint32 private callbackGasLimit = 40000;
    uint16 private requestConfirmations = 3;
    uint32 private numWords =  1;
    mapping(uint256 => uint256) public vrfRequestIdToTokenId;
    mapping(uint256 => uint256) public seeds;
    event SeedUpdated(uint256 indexed tokenId, uint256 seed);

    /*
     * Chainlink Functions states
     * https://docs.chain.link/chainlink-functions/supported-networks
     * Configured for Avalanche Fuji Testnet
    */
    address router = 0xA9d587a00A31A52Ed70D6026794a8FC5E2F5dCb0;
    uint32 gasLimit = 300000;
    bytes32 donID =
        0x66756e2d6176616c616e6368652d66756a692d31000000000000000000000000;
    string public character;
    mapping(uint256 => uint256) public functionRequestIdToTokenId;
    mapping(uint256 => uint256) public humanityScores;
    event humanityScoreUpdated(uint256 indexed tokenId, uint256 humanityScore);
    string source =
        "const characterId = args[0];"
        "const apiResponse = await Functions.makeHttpRequest({"
        "url: `https://swapi.dev/api/people/${characterId}/`"
        "});"
        "if (apiResponse.error) {"
        "throw Error('Request failed');"
        "}"
        "const { data } = apiResponse;"
        "return Functions.encodeString(data.name);";


    constructor(uint64 subscriptionId) 
        ERC721("Link:BecomeHuman", "LBH") 
        VRFConsumerBaseV2(vrfCoordinator) 
        FunctionsClient(router) 
        ConfirmedOwner(msg.sender) 
    {
        COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
        s_subscriptionId = subscriptionId;
    }

    /*
     * Chainlink VRF implementation
    */
    function requestRandomness(uint256 _tokenId) public {
        require(ownerOf(_tokenId) == msg.sender, "not token owner");
        uint256 requestId = COORDINATOR.requestRandomWords(
            s_keyHash,
            s_subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
       );
       vrfRequestIdToTokenId[requestId] = _tokenId;
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomValues) internal override {
        uint256 tokenId = vrfRequestIdToTokenId[requestId];
        uint256 randomValue = randomValues[0];
        seeds[tokenId] = randomValue;
        emit SeedUpdated(tokenId, randomValue);
    }

    /*
     * Chainlink Function implementation
    */

    function sendRequest(
        uint64 subscriptionId,
        uint256 tokenId
    ) external  {
        require(ownerOf(_tokenId) == msg.sender, "not token owner");        
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(source);
        req.setArgs(args);
        uint256 requestId = _sendRequest(
            req.encodeCBOR(),
            subscriptionId,
            gasLimit,
            donID
        );
        functionRequestIdToTokenId[requestId] = tokenId;
    }

    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        uint256 tokenId = functionRequestIdToTokenId[uint256(requestId)];
        uint256 humanityScore = uint256(response);
        humanityScores[tokenId] = humanityScore;
        humanityScoreUpdated(tokenId, humanityScore);
    }

    /*
     * NFT Implementation
    */
    function mint() public {
        uint256 tokenId = getTokenIdByAddress(msg.sender);
        _mint(msg.sender, tokenId);
    }

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
