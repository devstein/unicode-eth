//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

import "./Unicode.sol";
import "./UTF8Encoder.sol";

/// @title An API for the Unicode Character Database
/// @author Devin Stein
/// @notice The Unicode Character Database available on Ethereum and to Ethereum developers
/// @dev This project is only possible because of many previous Unicode data implementations. A few to highlight are
/// https://unicode-org.github.io/icu-docs/apidoc/dev/icu4c/index.html
/// https://github.com/open-i18n/rust-unic
/// For more information, review https://www.unicode.org/reports/tr44
contract UnicodeData is Ownable {
  using Unicode for string;
  using UTF8Encoder for uint32;

  // Unicode Data Version
  uint8 public constant MAJOR_VERSION = 14;
  uint8 public constant MINOR_VERSION = 0;
  uint8 public constant PATCH_VERSION = 0;

  /// @dev https://www.unicode.org/reports/tr44/#Bidi_Class_Values
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

  /// @dev https://www.unicode.org/reports/tr44/#Decomposition_Type
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

  /// @dev DECIMAL_DIGIT_NAN is the 'NaN' value for the decimal and digit properties
  uint8 public constant DECIMAL_DIGIT_NAN = type(uint8).max;

  function isNaN(uint8 _number) internal pure returns (bool) {
    // hardcode 1 and 0 to keep function pure (instead of view)
    return _number == DECIMAL_DIGIT_NAN;
  }

  /// @dev: RationalNumber is a naive representation of a rational number.
  /// It is meant to store information for the numeric value of unicode characters.
  /// int128 is sufficient for current and likely future unicode characters.
  /// signed ints are required for TIBETAN DIGIT HALF ZERO (0F33), which is negative.
  /// It is not meant to provide utilities for rational number math.
  /// For downstream computation, use other libraries like
  /// https://github.com/hifi-finance/prb-math/
  /// https://github.com/abdk-consulting/abdk-libraries-solidity
  struct RationalNumber {
    int128 numerator;
    int128 denominator;
  }

  /// @dev RATIONAL_NUMBER_NAN is the 'NaN' value for the numeric property
  RationalNumber public RATIONAL_NUMBER_NAN = RationalNumber(1, 0);

  function isNaN(RationalNumber memory _number) internal pure returns (bool) {
    // hardcode 1 and 0 to keep function pure (instead of view)
    return _number.numerator == 1 && _number.denominator == 0;
  }

  /// @dev Character represents the Unicode database character properties:
  /// https://unicode.org/Public/UNIDATA/UnicodeData.txt
  // Order of Properties Matter: https://docs.soliditylang.org/en/v0.8.10/internals/layout_in_storage.html
  // name = 32 bytes
  // numeric = 32 bytes
  // decompositionMapping = 32 bytes
  // category + combining + bidirectional + decompositionType + decimal + digit + mirrored + lowercase + uppercase + titlecase = 20 bytes
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
    /// (5) This is one half of the field containing both the values
    /// [`Decomposition_Type` and `Decomposition_Mapping`], with the type in angle brackets.
    /// The decomposition mappings exactly match the decomposition mappings
    /// published with the character names in the Unicode Standard.
    /// For more information, see [Character Decomposition Mappings][Decomposition Mappings].
    ///
    /// [Decomposition Mappings]: http://unicode.org/reports/tr44/#Character_Decomposition_Mappings
    // The default value of the Decomposition_Mapping property is the code point of the character itself
    uint32[] decompositionMapping;
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
    DecompositionType decompositionType;
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

  // Mapping from Unicode code point to character properties
  mapping(uint32 => Character) public characters;

  uint8 public constant MAX_BYTES = 4;

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

  /// @notice Check if `_char` exists in the Unicode database
  /// @dev All getters will error if a character doesn't exist.
  /// exists allows you check before getting.
  /// @param _char The character to check
  /// @return True if character `_char` is valid and exists
  function exists(string calldata _char) external view returns (bool) {
    if (bytes(_char).length > MAX_BYTES) return false;
    Character memory char = characters[_char.toCodePoint()];
    return _exists(char.name);
  }

  /// @dev Internal getter for characters and standard validation. It errors if the character doesn't exist.
  function get(string calldata _char) private view returns (Character memory) {
    canBeCharacter(_char);
    Character memory char = characters[_char.toCodePoint()];
    // Require the character exists
    mustExist(char);
    return char;
  }

  /// @notice This is only used by the owner to initialize and update Unicode character database
  /// @param _codePoint The Unicode code point to set
  /// @param _data The character data
  function set(uint32 _codePoint, Character calldata _data) external onlyOwner {
    // Require name to be non-empty!
    require(bytes(_data.name).length > 0, "character name must not be empty");
    characters[_codePoint] = _data;
  }

  /// @notice This is only used by the owner to initialize and update Unicode character database
  /// @param _codePoints The Unicode code points to set
  /// @param _data The list of character data to set
  /// @dev Order matters! Order of _data must match the order of _codePoints
  function setBatch(uint32[] calldata _codePoints, Character[] calldata _data)
    external
    onlyOwner
  {
    uint256 len = _codePoints.length;
    uint256 i;

    for (i = 0; i < len; i++) {
      uint32 codePoint = _codePoints[i];
      // Require name to be non-empty!
      require(
        bytes(_data[i].name).length > 0,
        "character name must not be empty"
      );
      characters[codePoint] = _data[i];
    }
  }

  // -------
  // Getters
  // -------

  /// @notice Get the Unicode name of `_char`
  /// @dev All Unicode characters will have a non-empty name
  /// @param _char The character to get
  /// @return The Unicode name of `_char`
  function name(string calldata _char) external view returns (string memory) {
    return get(_char).name;
  }

  /// @notice Get the Unicode general category of `_char`
  /// @dev See https://www.unicode.org/reports/tr44/#General_Category_Values for possible values
  /// @param _char The character to get
  /// @return The Unicode general category of `_char`
  function category(string calldata _char) external view returns (bytes2) {
    return get(_char).category;
  }

  /// @notice Get the Unicode combining class of `_char`
  /// @dev See https://www.unicode.org/reports/tr44/#Canonical_Combining_Class_Values for possible values
  /// @param _char The character to get
  /// @return The Unicode combining class of `_char`
  function combining(string calldata _char) external view returns (uint8) {
    return get(_char).combining;
  }

  /// @notice Get the Unicode bidirectional (bidi) class of `_char`
  /// @dev See https://www.unicode.org/reports/tr44/#Bidi_Class_Values for possible values
  /// @param _char The character to get
  /// @return The Unicode bidirectional (bidi) class of `_char`
  function bidirectional(string calldata _char)
    external
    view
    returns (BidiClass)
  {
    return get(_char).bidirectional;
  }

  /// @notice Get the Unicode decomposition type of `_char`
  /// @dev See https://www.unicode.org/reports/tr44/#Decomposition_Type for possible values.
  /// This can be used to implement the Unicode decomposition algorithm
  /// @param _char The character to get
  /// @return The Unicode decomposition type of `_char`
  function decompositionType(string calldata _char)
    external
    view
    returns (DecompositionType)
  {
    return get(_char).decompositionType;
  }

  /// @notice Get the Unicode decomposition mapping of `_char`
  /// @dev This can be used to implement the Unicode decomposition algorithm.
  /// @param _char The character to get
  /// @return The Unicode decomposition mapping as an array of code points of `_char`
  function decompositionMapping(string calldata _char)
    external
    view
    returns (uint32[] memory)
  {
    return get(_char).decompositionMapping;
  }

  /// @notice Get the Unicode decimal property of `_char`
  /// @dev This raises an error for characters without a decimal property. Values can only be within 0-9.
  /// @param _char The character to get
  /// @return The decimal value of `_char`
  function decimal(string calldata _char) external view returns (uint8) {
    Character memory char = get(_char);
    require(
      !isNaN(char.decimal),
      "character does not have a decimal representation"
    );
    return char.decimal;
  }

  /// @notice Get the Unicode digit property of `_char`
  /// @dev This raises an error for characters without a digit property. Values can only be within 0-9.
  /// @param _char The character to get
  /// @return The digit value of `_char`
  function digit(string calldata _char) external view returns (uint8) {
    Character memory char = get(_char);
    require(
      !isNaN(char.digit),
      "character does not have a digit representation"
    );
    return char.digit;
  }

  /// @notice Get the Unicode numeric property of `_char`
  /// @dev This raises an error for characters without a numeric property.
  /// @param _char The character to get
  /// @return The RationalNumber struct for the numeric property of `_char`
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

  /// @notice  If `_char` is a "mirrored" character in bidirectional text
  /// @dev Do not confuse this with the Bidi_Mirroring_Glyph property
  /// @param _char The character to get
  /// @return True if `_char` is a "mirrored" character in bidirectional text
  function mirrored(string calldata _char) external view returns (bool) {
    return get(_char).mirrored;
  }

  /// @notice Get the simple uppercase value for a character if it exists
  /// @dev This does not handle Special Casing. Contributions to fix this are welcome!
  /// @param _char the character to uppercase
  /// @return The corresponding uppercase character
  function uppercase(string calldata _char)
    public
    view
    returns (string memory)
  {
    uint32 codePoint = get(_char).uppercase;

    // default to same character
    if (codePoint == 0) return _char;

    return codePoint.UTF8Encode();
  }

  /// @notice Get the simple lowercase value for a character if it exists
  /// @dev This does not handle Special Casing. Contributions to fix this are welcome!
  /// @param _char the character to lowercase
  /// @return The corresponding lowercase character
  function lowercase(string calldata _char)
    external
    view
    returns (string memory)
  {
    uint32 codePoint = get(_char).lowercase;

    // default to the same character
    if (codePoint == 0) return _char;

    return codePoint.UTF8Encode();
  }

  /// @notice Get the simple titlecase value for a character if it exists
  /// @dev This does not handle Special Casing. Contributions to fix this are welcome!
  /// @param _char the character to titlecase
  /// @return The corresponding titlecase character
  function titlecase(string calldata _char)
    external
    view
    returns (string memory)
  {
    uint32 codePoint = get(_char).titlecase;

    // default to uppercase
    if (codePoint == 0) return uppercase(_char);

    return codePoint.UTF8Encode();
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

  /// @notice Get the numeric type for `_char`
  /// @dev This does not handle derived numeric types from the Unicode Han Database. Contributions to fix this are welcome!
  /// https://www.unicode.org/Public/UNIDATA/extracted/DerivedNumericType.txt
  /// @param _char the character to get
  /// @return The numeric type for the character
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

  /// @notice Get the numeric value for `_char`
  /// @dev This does not handle derived numeric types from the Unicode Han Database and is currently identical to the numeric property. Contributions to fix this are welcome!
  /// https://www.unicode.org/Public/UNIDATA/extracted/DerivedNumericValues.txt
  /// @param _char the character to get
  /// @return The numeric value for the character
  function numericValue(string calldata _char)
    external
    view
    returns (RationalNumber memory)
  {
    Character memory char = get(_char);
    require(!isNaN(char.numeric), "character does not have a numeric value");
    return char.numeric;
  }

  /// @notice Check if `_char` is lowercase
  /// @dev This is only for a single Unicode character not entire strings
  /// @param _char the character to get
  /// @return True if the character is lowercase
  function isLowercase(string calldata _char) public view returns (bool) {
    Character memory char = get(_char);
    return char.category == "Ll";
  }

  /// @notice Check if `_char` is uppercase
  /// @dev This is only for a single Unicode character not entire strings
  /// @param _char the character to get
  /// @return True if the character is uppercase
  function isUppercase(string calldata _char) public view returns (bool) {
    Character memory char = get(_char);
    return char.category == "Lu";
  }

  /// @notice Check if `_char` is titlecase
  /// @dev This is only for a single Unicode character not entire strings
  /// @param _char the character to get
  /// @return True if the character is titlecase
  function isTitlecase(string calldata _char) public view returns (bool) {
    Character memory char = get(_char);
    return char.category == "Lt";
  }

  /// @notice Check if `_char` is cased
  /// @dev This is only for a single Unicode character not entire strings
  /// @param _char the character to get
  /// @return True if the character is cased
  function isCased(string calldata _char) public view returns (bool) {
    return isLowercase(_char) || isUppercase(_char) || isTitlecase(_char);
  }

  /// @notice Check if `_char` is a letter
  /// @dev This is only for a single Unicode character not entire strings
  /// @param _char the character to get
  /// @return True if the character is a letter
  function isLetter(string calldata _char) public view returns (bool) {
    Character memory char = get(_char);
    return char.category[0] == "L";
  }

  /// @notice Check if `_char` is a alphabetic
  /// @dev This is only for a single Unicode character not entire strings
  /// @param _char the character to get
  /// @return True if the character is a alphabetic
  function isAlphabetic(string calldata _char) external view returns (bool) {
    Character memory char = get(_char);
    return isLetter(_char) || char.category == "Nl";
  }

  /// @notice Check if `_char` is a number
  /// @dev This is only for a single Unicode character not entire strings
  /// @param _char the character to get
  /// @return True if the character is a number
  function isNumber(string calldata _char) public view returns (bool) {
    Character memory char = get(_char);
    return char.category[0] == "N";
  }

  /// @notice Check if `_char` is a alphanumeric
  /// @dev This is only for a single Unicode character not entire strings
  /// @param _char the character to get
  /// @return True if the character is a alphanumeric
  function isAlphanumeric(string calldata _char) external view returns (bool) {
    return isLetter(_char) || isNumber(_char);
  }

  /// @notice Check if `_char` is a mathematic symbol
  /// @dev This is only for a single Unicode character not entire strings
  /// @param _char the character to get
  /// @return True if the character is a mathematic symbol
  function isMath(string calldata _char) external view returns (bool) {
    Character memory char = get(_char);
    return char.category == "Sm";
  }

  /// @notice Check if `_char` is a symbol
  /// @dev This is only for a single Unicode character not entire strings
  /// @param _char the character to get
  /// @return True if the character is a symbol
  function isSymbol(string calldata _char) external view returns (bool) {
    Character memory char = get(_char);
    return char.category[0] == "S";
  }

  /// @notice Check if `_char` is a mark
  /// @dev This is only for a single Unicode character not entire strings
  /// @param _char the character to get
  /// @return True if the character is a mark
  function isMark(string calldata _char) external view returns (bool) {
    Character memory char = get(_char);
    return char.category[0] == "M";
  }

  /// @notice Check if `_char` is punctuation
  /// @dev This is only for a single Unicode character not entire strings
  /// @param _char the character to get
  /// @return True if the character is punctuation
  function isPunctuation(string calldata _char) external view returns (bool) {
    Character memory char = get(_char);
    return char.category[0] == "P";
  }

  /// @notice Check if `_char` is a separator (whitespace)
  /// @dev This is only for a single Unicode character not entire strings
  /// @param _char the character to get
  /// @return True if the character is a separator (whitespace)
  function isSeparator(string calldata _char) external view returns (bool) {
    Character memory char = get(_char);
    return char.category[0] == "Z";
  }

  /// @notice Check if `_char` is in the 'Other' category
  /// @dev This is only for a single Unicode character not entire strings
  /// @param _char the character to get
  /// @return True if the character is in the 'Other' category
  function isOther(string calldata _char) external view returns (bool) {
    Character memory char = get(_char);
    return char.category[0] == "C";
  }
}
