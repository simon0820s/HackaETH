import { Signer } from "ethers"
import { ethers } from "hardhat";

import { CeloCop, LendingManager } from "../../typechain-types";
import { JUAN_ADDRESS, LUIS_ADDRESS, ONE_MILLION } from "../../config/constants";
import { getWallet } from "./wallet";

async function _initialize(cCop: CeloCop, lendingManager: LendingManager, users: Signer[]) {
    for (let index = 0; index < users.length; index++) {
        const user = users[index];
        await (await cCop.connect(user).approve(await lendingManager.getAddress(), ONE_MILLION)).wait()
        await (await lendingManager.connect(user).deposit(ONE_MILLION)).wait()
    }
}

export async function initialize(cCop: CeloCop, lendingManager: LendingManager) {
    const lpA = await getWallet(process.env.USER_1_PRIVATE ?? '');
    const lpB = await getWallet(process.env.USER_2_PRIVATE ?? '');
    const lpC = await getWallet(process.env.USER_3_PRIVATE ?? '');

    const LP_AMOUNT = ethers.parseUnits("100000", await cCop.decimals())
    const APPROVED_AMOUNT = ethers.parseUnits("1000", await cCop.decimals())

    // LP Funding
    await (await cCop.mint(lpA.address, LP_AMOUNT)).wait()
    await (await cCop.mint(lpB.address, LP_AMOUNT)).wait()
    await (await cCop.mint(lpC.address, LP_AMOUNT)).wait()
    await (await cCop.mint(LUIS_ADDRESS, LP_AMOUNT)).wait()
    await (await cCop.mint(JUAN_ADDRESS, LP_AMOUNT)).wait()

    await (await lendingManager.validateUser(LUIS_ADDRESS, APPROVED_AMOUNT)).wait()

    const compount = await lendingManager.calcCompoundInterest(
        ethers.parseEther("1000"),
        6n
    )
    console.log({ compount })

    await _initialize(cCop, lendingManager, [lpA, lpB, lpC])
}