import { HEXADECIMAL } from "../utils";
import { Character, Numeric } from "../types";

const DECIMAL_NAN = 255;
const NUMERIC_NAN: Numeric = Object.freeze({ numerator: 0, denominator: 1 });

const parseNumeric = (str: string) => {
  const [numerator, denominator = "1"] = str.split("/");
  return {
    numerator: parseInt(numerator),
    denominator: parseInt(denominator),
  };
};

// Adapted from: https://github.com/chbrown/unidata
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
    // @ts-ignore I need to update the tsconfig
    .flatMap((line: string) => {
      // parse out the raw values
      // the ignored variables are:
      //   [10] => Unicode_1_Name
      //   [11] => isoComment
      const [
        code,
        name,
        // default category
        category = "Cn",
        combining = "0",
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

      // initialize the character with required fields
      const character: Partial<Character> = {
        // code is hexadecimal
        code: parseInt(code, HEXADECIMAL),
        // name is a string
        name,
        // category is a string
        category,
        combining: parseInt(combining, 10),
        bidirectional,
        mirrored: mirrored === "Y",
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
            .map((code: string) => parseInt(code, HEXADECIMAL));

          character.decompositionType =
            decompositionType && decompositionType.toUpperCase();
        }
      }

      // default numbers to NaN
      character.decimal = decimal !== "" ? parseInt(decimal, 10) : DECIMAL_NAN;
      character.digit = digit !== "" ? parseInt(digit, 10) : DECIMAL_NAN;
      character.numeric = numeric !== "" ? parseNumeric(numeric) : NUMERIC_NAN;

      // handle default in contract
      character.uppercase =
        uppercase !== "" ? parseInt(uppercase, HEXADECIMAL) : 0;
      // handle default in contract
      character.lowercase =
        lowercase !== "" ? parseInt(lowercase, HEXADECIMAL) : 0;

      // handle default in contract
      character.titlecase =
        titlecase !== "" ? parseInt(titlecase, HEXADECIMAL) : 0;

      return character as Character;
    });

export default parseUnicodeData;
