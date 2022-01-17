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
import { onlyCharacters } from "./transformers/filter";

import { Character, JamoShortNames, DerivedData } from "./types";

const UNICODE_DATA_URL = "https://unicode.org/Public/UNIDATA/UnicodeData.txt";
const JAMO_URL = "http://unicode.org/Public/UNIDATA/Jamo.txt";
const DERIVED_DECOMPOSITION_TYPE_URL =
  "https://www.unicode.org/Public/UNIDATA/extracted/DerivedDecompositionType.txt";
const DERIVED_BIDI_CLASS_URL =
  "https://www.unicode.org/Public/UNIDATA/extracted/DerivedBidiClass.txt";

const DATA_DIR = "./data";
const UNICODE_FILE = `${DATA_DIR}/unicode.json`;
const DERIVED_DECOMPOSITION_FILE = `${DATA_DIR}/derivedDecompTypes.json`;
const DERIVED_BIDI_CLASS_FILE = `${DATA_DIR}/derivedBidiClasses.json`;
const JAMO_FILE = `${DATA_DIR}/jamo.json`;

export const getUnicodeData = async (): Promise<Character[]> => {
  // check if file exists
  try {
    console.log("reading local unicode file...");
    const data = fs.readFileSync(UNICODE_FILE).toString();
    return JSON.parse(data);
  } catch (err) {
    console.log("no unicode data file found.\nre-computing...");
  }

  let derivedDecompTypes: DerivedData;
  try {
    // read cached file
    console.log("reading local derived decomposition types data...");
    const data = fs.readFileSync(DERIVED_DECOMPOSITION_FILE).toString();
    derivedDecompTypes = JSON.parse(data);
  } catch (err) {
    console.log("no local derived decomposition types found");
    console.log("fetching derived decomposition type data...");
    const derivedDecompTypesData = await fetchText(
      DERIVED_DECOMPOSITION_TYPE_URL
    );
    console.log("parsing derived decomposition type data...");
    derivedDecompTypes = parseDerivedData(derivedDecompTypesData);

    // saved to file system
    fs.writeFileSync(
      DERIVED_DECOMPOSITION_FILE,
      JSON.stringify(derivedDecompTypes, null, 2)
    );
  }

  let derivedBidiClasses: DerivedData;
  try {
    // read cached file
    console.log("reading local derived bidi class data...");
    const data = fs.readFileSync(DERIVED_BIDI_CLASS_FILE).toString();
    derivedBidiClasses = JSON.parse(data);
  } catch (err) {
    console.log("no local derived bidi classes found");
    console.log("fetching derived bidi class data...");
    const derivedBidiClassesData = await fetchText(DERIVED_BIDI_CLASS_URL);
    console.log("parsing derived bidi class data...");
    derivedBidiClasses = parseDerivedData(derivedBidiClassesData);
    // saved to file system
    fs.writeFileSync(
      DERIVED_BIDI_CLASS_FILE,
      JSON.stringify(derivedBidiClasses, null, 2)
    );
  }

  let jamoShortNames: JamoShortNames;
  try {
    // read cached file
    console.log("reading local jamo data...");
    const data = fs.readFileSync(JAMO_FILE).toString();
    jamoShortNames = JSON.parse(data);
  } catch (err) {
    console.log("no local jamo data found");
    console.log("fetching jamo data...");
    const jamoData = await fetchText(JAMO_URL);
    console.log("parsing jamo data...");
    jamoShortNames = parseJamo(jamoData);
    // saved to file system
    fs.writeFileSync(JAMO_FILE, JSON.stringify(jamoShortNames, null, 2));
  }

  console.log("fetching unicode data...");
  const data = await fetchText(UNICODE_DATA_URL);

  console.log("transforming unicode data...");
  const characters: Character[] = parseUnicodeData(data)
    .filter(onlyCharacters)
    // @ts-ignore
    .reduce(expander(jamoShortNames), [])
    .map(updateWithDerivedData(derivedDecompTypes, derivedBidiClasses))
    .map(formatCategory)
    .map(formatEnums);

  console.log("total characters:", characters.length);

  // save to validate
  fs.writeFileSync(UNICODE_FILE, JSON.stringify(characters, null, 2));

  return characters;
};
