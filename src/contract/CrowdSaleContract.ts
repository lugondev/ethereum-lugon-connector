import {humanBalance, ethereum, handleError, notifyError, chainConfig} from "..";
import {CrowdSaleABI} from "./CrowdSaleABI";

class CrowdSaleContract {
    private readonly crowdSaleAddress: any;
    private crowdSaleContract: any;

    constructor() {
        const config = chainConfig();
        this.crowdSaleAddress = config.crowdSaleContract;
    }

    setProvider(): CrowdSaleContract {
        this.crowdSaleContract = ethereum.contract(CrowdSaleABI, this.crowdSaleAddress);
        return this;
    }

    async getCrowdSaleBalance() {
        if (!this.crowdSaleContract || !ethereum.isValidChainId || !ethereum.account) return 0;
        const balance = await ethereum.callContract(this.crowdSaleContract, "balanceOf", ethereum.account).catch(handleError(0));
        return humanBalance(balance);
    }

    async sendEth(amount: number) {
        await ethereum.sendETH(this.crowdSaleAddress, amount).catch(notifyError);
    }

    async buyTokens(amount: number) {
        await ethereum.sendEthToContract(crowdSaleContract, amount, "buyTokens").catch(notifyError);
    }

    async withdrawable() {
        if (!this.crowdSaleContract) return false;
        return await ethereum.callContract(this.crowdSaleContract, "withdrawable").catch(handleError(false));
    }

    async hasClosed() {
        if (!this.crowdSaleContract) return false;
        return await ethereum.callContract(this.crowdSaleContract, "hasClosed").catch(handleError(false));
    }

    async isOpen() {
        if (!this.crowdSaleContract) return false;
        return await ethereum.callContract(this.crowdSaleContract, "isOpen").catch(handleError(false));
    }

    async withdraw() {
        return await ethereum.sendContract(this.crowdSaleContract, "withdrawTokens").catch(notifyError);
    }
}

export const crowdSaleContract = new CrowdSaleContract();
