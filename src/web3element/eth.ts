import Web3 from "web3";
import {ChainId, valueToHex} from "..";
import {Notify} from "./ui";

const Contract = require("web3-eth-contract");

export function notifyError(err: any, log: boolean = false) {
    if (log) console.log(err);
    const {error, message} = err;
    if (error && error.message || message)
        Notify({type: "error", message: message || error.message});
    else
        Notify({type: "error", message: "Error."})
}

export function notifyErrorReturn(returnValue: any, log: boolean = false) {
    return (error: any) => {
        notifyError(error, log);
        return returnValue;
    }
}

export function handleError(returnValue: any, log: boolean = false) {
    return (error: any) => {
        if (log) console.log(error);
        return returnValue;
    }
}

class Eth {
    private library: any | undefined;
    public account: string | null | undefined;
    public chainId: number | undefined;
    public isValidChainId: boolean;
    public web3 = new Web3();

    constructor() {
        this.isValidChainId = false
    }

    setProvider(provider: any, cb?: any) {
        if (provider === undefined) {
            this.setAccount(undefined);
            this.setChainId(undefined);
            this.isValidChainId = false;
        } else {
            this.library = provider;
        }
        if (cb) cb();
    }

    setAccount(account: string | null | undefined): Eth {
        console.log("-----> logged: " + account);
        this.account = account;
        return this;
    }

    setChainId(chainId: number | undefined): Eth {
        this.chainId = chainId;
        this.isValidChainId = this.chainId === ChainId();
        return this;
    }

    getProvider() {
        return this.library;
    }

    private checkProvider() {
        if (!this.isValidChainId || !this.library || !this.account) {
            throw "Invalid network";
        }
    }

    private checkBeforeInteractContract(contract: any) {
        this.checkProvider();
        if (!contract) {
            throw  "Invalid contract";
        }
    }

    contract(abi: any, contractAddress: string): any {
        return new Contract(abi, contractAddress);
    }

    generateDataByAbi(abi: any, contractAddress: string, method: string, ...params: any) {
        this.checkProvider();
        const contract = this.contract(abi, contractAddress);
        return contract.methods[method](...params).encodeABI();
    }

    generateDataByContract(contract: any, method: string, ...params: any) {
        this.checkBeforeInteractContract(contract);
        return contract.methods[method](...params).encodeABI();
    }

    private getSigner() {
        if (!this.account) {
            throw "Invalid account";
        }
        return this.getProvider().getSigner(this.account as string);
    }

    async send(abi: any, contractAddress: string, method: string, ...params: any) {
        this.checkProvider();
        return this.getSigner().sendTransaction({
            data: this.generateDataByAbi(abi, contractAddress, method, params),
            to: contractAddress,
            from: this.account as string,
        });
    }

    async sendContract(contract: any, method: string, ...params: any) {
        this.checkBeforeInteractContract(contract);
        return this.getSigner().sendTransaction({
            data: this.generateDataByContract(contract, method, ...params),
            to: contract.options.address,
            from: this.account as string,
        });
    }

    async sendETH(to: string, amount: number) {
        this.checkProvider();
        return this.getSigner().sendTransaction({
            value: Web3.utils.numberToHex(valueToHex(amount)),
            to, from: this.account as string,
        });
    }

    async sendEthToContract(contract: any, amount: number, method: string, ...params: any) {
        this.checkProvider();
        return this.getSigner().sendTransaction({
            value: valueToHex(amount),
            data: this.generateDataByContract(contract, method, ...params),
            to: contract.options.address,
            from: this.account as string,
        });
    }

    async callContract(contract: any, method: string, ...params: any) {
        this.checkBeforeInteractContract(contract);
        return await this.getSigner().call({
            data: this.generateDataByContract(contract, method, ...params),
            to: contract.options.address,
            from: this.account as string,
        });
    }

    async call(abi: any, contractAddress: string, method: string, ...params: any) {
        this.checkProvider();
        return await this.getSigner().call({
            data: this.generateDataByAbi(abi, contractAddress, method, ...params),
            to: contractAddress,
            from: this.account as string,
        });
    }
}

export const ethereum = new Eth();
