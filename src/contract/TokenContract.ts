import {ethereum, handleError, humanBalance, chainConfig} from "..";
import {TokenABI} from "./TokenABI";

class TokenContract {
    private readonly tokenAddress: string;
    private contract: any;

    constructor() {
        const config = chainConfig();
        this.tokenAddress = config.tokenContract;
    }

    setProvider(): TokenContract {
        this.contract = ethereum.contract(TokenABI, this.tokenAddress);
        return this;
    }

    async totalSupply() {
        let totalSupply = await ethereum.callContract(this.contract, "totalSupply").catch(handleError(0));
        return humanBalance(totalSupply);
    }
}

export const Token = new TokenContract();
