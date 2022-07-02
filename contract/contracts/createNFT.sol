// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

import {Base64} from "./libraries/Base64.sol";

contract CreateNFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // NFT トークンの名前とそのシンボルを渡します。
    constructor() ERC721("CommitNFT", "COMMIT") {
        console.log("Vizualize your contribution!");
    }

    // 画像をランダムに選ぶための配列
    string[] images = [
        "https://icooon-mono.com/i/icon_14482/icon_144820_256.png",
        "https://imgur.com/a/EDiTvUG"
    ];

    // シードを生成する関数を作成します。
    function random(string memory input) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(input)));
    }

    function pickRandomImage(uint256 tokenId)
        public
        view
        returns (string memory)
    {
        // pickRandomSecondWord 関数のシードとなる rand を作成します。
        uint256 rand = random(
            string(abi.encodePacked("IMAGE", Strings.toString(tokenId)))
        );
        rand = rand % images.length;
        return images[rand];
    }

    function writeNFT() public {
        uint256 newItemId = _tokenIds.current();

        // JSONファイルを所定の位置に取得し、base64としてエンコードします。
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "VizualizeCommitNFT", "description": "vizualize your contribution in a web3 project", "image": "',
                        // NFTのタイトルを生成される言葉（例: GrandCuteBird）に設定します。
                        pickRandomImage(newItemId),
                        '"}'
                    )
                )
            )
        );

        string memory finalTokenUri = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        console.log("\n----- Token URI ----");
        console.log(finalTokenUri);
        console.log("--------------------\n");

        _safeMint(msg.sender, newItemId);

        _setTokenURI(newItemId, finalTokenUri);

        console.log(
            "An NFT w/ ID %s has been minted to %s",
            newItemId,
            msg.sender
        );
        _tokenIds.increment();
    }
}
