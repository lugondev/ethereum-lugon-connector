import {InjectedConnector} from "@web3-react/injected-connector";
import {WalletConnectConnector} from "@web3-react/walletconnect-connector";
import {ChainId, isMainNet, isDevEnv} from "..";

const POLLING_INTERVAL = 12000;
const RPC_URLS = {
    1: "https://mainnet.eth.aragon.network/",
    3: "https://ropsten.eth.aragon.network/",
    4: "https://rinkeby.eth.aragon.network/"
};

export const injected = new InjectedConnector({
    supportedChainIds: isDevEnv() ? [1, 4, 3] : isMainNet() ? [1] : [ChainId()]
});

export const walletConnect = getWalletConnect();

export function getWalletConnect() {
    return new WalletConnectConnector({
        rpc: {1: RPC_URLS[1]},
        bridge: "https://bridge.walletconnect.org",
        qrcode: true,
        pollingInterval: POLLING_INTERVAL
    });
}
