import { ethers } from "hardhat";

import { deployAll } from "./contracts";

async function main() {
  console.log("starting deployment...");
  await deployAll();
  console.log("deployment complete.");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
