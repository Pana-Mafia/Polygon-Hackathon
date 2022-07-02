// run.js
const main = async () => {
    const nftContractFactory = await hre.ethers.getContractFactory("CreateNFT");
    const nftContract = await nftContractFactory.deploy();
    await nftContract.deployed();
    console.log("Contract deployed to:", nftContract.address);
    // writeNFT 関数を呼び出す。NFT が Mint される。
    let txn = await nftContract.writeNFT("20", "60");
    // Minting が仮想マイナーにより、承認されるのを待つ。
    await txn.wait();
    // writeNFT 関数をもう一度呼び出す。NFT がまた Mint される。
    // txn = await nftContract.writeNFT(10, 10);
    // // Minting が仮想マイナーにより、承認されるのを待つ。
    // await txn.wait();
};
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