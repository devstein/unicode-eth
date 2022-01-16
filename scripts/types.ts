export interface Numeric {
  numerator: number;
  denominator: number;
}

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
  decimal: number;
  digit: number;
  /** numeric value of character (may be a fraction, so it not unevaluated) */
  numeric: Numeric;
  /** true if character is mirrored in bidirectional text (missing otherwise) */
  mirrored: boolean;
  /** simple uppercase mapping */
  uppercase: number;
  /** simple lowercase mapping */
  lowercase: number;
  /** simple titlecase mapping */
  titlecase: number;
}

export type JamoShortNames = Record<string, string>;

export type DerivedData = Record<number, string>;
