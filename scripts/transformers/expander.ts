import { range } from "../utils";
import { Character, JamoShortNames } from "../types";

import { getName } from "./name";

export const expander =
  (jamo: JamoShortNames) =>
  (
    previousValue: Character[],
    currentValue: Character,
    currentIndex: number,
    array: Character[]
  ): Character[] => {
    const { name } = currentValue;
    if (!name.endsWith(", Last>")) {
      return [...previousValue, currentValue];
    }
    const idx = name.indexOf(", Last>");
    // start at 1 to skip starting <
    currentValue.name = name.substring(1, idx);

    const start = array[currentIndex - 1];

    // validate hte name endsWith(", First>")
    if (!start.name.endsWith(", First>")) {
      throw Error(`expected ${start.name} to end with: ', First>'`);
    }

    const codes = [
      ...range(currentValue.code - start.code, start.code),
      currentValue.code,
    ];

    const between = codes.map((code) => {
      // Use JS for decomposition
      const decomposed = String.fromCodePoint(code).normalize("NFD");

      // get code for each decompose character
      // @ts-ignore we know this will defined
      const decomposition: number[] = range(decomposed.length, 0).map((i) =>
        // @ts-ignore we know this will be i < decomposed.length
        decomposed.codePointAt(i)
      );

      return {
        ...currentValue,
        code,
        decomposition,
        // Table 4-8 Name Derivation Rule Prefix Strings
        name: getName(currentValue.name, code, decomposition, jamo),
      };
    });

    // pop last element
    previousValue.pop();
    return [...previousValue, ...between, currentValue];
  };
