import { HEXADECIMAL, range } from "../utils";
import { DerivedData } from "../types";

const RANGE_STR = "..";

const parseDerivedData = (text: string): DerivedData =>
  text
    .split(/\n/)
    .filter((line) => line !== "" && !line.startsWith("#"))
    .reduce((acc, line) => {
      // can contain code range in form U+XXXX..U+YYYY
      const [codes, valueWithComment] = line.split(";").map((s) => s.trim());

      // remove trailing comment and trim character name
      // uppercase for enum mapping
      const value = valueWithComment.split("#")[0].trim().toUpperCase();

      const [start, end] = codes.split(RANGE_STR);

      const startCode = parseInt(start, HEXADECIMAL);

      // single unicode character
      if (!end) {
        console.log(startCode);
        return { ...acc, [startCode]: value };
      }

      const endCode = parseInt(end, HEXADECIMAL);

      // performance hack, ignore b/c they will default to L
      // F0000..FFFFD  ; L # Co [65534] <private-use-F0000>..<private-use-FFFFD>
      // 100000..10FFFD; L # Co [65534] <private-use-100000>..<private-use-10FFFD>
      if (
        (start === "F0000" && end === "FFFFD") ||
        (start === "100000" && end === "10FFFD")
      )
        return acc;

      // range
      const codeRange = [...range(endCode - startCode, startCode), endCode];

      const rangeTypes = codeRange.reduce(
        (prev, cur) => ({ ...prev, [cur]: value }),
        {}
      );

      return { ...acc, ...rangeTypes };
    }, {});

export default parseDerivedData;
