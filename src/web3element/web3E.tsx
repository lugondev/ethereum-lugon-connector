import React, {useEffect, useState} from "react";
import {useWeb3React, UnsupportedChainIdError, Web3ReactProvider} from "@web3-react/core";
import {NoEthereumProviderError, UserRejectedRequestError as UserRejectedRequestErrorInjected} from "@web3-react/injected-connector";
import {URI_AVAILABLE, UserRejectedRequestError as UserRejectedRequestErrorWalletConnect} from "@web3-react/walletconnect-connector";
import {UserRejectedRequestError as UserRejectedRequestErrorFrame} from "@web3-react/frame-connector";
import {formatEther} from "@ethersproject/units";
import {useEagerConnect, useInactiveListener, injected, walletConnect, ethereum, Notify} from "..";
import {wStakeContract} from "../module/WStakeContract";
import {tokenContract} from "../module/TokenContract";
import {Web3Provider} from "@ethersproject/providers";
import {Web3ReactContextInterface} from "@web3-react/core/dist/types";

const connectorsByName: any = {
    Injected: injected,
    WalletConnect: walletConnect,
};

const isOnlyMetamask = true;

function getErrorMessage(error: any, cb: any = null) {
    let errorMessage: string;
    if (error instanceof NoEthereumProviderError) {
        errorMessage = "No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.";
    } else if (error instanceof UnsupportedChainIdError) {
        errorMessage = "You're connected to an unsupported network.";
    } else if (
        error instanceof UserRejectedRequestErrorInjected ||
        error instanceof UserRejectedRequestErrorWalletConnect ||
        error instanceof UserRejectedRequestErrorFrame
    ) {
        errorMessage = "Please authorize this website to access your Ethereum account.";
    } else {
        console.error(error);
        errorMessage = "An unknown error occurred. Check the console for more details.";
    }

    if (errorMessage) Notify({
        type: "error",
        message: errorMessage,
    });

    if (cb) cb();
    return <></>
}

function getLibrary(provider: any) {
    const library = new Web3Provider(provider);
    library.pollingInterval = 8000;
    return library;
}

export function Web3Root({children}: any) {
    return (
        <Web3ReactProvider getLibrary={getLibrary}>
            {children}
        </Web3ReactProvider>
    );
}

export interface IChainValue {
    blockNumber: number,
    eth: number,
    tokenBalance: number,
    chainId: number,
    address: string,
}


function updateProvider(context: Web3ReactContextInterface) {
    if (context) {
        const {library, account, chainId, active, error} = context;
        ethereum.setProvider(library, () => {
            tokenContract.setProvider();
            wStakeContract.setProvider();
            ethereum.setAccount(account);
            ethereum.setChainId(chainId);
        });
    } else {
        ethereum.setProvider(undefined)
    }
}

