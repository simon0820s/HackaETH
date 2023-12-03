import { ethers } from "hardhat";

import { initialize } from "./utils/initialize";
import { BRONZE_URI, GOLD_URI, SILVER_URI } from "../config/constants";

async function main() {
  const admin = (await (ethers as any).getSigners())[0];
  
  const CeloCop = await ethers.getContractFactory("CeloCop");
  const cCop = await (await CeloCop.deploy()).waitForDeployment();

  const LendingManager = await ethers.getContractFactory("LendingManager");
  const lendingManager = await (await LendingManager.deploy(admin.address, cCop.getAddress(), GOLD_URI, SILVER_URI, BRONZE_URI)).waitForDeployment()

  await initialize(cCop, lendingManager)

  console.log({
    lendingManager: await lendingManager.getAddress(),
    cCop: await cCop.getAddress()
  })
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
