import { Contract } from "ethers";

import { Character } from "./types";
import { getUnicodeData } from "./unicode-data";

// roughly the number of characters we can set within the gas limit
const BATCH_SIZE = 125;

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
  const numBatches = total / BATCH_SIZE;
  let count = 0;
  let failed = false;
  let batch = {
    codes: [],
    data: [],
  };

  for (let char of characters) {
    // keep track of progress
    count++;
    process.stdout.clearLine(1);
    process.stdout.write(
      `${count} of ${total}\t${((count / total) * 100).toFixed(2)}% \t ${
        char.name
      }\r`
    );

    // set each character
    const data = charToParameter(char);

    // @ts-ignore
    batch.codes = [...batch.codes, char.code];
    // @ts-ignore
    batch.data = [...batch.data, data];

    if (batch.codes.length < BATCH_SIZE) {
      continue;
    }

    try {
      await contract.setBatch(batch.codes, batch.data);
      // reset
      batch = {
        codes: [],
        data: [],
      };
    } catch (err) {
      console.log(err);
      console.log("failed to set:", char);
      failed = true;
      break;
    }
  }

  // set final batch if it exists
  if (!batch.codes.length || failed) return;

  try {
    await contract.setBatch(batch.codes, batch.data);
    // reset
    batch = {
      codes: [],
      data: [],
    };
  } catch (err) {
    console.log("failed to set final batch:", batch);
  }
};
