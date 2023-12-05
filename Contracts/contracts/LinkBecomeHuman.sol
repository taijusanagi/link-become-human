// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

// TODO: make it sbt
// TODO; use address for key

contract LinkBecomeHuman is ERC721 {
    constructor() ERC721("LinkBecomeHuman", "LBH") {}

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
}
