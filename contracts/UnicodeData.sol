//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

// TODO: Move ownership to many contributors

/// @title TODO
/// @author Devin Stein
/// @notice TODO
/// @dev TODO
/// For more information, review https://www.unicode.org/reports/tr44/#UnicodeData.txt
contract UnicodeData is Ownable {
  constructor() {}

  // Unicode Data Version
  uint8 public constant MAJOR_VERSION = 14;
  uint8 public constant MINOR_VERSION = 0;
  uint8 public constant PATCH_VERSION = 0;

  // https://www.unicode.org/reports/tr44/#Bidi_Class_Values
  enum BidiClass {
    LEFT_TO_RIGHT,
    RIGHT_TO_LEFT,
    ARABIC_LETTER,
    ARABIC_NUMBER,
    EUROPEAN_NUMBER,
    EUROPEAN_SEPARATOR,
    EUROPEAN_TERMINATOR,
    COMMON_SEPARATOR,
    NONSPACING_MARK,
    BOUNDARY_NEUTRAL,
    PARAGRAPH_SEPARATOR,
    SEGMENT_SEPARATOR,
    WHITE_SPACE,
    OTHER_NEUTRAL,
    LEFT_TO_RIGHT_EMBEDDING,
    LEFT_TO_RIGHT_OVERRIDE,
    RIGHT_TO_LEFT_EMBEDDING,
    RIGHT_TO_LEFT_OVERRIDE,
    LEFT_TO_RIGHT_ISOLATE,
    RIGHT_TO_LEFT_ISOLATE,
    POP_DIRECTIONAL_FORMAT,
    POP_DIRECTIONAL_ISOLATE,
    FIRST_STRONG_ISOLATE
  }

  // https://www.unicode.org/reports/tr44/#Decomposition_Type
  enum DecompositionType {
    NONE, /*[none]*/
    CANONICAL, /*[can]*/
    COMPAT, /*[com]*/
    CIRCLE, /*[enc]*/
    FINAL, /*[fin]*/
    FONT, /*[font]*/
    FRACTION, /*[fra]*/
    INITIAL, /*[init]*/
    ISOLATED, /*[iso]*/
    MEDIAL, /*[med]*/
    NARROW, /*[nar]*/
    NO_BREAK, /*[nb]*/
    SMALL, /*[sml]*/
    SQUARE, /*[sqr]*/
    SUB, /*[sub]*/
    SUPER, /*[sup]*/
    VERTICAL, /*[vert]*/
    WIDE /*[wide]*/
  }

  // DecimalDigitNaN is the 'NaN' value for the decimal and digit properties
  uint8 public constant DecimalDigitNaN = type(uint8).max;

  function isNaN(uint8 _number) public pure returns (bool) {
    // hardcode 1 and 0 to keep function pure (instead of view)
    return _number == DecimalDigitNaN;
  }

  /// @dev: RationalNumber is a naive representation of a rational number.
  /// It is meant to store information for the numeric value of unicode characters.
  /// int128 is sufficient for current and likely future unicode characters.
  /// signed ints are required for TIBETAN DIGIT HALF ZERO (0F33), which is negative
  /// It is not meant to provide utilities for rational number math.
  /// For downstream computation, use other libraries like
  /// https://github.com/hifi-finance/prb-math/
  /// https://github.com/abdk-consulting/abdk-libraries-solidity
  struct RationalNumber {
    int128 numerator;
    int64 denominator;
  }

  // RationalNumberNaN is the 'NaN' value for the numeric property
  RationalNumber public RationalNumberNaN = RationalNumber(1, 0);

  function isNaN(RationalNumber memory _number) public pure returns (bool) {
    // hardcode 1 and 0 to keep function pure (instead of view)
    return _number.numerator == 1 && _number.denominator == 0;
  }

  // Order of Properties Matter: https://docs.soliditylang.org/en/v0.8.10/internals/layout_in_storage.html
  // name = 32 bytes
  // decompisitonMapping = 32 bytes
  // numeric = 32 bytes
  // category + combining + bidirectional + decompisitonType + decimal + digit + mirrored + lowercase + uppercase + titlecase = 20 bytes
  // 2 + 1 + 1 + 1 + 1 + 1 + 1  + 4 + 4 + 4 = 20 bytes
  struct Character {
    /// (1) When a string value not enclosed in &lt;angle brackets> occurs in this field,
    /// it specifies the character's Name property value,
    /// which matches exactly the name published in the code charts.
    /// The Name property value for most ideographic characters and for Hangul syllables
    /// is derived instead by various rules.
    /// See *Section 4.8, Name* in *[Unicode]* for a full specification of those rules.
    /// Strings enclosed in &lt;angle brackets> in this field either provide
    /// label information used in the name derivation rules,
    /// or—in the case of characters which have a null string as their Name property value,
    /// such as control characters—provide other information about their code point type.
    ///
    /// [Unicode]: http://unicode.org/reports/tr41/tr41-21.html#Unicode
    string name;
    /// (5) This is one half of the field containing both the values
    /// [`Decomposition_Type` and `Decomposition_Mapping`], with the type in angle brackets.
    /// The decomposition mappings exactly match the decomposition mappings
    /// published with the character names in the Unicode Standard.
    /// For more information, see [Character Decomposition Mappings][Decomposition Mappings].
    ///
    /// [Decomposition Mappings]: http://unicode.org/reports/tr44/#Character_Decomposition_Mappings
    // The default value of the Decomposition_Mapping property is the code point of the character itself
    uint32[] decompisitonMapping;
    /// (8) If the character has the property value `Numeric_Type=Numeric`,
    /// then the `Numeric_Value` of that character is represented with a positive or negative
    /// integer or rational number in this field, and fields 6 and 7 are null.
    /// This includes fractions such as, for example, "1/5" for U+2155 VULGAR FRACTION ONE FIFTH.
    ///
    /// Some characters have these properties based on values from the Unihan data files.
    /// See [`Numeric_Type`, Han].
    ///
    /// [`Numeric_Type`, Han]: http://unicode.org/reports/tr44/#Numeric_Type_Han
    RationalNumber numeric;
    /// (2) This is a useful breakdown into various character types which
    /// can be used as a default categorization in implementations.
    /// For the property values, see [General_Category Values].
    ///
    /// [General_Category Values]: http://unicode.org/reports/tr44/#General_Category_Values
    bytes2 category;
    /// (3) The classes used for the Canonical Ordering Algorithm in the Unicode Standard.
    /// This property could be considered either an enumerated property or a numeric property:
    /// the principal use of the property is in terms of the numeric values.
    /// For the property value names associated with different numeric values,
    /// see [DerivedCombiningClass.txt] and [Canonical_Combining_Class Values][CCC Values].
    ///
    /// [DerivedCombiningClass.txt]: http://unicode.org/reports/tr44/#DerivedCombiningClass.txt
    /// [CCC Values]: http://unicode.org/reports/tr44/#Canonical_Combining_Class_Values
    uint8 combining;
    /// (4) These are the categories required by the Unicode Bidirectional Algorithm.
    /// For the property values, see [Bidirectional Class Values].
    /// For more information, see Unicode Standard Annex #9,
    /// "Unicode Bidirectional Algorithm" *[UAX9]*.
    ///
    /// The default property values depend on the code point,
    /// and are explained in DerivedBidiClass.txt
    ///
    /// [Bidirectional Class Values]: http://unicode.org/reports/tr44/#Bidi_Class_Values
    /// [UAX9]: http://unicode.org/reports/tr41/tr41-21.html#UAX9
    BidiClass bidirectional;
    /// (5) This is one half of the field containing both the values
    /// [`Decomposition_Type` and `Decomposition_Mapping`], with the type in angle brackets.
    /// The decomposition mappings exactly match the decomposition mappings
    /// published with the character names in the Unicode Standard.
    /// For more information, see [Character Decomposition Mappings][Decomposition Mappings].
    ///
    /// [Decomposition Mappings]: http://unicode.org/reports/tr44/#Character_Decomposition_Mappings
    DecompositionType decompisitonType;
    /// (6) If the character has the property value `Numeric_Type=Decimal`,
    /// then the `Numeric_Value` of that digit is represented with an integer value
    /// (limited to the range 0..9) in fields 6, 7, and 8.
    /// Characters with the property value `Numeric_Type=Decimal` are restricted to digits
    /// which can be used in a decimal radix positional numeral system and
    /// which are encoded in the standard in a contiguous ascending range 0..9.
    /// See the discussion of *decimal digits* in *Chapter 4, Character Properties* in *[Unicode]*.
    ///
    /// [Unicode]: http://unicode.org/reports/tr41/tr41-21.html#Unicode
    uint8 decimal;
    /// (7) If the character has the property value `Numeric_Type=Digit`,
    /// then the `Numeric_Value` of that digit is represented with an integer value
    /// (limited to the range 0..9) in fields 7 and 8, and field 6 is null.
    /// This covers digits that need special handling, such as the compatibility superscript digits.
    ///
    /// Starting with Unicode 6.3.0,
    /// no newly encoded numeric characters will be given `Numeric_Type=Digit`,
    /// nor will existing characters with `Numeric_Type=Numeric` be changed to `Numeric_Type=Digit`.
    /// The distinction between those two types is not considered useful.
    uint8 digit;
    /// (9) If the character is a "mirrored" character in bidirectional text,
    /// this field has the value "Y" [true]; otherwise "N" [false].
    /// See *Section 4.7, Bidi Mirrored* of *[Unicode]*.
    /// *Do not confuse this with the [`Bidi_Mirroring_Glyph`] property*.
    ///
    /// [Unicode]: http://unicode.org/reports/tr41/tr41-21.html#Unicode
    /// [`Bidi_Mirroring_Glyph`]: http://unicode.org/reports/tr44/#Bidi_Mirroring_Glyph
    bool mirrored;
    /// (12) Simple uppercase mapping (single character result).
    /// If a character is part of an alphabet with case distinctions,
    /// and has a simple uppercase equivalent, then the uppercase equivalent is in this field.
    /// The simple mappings have a single character result,
    /// where the full mappings may have multi-character results.
    /// For more information, see [Case and Case Mapping].
    ///
    /// [Case and Case Mapping]: http://unicode.org/reports/tr44/#Casemapping
    uint32 uppercase;
    /// (13) Simple lowercase mapping (single character result).
    uint32 lowercase;
    /// (14) Simple titlecase mapping (single character result).
    uint32 titlecase;
  }

  // Private mapping for characters
  mapping(bytes4 => Character) private characters;

  uint8 constant MAX_BYTES = 4;
  uint8 constant DEFAULT_NUMBER = type(uint8).max;

  function getCharKey(string calldata _char) private pure returns (bytes4) {
    bytes memory output = bytes(_char);
    // get length before padding output, which modifies length
    uint8 len = uint8(output.length);
    for (uint8 i = 0; i < 4 - len; i++) {
      output = bytes.concat(bytes1(0x00), output);
    }
    return bytes4(output);
  }

  // simple check if a string could be a valid character
  function canBeCharacter(string calldata _char) private pure {
    require(
      bytes(_char).length <= MAX_BYTES,
      "a character must be less than or equal to four bytes"
    );
  }

  function _exists(string memory _name) private pure returns (bool) {
    return bytes(_name).length > 0;
  }

  function mustExist(Character memory _char) private pure {
    require(_exists(_char.name), "character does not exist");
  }

  // isValid returns true if the character exists
  function isValid(string calldata _char) external view returns (bool) {
    if (bytes(_char).length > MAX_BYTES) return false;
    bytes4 key = getCharKey(_char);
    Character memory char = characters[key];
    return _exists(char.name);
  }

  function get(string calldata _char) private view returns (Character memory) {
    canBeCharacter(_char);
    bytes4 key = getCharKey(_char);
    Character memory char = characters[key];
    // Require the character exists
    mustExist(char);
    return char;
  }

  function set(string calldata _char, Character calldata data)
    external
    onlyOwner
  {
    canBeCharacter(_char);
    bytes4 key = getCharKey(_char);
    // Require name to be non-empty!
    require(bytes(data.name).length > 0, "character name must not be empty");
    characters[key] = data;
  }

  // Getters
  function name(string calldata _char) external view returns (string memory) {
    return get(_char).name;
  }

  function category(string calldata _char) external view returns (bytes2) {
    return get(_char).category;
  }

  function combining(string calldata _char) external view returns (uint8) {
    return get(_char).combining;
  }

  function bidirectional(string calldata _char)
    external
    view
    returns (BidiClass)
  {
    return get(_char).bidirectional;
  }

  function decompisitonType(string calldata _char)
    external
    view
    returns (DecompositionType)
  {
    return get(_char).decompisitonType;
  }

  function decompisitonMapping(string calldata _char)
    external
    view
    returns (uint32[] memory)
  {
    return get(_char).decompisitonMapping;
  }

  function decimal(string calldata _char) external view returns (uint8) {
    Character memory char = get(_char);
    require(
      !isNaN(char.decimal),
      "character does not have a decimal representation"
    );
    return char.decimal;
  }

  function digit(string calldata _char) external view returns (uint8) {
    Character memory char = get(_char);
    require(
      !isNaN(char.digit),
      "character does not have a digit representation"
    );
    return char.digit;
  }

  function numeric(string calldata _char)
    external
    view
    returns (RationalNumber memory)
  {
    Character memory char = get(_char);
    require(
      !isNaN(char.numeric),
      "character does not have a numeric representation"
    );
    return char.numeric;
  }

  function mirrored(string calldata _char) external view returns (bool) {
    return get(_char).mirrored;
  }

  // TODO: OPTIMIZE pack bytes!
  function codePointToChar(uint32 _input) public pure returns (string memory) {
    bytes4 b = bytes4(_input);

    bytes memory output = new bytes(4);

    for (uint8 i = 0; i < 4; i++) {
      output[i] = b[i];
    }

    return string(output);
  }

  function uppercase(string calldata _char)
    external
    view
    returns (string memory)
  {
    uint32 codePoint = get(_char).uppercase;

    // default to 0
    if (codePoint == 0) return _char;

    return codePointToChar(codePoint);
  }

  function lowercase(string calldata _char)
    external
    view
    returns (string memory)
  {
    uint32 codePoint = get(_char).lowercase;

    // default to 0
    if (codePoint == 0) return _char;

    return codePointToChar(codePoint);
  }

  function titlecase(string calldata _char)
    external
    view
    returns (string memory)
  {
    uint32 codePoint = get(_char).titlecase;

    // default to 0
    if (codePoint == 0) return _char;

    return codePointToChar(codePoint);
  }

  // Derived Properties

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

  enum NumericType {
    NONE,
    DECIMAL,
    DIGIT,
    NUMERIC
  }

  // numericType is not implemented because it relies on the Unicode Han Database (Unihan).
  // https://www.unicode.org/Public/UNIDATA/extracted/DerivedNumericValues.txt
  function numericType(string calldata _char)
    external
    view
    returns (NumericType)
  {
    Character memory char = get(_char);

    bool hasDecimal = !isNaN(char.decimal);
    bool hasDigit = !isNaN(char.digit);
    bool hasNumeric = !isNaN(char.numeric);

    if (hasDecimal && hasDigit && hasNumeric) return NumericType.DECIMAL;
    if (hasDigit && hasNumeric) return NumericType.DIGIT;
    if (hasNumeric) return NumericType.NUMERIC;

    return NumericType.NONE;
  }

  // numericValue is not implemented because it relies on the Unicode Han Database (Unihan).
  // https://www.unicode.org/Public/UNIDATA/extracted/DerivedNumericValues.txt
  function numericValue(string calldata _char)
    external
    view
    returns (RationalNumber memory)
  {
    Character memory char = get(_char);
    require(!isNaN(char.numeric), "character does not have a numeric value");
    return char.numeric;
  }

  function isLowercase(string calldata _char) public view returns (bool) {
    Character memory char = get(_char);
    return char.category == "Ll";
  }

  function isUppercase(string calldata _char) public view returns (bool) {
    Character memory char = get(_char);
    return char.category == "Lu";
  }

  function isTitlecase(string calldata _char) public view returns (bool) {
    Character memory char = get(_char);
    return char.category == "Lt";
  }

  function isCased(string calldata _char) public view returns (bool) {
    return isLowercase(_char) || isUppercase(_char) || isTitlecase(_char);
  }

  function isLetter(string calldata _char) public view returns (bool) {
    Character memory char = get(_char);
    return char.category[0] == "L";
  }

  function isAlphabetic(string calldata _char) external view returns (bool) {
    Character memory char = get(_char);
    return isLetter(_char) || char.category == "Nl";
  }

  function isNumber(string calldata _char) public view returns (bool) {
    Character memory char = get(_char);
    return char.category[0] == "N";
  }

  function isAlphanumeric(string calldata _char) external view returns (bool) {
    return isLetter(_char) || isNumber(_char);
  }

  function isMath(string calldata _char) external view returns (bool) {
    Character memory char = get(_char);
    return char.category == "Sm";
  }

  function isSymbol(string calldata _char) external view returns (bool) {
    Character memory char = get(_char);
    return char.category[0] == "S";
  }

  function isMark(string calldata _char) external view returns (bool) {
    Character memory char = get(_char);
    return char.category[0] == "M";
  }

  function isPunctuation(string calldata _char) external view returns (bool) {
    Character memory char = get(_char);
    return char.category[0] == "P";
  }

  function isSeparator(string calldata _char) external view returns (bool) {
    Character memory char = get(_char);
    return char.category[0] == "Z";
  }

  function isOther(string calldata _char) external view returns (bool) {
    Character memory char = get(_char);
    return char.category[0] == "C";
  }

  // blocks
  // isEmoji
  // East_Asian_Width
  // Joining Group
  // Joining Type

  // toLowercase
  // toTitlecase
  // toTitlecase
}
