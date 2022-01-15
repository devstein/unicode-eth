import { HEXADECIMAL } from "../utils";
import { JamoShortNames } from "../types";

const NR1 = 1;
const NR2 = 2;

// Hangul Syllable Code Range 44032-55203 (inclusive) is NR1
// Everything else is NR2
// Table 4-8 Name Derivation Rule Prefix Strings
const getNameRule = (code: number) =>
  code >= 44032 && code <= 55203 ? NR1 : NR2;

const nameRuleOne = (
  name: string,
  code: number,
  decomposition: number[],
  jamoShortNames: JamoShortNames
) => {
  // get unicode for decomposition code points
  const decompositionCodes = decomposition.map((cp) =>
    cp.toString(HEXADECIMAL).toUpperCase()
  );

  const jamoShortName = decompositionCodes.reduce((acc, cur, idx) => {
    const shortName = jamoShortNames[cur];

    if (shortName === undefined) {
      throw Error(`unexpected decomposition character ${cur} for code ${code}`);
    }

    if (idx === 0) {
      return shortName.toUpperCase();
    }

    return `${acc}${shortName.toLowerCase()}`;
  }, "");

  return `${name} ${jamoShortName}`;
};

const nameRuleTwo = (name: string, code: number) =>
  `${name}-${code.toString(16)}`;

export const getName = (
  name: string,
  codePoint: number,
  decomposition: number[],
  jamo: JamoShortNames
): string => {
  const rule = getNameRule(codePoint);

  return rule === NR1
    ? nameRuleOne(name, codePoint, decomposition, jamo)
    : nameRuleTwo(name, codePoint);
};
