import {humanBalance, ethereum, handleError, chainConfig} from "..";
import {TokenABI} from "./TokenABI";

class TokenContract {
    private readonly tokenAddress: string;
    private contract: any;

    constructor() {
        this.tokenAddress = chainConfig().tokenContract;
    }

    setProvider(): TokenContract {
        this.contract = ethereum.contract(TokenABI, this.tokenAddress);
        return this;
    }

    async totalSupply() {
        let totalSupply = await ethereum.callContract(this.contract, "totalSupply").catch(handleError(0));
        return humanBalance(totalSupply);
    }

    async balanceOf() {
        let balanceOf = await ethereum.callContract(this.contract, "balanceOf", ethereum.account).catch(handleError(0));
        return humanBalance(balanceOf);
    }
}

export const tokenContract = new TokenContract();
