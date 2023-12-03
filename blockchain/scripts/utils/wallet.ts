import { ethers, network } from 'hardhat';
import { Wallet } from "ethers";

export async function getWallet(privatekey: string): Promise<Wallet> {
    const provider = new ethers.JsonRpcProvider()
    const wallet = new ethers.Wallet(privatekey, provider)

    if (network.name === "localhost") {
        await network.provider.send(
            "hardhat_setBalance",
            [await wallet.getAddress(), "0xD3C21BCECCEDA1000000"]
        )
    }

    return wallet;
}