import { Character } from "../types";

export const bidi = {
  L: 0,
  R: 1,
  AL: 2,
  AN: 3,
  EN: 4,
  ES: 5,
  ET: 6,
  CS: 7,
  NSM: 8,
  BN: 9,
  B: 10,
  S: 11,
  WS: 12,
  ON: 13,
  LRE: 14,
  LRO: 15,
  RLE: 16,
  RLO: 17,
  LRI: 18,
  RLI: 19,
  PDF: 20,
  PDI: 21,
  FSI: 22,
};

export const decomp = {
  NONE: 0,
  CANONICAL: 1,
  COMPAT: 2,
  CIRCLE: 3,
  FINAL: 4,
  FONT: 5,
  FRACTION: 6,
  INITIAL: 7,
  ISOLATED: 8,
  MEDIAL: 9,
  NARROW: 10,
  NOBREAK: 11,
  SMALL: 12,
  SQUARE: 13,
  SUB: 14,
  SUPER: 15,
  VERTICAL: 16,
  WIDE: 17,
};

// formatEnums maps the value to it's contract enum uint8 value
export const formatEnums = ({
  bidirectional,
  decompositionType,
  ...character
}: Character): Character => {
  return {
    ...character,
    // @ts-ignore
    bidirectional: bidi[bidirectional.toUpperCase()],
    // @ts-ignore
    decompositionType: decomp[decompositionType.toUpperCase()],
  };
};
