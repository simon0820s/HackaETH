import { Signer } from "ethers"
import { ethers } from "hardhat";

import { CeloCop, LendingManager } from "../../typechain-types";
import { LUIS_ADDRESS, ONE_MILLION } from "../../config/constants";
import { getWallet } from "./wallet";

async function _initialize(cCop: CeloCop, lendingManager: LendingManager, users: Signer[]) {
    async function batchApprove() {
        for await (const user of users) {
            await cCop.connect(user).approve(lendingManager.getAddress(), ONE_MILLION)
        }
    }

    async function batchDeposit() {
        for await (const user of users) {
            await lendingManager.connect(user).deposit(ONE_MILLION)
        }
    }

    await batchApprove()
    await batchDeposit()
}


export async function initialize(cCop: CeloCop, lendingManager: LendingManager) {
    const lpA = await getWallet(process.env.USER_1_PRIVATE ?? '');
    const lpB = await getWallet(process.env.USER_2_PRIVATE ?? '');
    const lpC = await getWallet(process.env.USER_3_PRIVATE ?? '');

    const LP_AMOUNT = ethers.parseUnits("100000", await cCop.decimals())
    const APPROVED_AMOUNT = ethers.parseUnits("1000", await cCop.decimals())

    // LP Funding
    await cCop.mint(lpA.address, LP_AMOUNT)
    await cCop.mint(lpB.address, LP_AMOUNT)
    await cCop.mint(lpC.address, LP_AMOUNT)
    await cCop.mint(LUIS_ADDRESS, LP_AMOUNT)

    await lendingManager.validateUser(LUIS_ADDRESS, APPROVED_AMOUNT)

    await _initialize(cCop, lendingManager, [lpA, lpB, lpC])
}