import { ethers } from "hardhat";

import { deployAll } from "./contracts";
import { initializeUnicodeData } from "./initialization";

async function main() {
  console.log("starting deployment...");
  const [unicodeData] = await deployAll();
  console.log("deployment complete.");
  await initializeUnicodeData(unicodeData);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
