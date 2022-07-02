const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;
    var account = ""

    if (!ethereum) {
        console.log("Make sure you have Metamask installed!");
        return;
    } else {
        console.log("Wallet exists! We're ready to go!");
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });
    const network = await ethereum.request({ method: "eth_chainId" });

    if (accounts.length !== 0) {
        account = accounts[0];
        console.log("Found an authorized account: ", account);
        // setCurrentAccount(account);
    } else {
        console.log("No authorized account found");
    }
    return ({ account })
};

export default checkIfWalletIsConnected;