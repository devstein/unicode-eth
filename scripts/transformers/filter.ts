import { ethers } from "hardhat";
import { Character } from "../types";

// https://www.unicode.org/versions/stats/charcountv14_0.html
const NON_CHARACTERS = ["Cn", "Cs", "Cc", "Co"];

export const onlyCharacters = ({ category }: Character) =>
  !NON_CHARACTERS.includes(category);
