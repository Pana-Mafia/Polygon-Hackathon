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
    let txn = await nftContract.writeNFT("43", "20", "0x3a0bE810754f7f7D04fCA10E2C11E93ebb5BF19e");
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