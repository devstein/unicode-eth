import { HEXADECIMAL } from "../utils";
import { Character, DerivedData } from "../types";
/*
 Bidi Class (listing UnicodeData.txt, field 4: see UAX #44: https://www.unicode.org/reports/tr44/)
 Unlike other properties, unassigned code points in blocks
 reserved for right-to-left scripts are given either types R or AL.

 The unassigned code points that default to AL are in the ranges:
     [\u0600-\u07BF \u0860-\u08FF \uFB50-\uFDCF \uFDF0-\uFDFF \uFE70-\uFEFF
      \U00010D00-\U00010D3F \U00010F30-\U00010F6F
      \U0001EC70-\U0001ECBF \U0001ED00-\U0001ED4F \U0001EE00-\U0001EEFF]

     This includes code points in the Arabic, Syriac, and Thaana blocks, among others.

 The unassigned code points that default to R are in the ranges:
     [\u0590-\u05FF \u07C0-\u085F \uFB1D-\uFB4F
      \U00010800-\U00010CFF \U00010D40-\U00010F2F \U00010F70-\U00010FFF
      \U0001E800-\U0001EC6F \U0001ECC0-\U0001ECFF \U0001ED50-\U0001EDFF \U0001EF00-\U0001EFFF]

     This includes code points in the Hebrew, NKo, and Phoenician blocks, among others.

 The unassigned code points that default to ET are in the range:
     [\u20A0-\u20CF]

     This consists of code points in the Currency Symbols block.

 The unassigned code points that default to BN have one of the following properties:
     Default_Ignorable_Code_Point
     Noncharacter_Code_Point

 For all other cases:

  All code points not explicitly listed for Bidi_Class
  have the value Left_To_Right (L).

 @missing: 0000..10FFFF; Left_To_Right
*/
const codePointBetweenUnicode = (
  value: number,
  start: string,
  end: string
): boolean => {
  const startCode = parseInt(start, HEXADECIMAL);
  const endCode = parseInt(end, HEXADECIMAL);
  return value >= startCode && value <= endCode;
};

interface Range {
  start: string;
  end: string;
}

const AL_RANGES: Range[] = [
  { start: "0600", end: "07BF" },
  { start: "0860", end: "08FF" },
  { start: "FB50", end: "FDCF" },
  { start: "FDF0", end: "FDFF" },
  { start: "FE70", end: "FEFF" },
  { start: "00010D00", end: "00010D3F" },
  { start: "00010F30", end: "00010F6F" },
  { start: "0001EC70", end: "0001ECBF" },
  { start: "0001ED00", end: "0001ED4F" },
  { start: "0001EE00", end: "0001EEFF" },
];

const R_RANGES: Range[] = [
  { start: "0590", end: "05ff" },
  { start: "07c0", end: "085f" },
  { start: "fb1d", end: "fb4f" },
  { start: "00010800", end: "00010cff" },
  { start: "00010d40", end: "00010f2f" },
  { start: "00010f70", end: "00010fff" },
  { start: "0001e800", end: "0001ec6f" },
  { start: "0001ecc0", end: "0001ecff" },
  { start: "0001ed50", end: "0001edff" },
  { start: "0001ef00", end: "0001efff" },
];
("f0000");

const ET_RANGES: Range[] = [{ start: "20A0", end: "20CF" }];

const getDefaultDerivedBidiClass = (codePoint: number, category: string) => {
  if (
    AL_RANGES.some(({ start, end }) =>
      codePointBetweenUnicode(codePoint, start, end)
    )
  )
    return "AL";

  if (
    R_RANGES.some(({ start, end }) =>
      codePointBetweenUnicode(codePoint, start, end)
    )
  )
    return "R";

  if (
    ET_RANGES.some(({ start, end }) =>
      codePointBetweenUnicode(codePoint, start, end)
    )
  )
    return "ET";

  // unassigned code points will have category "Cn"
  if (category === "Cn") {
    return "BN";
  }

  // everything else defaults to LEFT_TO_RIGHT
  return "L";
};

export const updateWithDerivedData =
  (dTypes: DerivedData, bidiClasses: DerivedData) =>
  (char: Character): Character => {
    // Any missing code point defaults to NONE
    const dType = dTypes[char.code] || "NONE";
    const bidi =
      bidiClasses[char.code] ||
      getDefaultDerivedBidiClass(char.code, char.category);

    return {
      ...char,
      decompositionType: dType,
      bidirectional: bidi,
    };
  };
