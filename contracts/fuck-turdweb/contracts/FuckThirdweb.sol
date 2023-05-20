// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "@thirdweb-dev/contracts/base/ERC721LazyMint.sol";

contract FuckThirdweb is ERC721LazyMint {

   uint256 private rx_tokenCounter;

    constructor(
        string memory _name,
        string memory _symbol,
        address _royaltyRecipient,
        uint128 _royaltyBps
    ) ERC721LazyMint(_name, _symbol, _royaltyRecipient, _royaltyBps) {
        rx_tokenCounter = 0;
    }

    function doesThirdWebSuck() public pure returns (string memory) {
        return "YES! THIRDWEB SUCKS!";
    }
}