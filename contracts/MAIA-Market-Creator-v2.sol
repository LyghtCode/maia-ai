// SPDX-License-Identifier: MIT OR Apache-2.0


pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MAIANFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter public _tokenIds;
    address contractAddress;
    uint256 public cost = 0.0075 ether;

    constructor(address marketContract) ERC721("MAIA NFT Collection", "MAIA") {
        contractAddress = marketContract;
    }

    function createNFT(string memory tokenURI) public returns (uint) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        setApprovalForAll(contractAddress, true);
        return newItemId;
    }

    function mintNFT(string memory tokenURI) public payable returns (uint) {
        require(msg.value == cost, "Need to send 0.075 ether!");
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        setApprovalForAll(contractAddress, true);
        return newItemId;
    }

    function withdraw() public payable onlyOwner() {
        require(payable(msg.sender).send(address(this).balance));
    }
}
