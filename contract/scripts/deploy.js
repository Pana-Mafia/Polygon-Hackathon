// deploy.js
const main = async () => {
    // コントラクトがコンパイルします
    // コントラクトを扱うために必要なファイルが `artifacts` ディレクトリの直下に生成されます。
    const nftContractFactory = await hre.ethers.getContractFactory("CreateNFT");
    // Hardhat がローカルの Ethereum ネットワークを作成します。
    const nftContract = await nftContractFactory.deploy();
    // コントラクトが Mint され、ローカルのブロックチェーンにデプロイされるまで待ちます。
    await nftContract.deployed();
    console.log("Contract deployed to:", nftContract.address);
    // writeNFT 関数を呼び出す。NFT が Mint される。
    let txn = await nftContract.writeNFT("43", "20", "0x80a6a28291DD9226f36fa27Ee9C750119087E08a");
    // Minting が仮想マイナーにより、承認されるのを待ちます。
    await txn.wait();
    console.log("Minted NFT");
};
// エラー処理を行っています。
const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};
runMain();