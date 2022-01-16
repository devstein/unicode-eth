import { ethers } from "hardhat";
import { Contract } from "ethers";

const UNICODE_LIBRARY = "Unicode";
const UTF8_ENCODER_LIBRARY = "UTF8Encoder";
const UNICODE_DATA_CONTRACT = "UnicodeData";

export const deploy = async (id: string): Promise<Contract> => {
  const contractFactory = await ethers.getContractFactory(id);
  const contract = await contractFactory.deploy();
  await contract.deployed();
  console.log(`${id} contract deployed: ${contract.address}`);
  return contract;
};

export const deployAll = async (): Promise<Contract[]> => {
  const unicodeData = await deploy(UNICODE_DATA_CONTRACT);
  const unicodeLibrary = await deploy(UNICODE_LIBRARY);
  const utf8Encoder = await deploy(UTF8_ENCODER_LIBRARY);

  return [unicodeData, unicodeLibrary, utf8Encoder];
};
