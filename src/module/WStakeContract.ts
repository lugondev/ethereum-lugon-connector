import {WStakeABI} from "./WStakeABI";
import {UniSwapABI} from "./UniSwapABI";
import {formatEther} from "ethers/lib/utils";
import {utils} from "ethers";
import {notifyError, ethereum, handleError, chainConfig} from "..";
import {TokenABI} from "./TokenABI";

class WStakeContract {
    private readonly wStakeAddress: string;
    private wStakeContract: any;
    private readonly bondAddress: string;
    private bondTokenContract: any;
    private readonly lpTokenAddress: string;
    private lpTokenContract: any;
    private pid = "1";

    constructor() {
        this.wStakeAddress = chainConfig().wstakeContract;
        this.bondAddress = chainConfig().bondTokenContract;
        this.lpTokenAddress = chainConfig().lpContract;
    }

    setProvider(): WStakeContract {
        this.wStakeContract = ethereum.contract(WStakeABI, this.wStakeAddress);
        this.bondTokenContract = ethereum.contract(TokenABI, this.bondAddress);
        this.lpTokenContract = ethereum.contract(UniSwapABI, this.lpTokenAddress);
        return this;
    }

    async poolInfo(): Promise<any[]> {
        if (!ethereum.account) return [];
        return await ethereum.callContract(this.wStakeContract, "poolInfo", this.pid)
            .then((data) => {
                return Object.values(ethereum.web3.eth.abi.decodeParameters(["address", "uint256", "uint256", "uint256", "uint256", "address", "address", "uint256", "uint256"], data))
            })
            .catch(handleError([]));
    }

    async userInfo(): Promise<any[]> {
        if (!ethereum.account) return [0, 0, 0, 0];
        return await ethereum.callContract(this.wStakeContract, "userInfo", this.pid, ethereum.account)
            .then((data) => {
                return Object.values(ethereum.web3.eth.abi.decodeParameters(["uint256", "uint256", "uint256"], data))
            })
            .catch(handleError([0, 0, 0, 0]));
    }

    approve() {
        ethereum.sendContract(this.lpTokenContract, "approve", this.wStakeAddress, "1000000000000000000000000000").catch(notifyError);
    }

    async withdraw(amount: number) {
        await ethereum.sendContract(this.wStakeContract, "withdraw", this.pid, amount === 0 ? "0" : utils.parseUnits(String(amount)).toHexString()).catch(notifyError);
    }

    async deposit(amount: number) {
        await ethereum.sendContract(this.wStakeContract, "deposit", this.pid, utils.parseUnits(String(amount)).toHexString()).catch(notifyError);
    }

    async claim() {
        return this.withdraw(0);
    }

    async lpBalance() {
        return await ethereum.callContract(this.lpTokenContract, "balanceOf", ethereum.account)
            .then(formatEther)
            .catch(handleError(0))
    }

    async pendingWav3() {
        return await ethereum.callContract(this.wStakeContract, "pendingWav3", this.pid, ethereum.account)
            .then(formatEther)
            .catch(handleError(0))
    }

    async isApproved() {
        if (!this.lpTokenContract) return undefined;
        return await ethereum.callContract(this.lpTokenContract, "allowance", ethereum.account, this.wStakeAddress)
            .then(allowance => {
                return parseInt(formatEther(allowance)) > 0
            })
            .catch(handleError(undefined))
    }
}

export const wStakeContract = new WStakeContract();
