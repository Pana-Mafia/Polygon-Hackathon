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
        "https://1.bp.blogspot.com/-n4Zy5znzzkQ/U9y_ul94R8I/AAAAAAAAjh4/sDzmU7G0UMA/s800/kippu.png",
        "https://free-icons.net/wp-content/uploads/2021/03/leisure02.png"
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

    function writeNFT(
        string memory _build,
        string memory _contribute,
        address _owner
    ) public {
        uint256 newItemId = _tokenIds.current();
        console.log(_build);

        // JSONファイルを所定の位置に取得し、base64としてエンコードします。
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"attributes":[{"display_type":"boost_percentage","trait_type":"build","value":',
                        _build,
                        '},{"display_type":"boost_percentage","trait_type":"contirbute","value":',
                        _contribute,
                        '}, {"trait_type":"Project","value":"polygon-hackathon"}], "name": "VizualizeCommitNFT", "description": "vizualize your contribution in a web3 project", "image": "',
                        // 画像設定
                        pickRandomImage(newItemId),
                        '"}'
                    )
                )
            )
        );

        string memory finalTokenUri = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        // console.log("\n----- Token URI ----");
        // console.log(test1);
        // console.log(test2);
        // console.log("--------------------\n");

        _safeMint(_owner, newItemId);

        _setTokenURI(newItemId, finalTokenUri);

        console.log(
            "An NFT w/ ID %s has been minted to %s",
            newItemId,
            msg.sender
        );
        _tokenIds.increment();
    }
}