export function Web3Element(
    {
        children,
        onDisconnect,
        connectedElement,
        connectElement,
        invalidNetworkElement,
        returnInformation
    }: any) {
    // const newWalletState = Object.assign()
    const context = useWeb3React();
    const {
        connector,
        library,
        chainId,
        account,
        activate,
        deactivate,
        active,
        error
    }: any = context;

    // const chainData = {
    //     blockNumber: -1,
    //     eth: -1,
    //     tokenBalance: -1,
    //     chainId: -1,
    //     address: "",
    // };

    const [chainData, setChainData] = useState<IChainValue>({
        blockNumber: -1,
        eth: -1,
        tokenBalance: -1,
        chainId: -1,
        address: "",
    });
    // handle logic to recognize the connector currently being activated
    const [activatingConnector, setActivatingConnector] = useState<any>();
    // set up block listener
    const [blockNumber, setBlockNumber] = useState(0);

    useEffect(() => {
        updateProvider(context);
        setChainData(Object.assign(chainData, {address: account || "", chainId}));
        console.log("account: updated")
    }, [account, chainId, library]);

    useEffect(() => {
        console.log('running');
        if (activatingConnector && activatingConnector === connector) {
            setActivatingConnector(undefined);
        }
    }, [activatingConnector, connector]);

    // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
    const triedEager = useEagerConnect();

    // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
    useInactiveListener(!triedEager || !!activatingConnector);

    useEffect(() => {
        console.log('running');
        if (library) {
            let stale = false;
            console.log('fetching block number!!');
            library
                .getBlockNumber()
                .then((blockNumber: number) => {
                    if (!stale) {
                        setBlockNumber(blockNumber);
                        // setChainData(Object.assign(chainData, {blockNumber}))
                    }
                })
                .catch();

            const updateBlockNumber = (blockNumber: number) => {
                setBlockNumber(blockNumber);
                // setChainData(Object.assign(chainData, {blockNumber}))
            };
            library.on("block", updateBlockNumber);

            return () => {
                library.removeListener("block", updateBlockNumber);
                stale = true;
                setBlockNumber(0);
                // setChainData(Object.assign(chainData, {blockNumber: 0}))
            };
        }
    }, [library, chainId]);

    useEffect(() => {
        if (library && account) {
            let stale = false;
            library
                .getBalance(account)
                .then((balance: any) => {
                    if (!stale) {
                        setChainData(Object.assign(chainData, {eth: parseFloat(formatEther(balance))}))
                    }
                })
                .catch();
            // tokenContract.balanceOf().then(balance => {
            //     setChainData(Object.assign(chainData, {tokenBalance: balance}))
            // }).catch(_ => {
            //     setChainData(Object.assign(chainData, {tokenBalance: 0}))
            // });
            return () => {
                stale = true;
                setChainData(Object.assign(chainData, {eth: 0}))
            };
        }
    }, [library, account, chainId]);

    // log the walletconnect URI
    useEffect(() => {
        const logURI = (uri: any) => {
            console.log("WalletConnect URI", uri);
        };
        walletConnect.on(URI_AVAILABLE, logURI);

        return () => {
            walletConnect.off(URI_AVAILABLE, logURI);
        };
    }, []);

    const [show, setShow] = useState(false);
    const [isShowError, setShowError] = useState(true);
    const unlockWalletClose = () => setShow(false);
    const unlockWalletShow = () => {
        setShowError(true);
        if ((active && !error) || !isOnlyMetamask) {
            setShow(true)
        } else {
            setActivatingConnector(connectorsByName.Injected);
            activate(connectorsByName.Injected).then(() => {
                updateProvider(context);
                unlockWalletClose();
            });
        }
    };

    function ValidWeb3(comp: any) {
        return <div onClick={unlockWalletShow}>{comp}</div>
    }

    if (returnInformation) {
        return children({context, chainData});
    }

    return (
        <div>
            <div className="connect-btn">
                {(active && !error) ?
                    (ethereum.isValidChainId ? (!!children ? children(context) :
                        ValidWeb3(connectedElement ? connectedElement : <button className="btn btn-primary">Connected Wallet</button>))
                        : (!!invalidNetworkElement ? invalidNetworkElement : <button className="btn btn-danger">Invalid Network</button>))
                    : ValidWeb3(!!connectElement ? connectElement
                        : <button className="btn btn-primary">UNLOCK</button>)
                }
            </div>
            {!!error && isShowError && getErrorMessage(error, () => {
                setShowError(false)
            })}
            {/*<Modal*/}
            {/*    show={show}*/}
            {/*    onHide={unlockWalletClose}*/}
            {/*    animation={false}*/}
            {/*    aria-labelledby="contained-modal-title-vcenter"*/}
            {/*    centered*/}
            {/*    id="connect-wallet"*/}
            {/*>*/}
            {/*    {(active && !error) ? <Modal.Body>*/}
            {/*        <div className="row">*/}
            {/*            <div className="col-12 text-center">*/}
            {/*                <h4 className="mb-4">My Account</h4>*/}
            {/*                <div className="balance">*/}
            {/*                    <h1>{chainData.tokenBalance.toFixed(6)}</h1>*/}
            {/*                    <h4 className="text-muted">Token</h4>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*        <div className="row mt-4">*/}
            {/*            <div className="col-12 text-center mb-3">*/}
            {/*                <button type="button" className="btn btn-primary d-block m-auto w-50" onClick={() => {*/}
            {/*                    window.open(`https://etherscan.io/address/${account}`, "_blank")*/}
            {/*                }}>*/}
            {/*                    View on Etherscan*/}
            {/*                </button>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*        <div className="row">*/}
            {/*            <div className="col-12 text-center">*/}
            {/*                <h6>Chain ID: {chainId}</h6>*/}
            {/*                <h6>Block number: {blockNumber}</h6>*/}
            {/*                <h6>Balance: {`Ξ${parseFloat(formatEther(chainData.eth.toString())).toPrecision(4)}`}</h6>*/}
            {/*                <h6>Account: {showShortAddress(account || "")}</h6>*/}
            {/*            </div>*/}
            {/*            <div className="col-12 text-center mb-3">*/}
            {/*                /!*<img style={{height: "79px"}} src={require("../../assets/img/disconnect.svg")} className="" alt="disconnect"/>*!/*/}
            {/*            </div>*/}
            {/*            <div className="col-12 text-center">*/}
            {/*                <button className="btn btn-danger" onClick={async () => {*/}
            {/*                    await deactivate();*/}
            {/*                    await ethereum.setProvider(undefined);*/}
            {/*                    try {*/}
            {/*                        await connector?.close();*/}
            {/*                        connectorsByName.WalletConnect = getWalletConnect();*/}
            {/*                    } catch (e) {*/}

            {/*                    }*/}
            {/*                    if (isOnlyMetamask) {*/}
            {/*                        unlockWalletClose()*/}
            {/*                    }*/}

            {/*                    if (onDisconnect) {*/}
            {/*                        onDisconnect();*/}
            {/*                    }*/}
            {/*                }}>Disconnect*/}
            {/*                </button>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </Modal.Body> : <Modal.Body>*/}
            {/*        <div className="row">*/}
            {/*            {!isMobile() && <div className="col-6 text-center">*/}
            {/*                <img src={require("./metamask.svg")} className="" alt="Metamask connect"/>*/}
            {/*                <button className="btn btn-primary" onClick={() => {*/}
            {/*                    setActivatingConnector(connectorsByName.Injected);*/}
            {/*                    activate(connectorsByName.Injected).then(() => {*/}
            {/*                        updateProvider(context);*/}
            {/*                        unlockWalletClose();*/}
            {/*                    });*/}
            {/*                }}>Connect Metamask*/}
            {/*                </button>*/}
            {/*            </div>}*/}
            {/*            <div className={`col-${isMobile() ? "12" : "6"} text-center`}>*/}
            {/*                <img src={require("./wallet-connect.svg")} className="" alt="Wallet connect"/>*/}
            {/*                <button className="btn btn-primary" onClick={() => {*/}
            {/*                    setActivatingConnector(connectorsByName.WalletConnect);*/}
            {/*                    activate(connectorsByName.WalletConnect, (e: any) => {*/}
            {/*                        connectorsByName.WalletConnect = getWalletConnect();*/}
            {/*                        Notify({*/}
            {/*                            type: "error",*/}
            {/*                            message: e.message,*/}
            {/*                        });*/}
            {/*                    }).then(() => {*/}
            {/*                        if (active && !error) {*/}
            {/*                            updateProvider(context);*/}
            {/*                            unlockWalletClose();*/}
            {/*                        }*/}
            {/*                    });*/}
            {/*                }}>Connect {isMobile() ? "Mobile" : "Wallet"}*/}
            {/*                </button>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </Modal.Body>}*/}
            {/*    <Modal.Footer>*/}
            {/*        <button*/}
            {/*            type="button"*/}
            {/*            className="btn btn-light w-50 m-auto"*/}
            {/*            onClick={unlockWalletClose}*/}
            {/*        >*/}
            {/*            Cancel*/}
            {/*        </button>*/}
            {/*    </Modal.Footer>*/}
            {/*</Modal>*/}
        </div>
    );
}
