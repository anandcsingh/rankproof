import {
    PublicKey,
    PrivateKey,
    Field,
} from 'snarkyjs'

const Authentication = {
    contractAddress: 'B62qnR6TwcenxCngC8sToWkPfsBEE1NguQDyoEeb64X1GzqAXLkKuxq',
    loggedIn: false,
    zkClient: null,
    authentication: null,
    hasWallet: null,
    hasBeenSetup: false,
    accountExists: false,
    currentNum: null,
    publicKey: null,
    zkappPublicKey: null,
    creatingTransaction: false,
    snarkyLoaded: false,
    showRequestingAccount: false,
    showCreateWallet: false,
    fundAccount: false,
    showLoadingContracts: false,
    setZkClient: function (client) {
        this.zkClient = client;
    },
    loadSnarky: async function () {
        await this.zkClient.loadSnarkyJS();
        await this.zkClient.setActiveInstanceToBerkeley();
        this.snarkyLoaded = true;
        return true;
    },
    checkForWallet: async function () {
        const mina = window.mina;
        this.hasWallet = mina != null;
        return this.hasWallet;
    },
    login: async function () {
        try {
            const mina = window.mina;
            this.address = (await mina.requestAccounts())[0];
            this.loggedIn = true;
            return {
                success: true
            };
        } catch (e) {

            this.loggedIn = false;
            var result = {
                success: false
            };
            if (e.message == "user reject") {
                result.error = e.message;
                result.message = "You cancelled connection with Mina wallet!";
            }
            else if (e.message == "please create or restore wallet first") {
                result.error = e.message;
                result.message = "Please create or restore a wallet first!";
            }
            return result;
        }
    },
    doesAccountExist: async function () {
        const publicKey = PublicKey.fromBase58(this.address);
        const res = await this.zkClient.fetchAccount({ publicKey: publicKey });
        this.fundAccount = res.error != null;
        return !this.fundAccount;
    },
    setupContracts: async function () {
        await this.zkClient.loadContract();
        await this.zkClient.compileContract();
        //const contractAddress = 'B62qqEme9EYMj3KC4vSXij2vAwt8qxLiKLsrHPprQeYXXmjTFUH16wF';
        const zkappPublicKey = PublicKey.fromBase58(this.contractAddress);
        await this.zkClient.initZkappInstance(zkappPublicKey);
        this.hasBeenSetup = true;
        return true;
    },
    fetchZkappAccount: async function() {
        await this.zkClient.fetchAccount({ publicKey: this.contractAddress });
    },
    getNum: async function () {
        if (this.hasBeenSetup) {
            //const zkappPublicKey = PublicKey.fromBase58('B62qqEme9EYMj3KC4vSXij2vAwt8qxLiKLsrHPprQeYXXmjTFUH16wF');
            await this.zkClient.fetchAccount({ publicKey: this.contractAddress })

            const currentNum = await this.zkClient.getNum();
            console.log('current state:', currentNum.toString());
        }
        else {
            console.log("has not been setup");
        }
    },
    address: '',
    getShortAddress: function () {
        return this.address.substring(0, 5) + "..." + this.address.substring(this.address.length - 5, this.address.length);
    }
}

export default Authentication;