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

    function toAsciiString(address x) internal pure returns (string memory) {
        bytes memory s = new bytes(40);
        for (uint256 i = 0; i < 20; i++) {
            bytes1 b = bytes1(uint8(uint256(uint160(x)) / (2**(8 * (19 - i)))));
            bytes1 hi = bytes1(uint8(b) / 16);
            bytes1 lo = bytes1(uint8(b) - 16 * uint8(hi));
            s[2 * i] = char(hi);
            s[2 * i + 1] = char(lo);
        }
        return string(s);
    }

    function char(bytes1 b) internal pure returns (bytes1 c) {
        if (uint8(b) < 10) return bytes1(uint8(b) + 0x30);
        else return bytes1(uint8(b) + 0x57);
    }

    function writeNFT(
        string memory _build,
        string memory _contribute,
        address _owner
    ) public {
        uint256 newItemId = _tokenIds.current();
        console.log(_build);

        // 文字列
        string memory combinedWord = string(
            abi.encodePacked(
                "In this project ",
                toAsciiString(_owner),
                " contributed to ",
                _build,
                "% "
            )
            // abi.encodePacked("testing our NFT service")
        );
        // 背景
        string
            memory baseSvg = "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 8px; }</style><rect width='100%' height='100%' fill='black' /><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";
        // 最終のデータ
        string memory finalSvg = string(
            abi.encodePacked(baseSvg, combinedWord, "</text></svg>")
        );

        // JSONファイルを所定の位置に取得し、base64としてエンコードします。
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"attributes":[{"display_type":"boost_percentage","trait_type":"build","value":',
                        _build,
                        '},{"display_type":"boost_percentage","trait_type":"contirbute","value":',
                        _contribute,
                        '}, {"trait_type":"Project","value":"polygon-hackathon"}], "name": "VizualizeCommitNFT", "description": "vizualize your contribution in a web3 project", "image": "data:image/svg+xml;base64,',
                        // 画像設定
                        Base64.encode(bytes(finalSvg)),
                        '"}'
                    )
                )
            )
        );

        string memory finalTokenUri = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        console.log("\n----- Token URI ----");
        // console.log(test1);
        console.log(finalSvg);
        console.log("--------------------\n");

        _safeMint(_owner, newItemId);

        _setTokenURI(newItemId, finalTokenUri);

        console.log(
            "An NFT w/ ID %s has been minted to %s",
            newItemId,
            msg.sender
        );
        _tokenIds.increment();
    }

    // 譲渡不可
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal pure override {
        // mintは許可（そのまま処理を通す）
        // transferは禁止（処理を中断させる）
        require(from == address(0));
    }
}
