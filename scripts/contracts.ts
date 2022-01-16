import { ethers } from "hardhat";
import { Contract } from "ethers";

const UNICODE_LIBRARY = "Unicode";
const UNICODE_DATA_CONTRACT = "UnicodeData";

export const deployUnicodeData = async (): Promise<Contract> => {
  const contractFactory = await ethers.getContractFactory(
    UNICODE_DATA_CONTRACT
  );
  const contract = await contractFactory.deploy();
  await contract.deployed();
  console.log(
    `${UNICODE_DATA_CONTRACT} contract deployed: ${contract.address}`
  );
  return contract;
};

export const deployUnicodeLibrary = async (): Promise<Contract> => {
  const contractFactory = await ethers.getContractFactory(UNICODE_LIBRARY);
  const contract = await contractFactory.deploy();
  await contract.deployed();
  console.log(`${UNICODE_LIBRARY} contract deployed: ${contract.address}`);
  return contract;
};

export const deployAll = async (): Promise<Contract[]> => {
  const unicodeData = await deployUnicodeData();
  const unicodeLibrary = await deployUnicodeLibrary();

  return [unicodeData, unicodeLibrary];
};
