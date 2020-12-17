export function ChainId(): number {
    return parseInt(process.env.REACT_APP_CHAIN || "1")
}

export function isMainNet(): boolean {
    return ChainId() === 1;
}

export function getChainConfig() {
    if (isMainNet()) {
        return {
            crowdSaleContract: "0x74AF7B62Aca57EF5d049bFf138cc66c58699E67D",
            tokenContract: "0x2Bf84520c4a3d7623Ef040E0Ba78D5A3365A479C",
            wstakeContract: "0x255a2b1d9404b50cf56a2809bc01a1e334d714f9",
            bondTokenContract: "0x312B88f252e9BAa4BE6fA9244F61a83cb8b43dD5",
            lpContract: "0xe13388bef561dcfb66c461c7911a15d82d00e3ba",
        };
    }
    return {
        crowdSaleContract: "0x9bb6ce56f010073c54b1c2c266058ab1387b8365",
        tokenContract: "0xf93627757e0188838c624fd6df6bcdbd72bf98d2",
        lpContract: "0x63bd986a9078906f62c8f01420b9bb1de792f5bd",
        bondTokenContract: "0x21286852b9657b9d1757fcabf21dce33067db636",
        wstakeContract: "0x6d7D6180c9752C15d95b7B768dcB0C4E4a716Fcf",
    }
}
