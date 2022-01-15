import { ethers } from "hardhat";
import fs from "fs";

import { fetchText } from "./utils";

import parseUnicodeData from "./parsers/unicode";
import parseJamo from "./parsers/jamo";
import parseDerivedData from "./parsers/derived";

import { formatCategory } from "./transformers/category";
import { formatEnums } from "./transformers/enum";
import { updateWithDerivedData } from "./transformers/derived";
import { expander } from "./transformers/expander";

import { Character, JamoShortNames, DerivedData } from "./types";

// WOW: https://github.com/ethers-io/ethers.js/blob/master/packages/strings/src.ts/utf8.ts#L293

const UNICODE_DATA_URL = "https://unicode.org/Public/UNIDATA/UnicodeData.txt";
const JAMO_URL = "http://unicode.org/Public/UNIDATA/Jamo.txt";
const DERIVED_DECOMPOSITION_TYPE_URL =
  "https://www.unicode.org/Public/UNIDATA/extracted/DerivedDecompositionType.txt";
const DERIVED_BIDI_CLASS_URL =
  "https://www.unicode.org/Public/UNIDATA/extracted/DerivedBidiClass.txt";

export const getUnicodeData = async (): Promise<Character[]> => {
  let derivedDecompTypes: DerivedData;
  try {
    // read cached file
    console.log("reading local derived decomposition types data...");
    const d = fs.readFileSync("./data/derivedDecompTypes.json");
    derivedDecompTypes = JSON.parse(d.toString());
  } catch (err) {
    console.log(err);
    console.log("fetching derived decomposition type data...");
    const derivedDecompTypesData = await fetchText(
      DERIVED_DECOMPOSITION_TYPE_URL
    );
    console.log("parsing derived decomposition type data...");
    derivedDecompTypes = parseDerivedData(derivedDecompTypesData);

    // saved to file system
    fs.writeFileSync(
      "./data/derivedDecompTypes.json",
      JSON.stringify(derivedDecompTypes, null, 2)
    );
  }

  let derivedBidiClasses: DerivedData;
  try {
    // read cached file
    console.log("reading local derived bidi class data...");
    const d = fs.readFileSync("./data/derivedBidiClasses.json");
    derivedBidiClasses = JSON.parse(d.toString());
  } catch (err) {
    console.log(err);
    console.log("fetching derived bidi class data...");
    const derivedBidiClassesData = await fetchText(DERIVED_BIDI_CLASS_URL);
    console.log("parsing derived bidi class data...");
    derivedBidiClasses = parseDerivedData(derivedBidiClassesData);
    // saved to file system
    fs.writeFileSync(
      "./data/derivedBidiClasses.json",
      JSON.stringify(derivedBidiClasses, null, 2)
    );
  }

  console.log("fetching jamo data...");
  const jamoData = await fetchText(JAMO_URL);
  console.log("parsing jamo data...");
  const jamoShortNames: JamoShortNames = parseJamo(jamoData);

  console.log("fetching unicode data...");
  const data = await fetchText(UNICODE_DATA_URL);

  console.log("transforming unicode data...");
  const characters: Character[] = parseUnicodeData(data)
    // @ts-ignore
    .reduce(expander(jamoShortNames), [])
    .map(updateWithDerivedData(derivedDecompTypes, derivedBidiClasses))
    .map(formatCategory)
    .map(formatEnums);

  console.log(characters.length);

  // save to validate
  fs.writeFileSync("./data/final.json", JSON.stringify(characters, null, 2));

  return characters;
};

async function main() {
  await getUnicodeData();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
