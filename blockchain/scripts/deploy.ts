import { ethers } from "hardhat";

import { initialize } from "./utils/initialize";

async function main() {
  const CeloCop = await ethers.getContractFactory("CeloCop");
  const cCop = await (await CeloCop.deploy()).waitForDeployment();

  const LendingManager = await ethers.getContractFactory("LendingManager");
  const lendingManager = await (await LendingManager.deploy(cCop.getAddress())).waitForDeployment()

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
