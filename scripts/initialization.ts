import { Contract } from "ethers";

import { Character } from "./types";
import { getUnicodeData } from "./unicode-data";

const charToParameter = (c: Character) =>
  Object.values({
    name: c.name,
    numeric: [c.numeric.numerator, c.numeric.denominator],
    decompositonMapping: c.decomposition || [],
    category: c.category,
    combining: c.combining,
    bidirectional: c.bidirectional,
    decompositionType: c.decompositionType,
    decimal: c.decimal,
    digit: c.digit,
    mirrored: c.mirrored,
    uppercase: c.uppercase,
    lowercase: c.lowercase,
    titlecase: c.titlecase,
  });

export const initializeUnicodeData = async (contract: Contract) => {
  // get charactesr
  const characters = await getUnicodeData();

  const total = characters.length;
  let count = 0;
  for (let char of characters) {
    // keep track of progress
    count++;
    process.stdout.write(
      `${count} of ${total}\t${((count / total) * 100).toFixed(2)}% \r`
    );

    // set each character
    const str = String.fromCodePoint(char.code);
    const data = charToParameter(char);
    try {
      await contract.set(str, data);
    } catch (err) {
      console.error(err);
      console.log("failed to set:", char);
      break;
    }
  }
};
