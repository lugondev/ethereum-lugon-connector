import {InjectedConnector} from "@web3-react/injected-connector";
import {WalletConnectConnector} from "@web3-react/walletconnect-connector";

const POLLING_INTERVAL = 12000;
const RPC_URLS = {
    // 1: "https://mainnet.infura.io/v3/6553d1c8e01442ffa57979c5fd752d66",
    // 4: "https://rinkeby.infura.io/v3/6553d1c8e01442ffa57979c5fd752d66"
    1: "https://mainnet.eth.aragon.network/",
    4: "https://rinkeby.eth.aragon.network/"
};

export const injected = new InjectedConnector({
    supportedChainIds: [1, 4,]
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
