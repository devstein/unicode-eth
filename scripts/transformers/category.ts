import { ethers } from "hardhat";

import { Character } from "../types";

// formatCategory to bytes4 representation
export const formatCategory = ({
  category,
  ...character
}: Character): Character => {
  const bytes32 = ethers.utils.formatBytes32String(category);
  // get 0x prefix + first four bytes 0x1122
  const bytes4 = bytes32.substring(0, 6);
  return {
    ...character,
    category: bytes4,
  };
};
