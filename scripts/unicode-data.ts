import { ethers } from "hardhat";
import fetch from "node-fetch";

// Adapted from: https://github.com/chbrown/unidata

/**
Character is a raw representation of a character.
*/
export interface Character {
  /** numeric character code (a non-negative integer) */
  code: number;
  /** character name (ASCII only) */
  name: string;
  /** general category */
  category: string;
  /** canonical combining class (missing if == 0 "not reordered") */
  combining?: number;
  /** bidirectional category (missing if == 'L' "Letter") */
  bidirectional?: string;
  /** decomposition type and mapping */
  decompositionType?: string;
  decomposition?: number[];
  /** 
  6= decimal
  7= digit
  8= numeric
  Numeric_Type is extracted as follows. 
    If fields 6, 7, and 8 in UnicodeData.txt are all non-empty, then Numeric_Type=Decimal.
    Otherwise, if fields 7 and 8 are both non-empty, then Numeric_Type=Digit.
    Otherwise, if field 8 is non-empty, then Numeric_Type=Numeric.
    For characters listed in the Unihan data files, Numeric_Type=Numeric for characters that have kPrimaryNumeric, kAccountingNumeric, or kOtherNumeric tags. The default value is Numeric_Type=None.
  */
  decimal?: number;
  digit?: number;
  /** numeric value of character (may be a fraction, so it not unevaluated) */
  numeric?: number;
  /** true if character is mirrored in bidirectional text (missing otherwise) */
  mirrored?: boolean;
  /** simple uppercase mapping */
  uppercase?: number;
  /** simple lowercase mapping */
  lowercase?: number;
  /** simple titlecase mapping */
  titlecase?: number;
}

const UNICODE_DATA_URL = "https://unicode.org/Public/UNIDATA/UnicodeData.txt";
const HEXADECIMAL = 16;

/**
Snippet from `UnicodeData.txt`:
    00A0;NO-BREAK SPACE;Zs;0;CS;<noBreak> 0020;;;;N;NON-BREAKING SPACE;;;;
    00A1;INVERTED EXCLAMATION MARK;Po;0;ON;;;;;N;;;;;
    00A2;CENT SIGN;Sc;0;ET;;;;;N;;;;;
    00A3;POUND SIGN;Sc;0;ET;;;;;N;;;;;
    00A4;CURRENCY SIGN;Sc;0;ET;;;;;N;;;;;
    00A5;YEN SIGN;Sc;0;ET;;;;;N;;;;;
    00A6;BROKEN BAR;So;0;ON;;;;;N;BROKEN VERTICAL BAR;;;;
If there were a header of column names, it might look like this:
    Code;Name;Cat;Comb;BidiC;Decomp;Num1;Num2;Num3;BidiM;Unicode_1_Name;ISO_Comment;Upper;Lower;Title
There are 14 ;'s per line, and so there are 15 fields per UnicodeDatum:
0.  Code
1.  Name
2.  General_Category
3.  Canonical_Combining_Class
4.  Bidi_Class
5.  <Decomposition_Type> Decomposition_Mapping
6.  Numeric Value if decimal
7.  Numeric Value if only digit
8.  Numeric Value otherwise
9.  Bidi_Mirrored
10. Unicode_1_Name
11. ISO_Comment (always empty)
12. Simple_Uppercase_Mapping
13. Simple_Lowercase_Mapping
14. Simple_Titlecase_Mapping
*/
const parseUnicodeData = (data: string): Character[] =>
  data
    .split(/\n/)
    .filter((line) => line !== "")
    .map((line) => {
      // parse out the raw values
      // the ignored variables are:
      //   [6] => numDecimal
      //   [7] => numDigit
      //   [11] => isoComment
      const [
        code,
        name,
        // default category
        category = "Cn",
        combining,
        bidirectional = "L",
        decomposition,
        decimal,
        digit,
        numeric,
        mirrored,
        ,
        ,
        uppercase,
        lowercase,
        titlecase,
      ] = line.split(";");

      const codepoint = parseInt(code, HEXADECIMAL);
      // initialize the character with required fields
      const character: Character = {
        // code is hexadecimal
        code: codepoint,
        // name is a string
        name,
        // category is a string
        category,
        combining: parseInt(combining, 10),
        // TODO: Get defaults from DerivedBidiClass
        bidirectional,
        mirrored: mirrored !== "N",
        decomposition: [codepoint],
      };

      // skip decomposition if it is empty
      if (decomposition !== "") {
        const match = decomposition.match(/^(?:<(\w+)> )?([0-9A-F ]+)$/);

        if (match) {
          const [, decompositionType, mapping] = match;
          // mapping will be a string of hexadecimal character codes,
          // e.g., '0041 0301' for U+00C1 LATIN CAPITAL LETTER A ACUTE
          character.decomposition = mapping
            .split(" ")
            .map((code) => parseInt(code, HEXADECIMAL));

          character.decompositionType = decompositionType;
        }
      }
      // we ignore numDecimal and numDigit (which are always empty if numeric is empty)
      // skip numeric if it is empty
      if (decimal !== "") {
        character.decimal = parseInt(decimal, 10);
      }
      if (digit !== "") {
        character.digit = parseInt(digit, 10);
      }
      if (numeric !== "") {
        character.numeric = eval(numeric);
      }

      character.uppercase =
        uppercase !== "" ? parseInt(uppercase, HEXADECIMAL) : character.code;

      character.lowercase =
        lowercase !== "" ? parseInt(lowercase, HEXADECIMAL) : character.code;

      character.titlecase =
        titlecase !== "" ? parseInt(titlecase, HEXADECIMAL) : character.code;

      return character;
    });

export const getUnicodeData = async (): Promise<Character[]> => {
  const data = await fetch(UNICODE_DATA_URL).then((resp) => resp.text());

  const characters = parseUnicodeData(data);

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
