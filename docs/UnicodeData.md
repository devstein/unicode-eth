# UnicodeData

*Devin Stein*

> An API for the Unicode Character Database

The Unicode Character Database available on Ethereum and to Ethereum developers

*This project is only possible because of many previous Unicode data implementations. A few to highlight are https://unicode-org.github.io/icu-docs/apidoc/dev/icu4c/index.html https://github.com/open-i18n/rust-unic For more information, review https://www.unicode.org/reports/tr44*

## Methods

### DECIMAL_DIGIT_NAN

```solidity
function DECIMAL_DIGIT_NAN() external view returns (uint8)
```



*DECIMAL_DIGIT_NAN is the &#39;NaN&#39; value for the decimal and digit properties*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint8 | undefined

### MAJOR_VERSION

```solidity
function MAJOR_VERSION() external view returns (uint8)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint8 | undefined

### MAX_BYTES

```solidity
function MAX_BYTES() external view returns (uint8)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint8 | undefined

### MINOR_VERSION

```solidity
function MINOR_VERSION() external view returns (uint8)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint8 | undefined

### PATCH_VERSION

```solidity
function PATCH_VERSION() external view returns (uint8)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint8 | undefined

### RATIONAL_NUMBER_NAN

```solidity
function RATIONAL_NUMBER_NAN() external view returns (int128 numerator, int128 denominator)
```



*RATIONAL_NUMBER_NAN is the &#39;NaN&#39; value for the numeric property*


#### Returns

| Name | Type | Description |
|---|---|---|
| numerator | int128 | undefined
| denominator | int128 | undefined

### bidirectional

```solidity
function bidirectional(string _char) external view returns (enum UnicodeData.BidiClass)
```

Get the Unicode bidirectional (bidi) class of `_char`

*See https://www.unicode.org/reports/tr44/#Bidi_Class_Values for possible values*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _char | string | The character to get

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | enum UnicodeData.BidiClass | The Unicode bidirectional (bidi) class of `_char`

### category

```solidity
function category(string _char) external view returns (bytes2)
```

Get the Unicode general category of `_char`

*See https://www.unicode.org/reports/tr44/#General_Category_Values for possible values*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _char | string | The character to get

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bytes2 | The Unicode general category of `_char`

### characters

```solidity
function characters(uint32) external view returns (string name, struct UnicodeData.RationalNumber numeric, bytes2 category, uint8 combining, enum UnicodeData.BidiClass bidirectional, enum UnicodeData.DecompositionType decompositionType, uint8 decimal, uint8 digit, bool mirrored, uint32 uppercase, uint32 lowercase, uint32 titlecase)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | uint32 | undefined

#### Returns

| Name | Type | Description |
|---|---|---|
| name | string | undefined
| numeric | UnicodeData.RationalNumber | undefined
| category | bytes2 | undefined
| combining | uint8 | undefined
| bidirectional | enum UnicodeData.BidiClass | undefined
| decompositionType | enum UnicodeData.DecompositionType | undefined
| decimal | uint8 | undefined
| digit | uint8 | undefined
| mirrored | bool | undefined
| uppercase | uint32 | undefined
| lowercase | uint32 | undefined
| titlecase | uint32 | undefined

### combining

```solidity
function combining(string _char) external view returns (uint8)
```

Get the Unicode combining class of `_char`

*See https://www.unicode.org/reports/tr44/#Canonical_Combining_Class_Values for possible values*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _char | string | The character to get

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint8 | The Unicode combining class of `_char`

### decimal

```solidity
function decimal(string _char) external view returns (uint8)
```

Get the Unicode decimal property of `_char`

*This raises an error for characters without a decimal property. Values can only be within 0-9.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _char | string | The character to get

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint8 | The decimal value of `_char`

### decompositionMapping

```solidity
function decompositionMapping(string _char) external view returns (uint32[])
```

Get the Unicode decomposition mapping of `_char`

*This can be used to implement the Unicode decomposition algorithm.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _char | string | The character to get

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint32[] | The Unicode decomposition mapping as an array of code points of `_char`

### decompositionType

```solidity
function decompositionType(string _char) external view returns (enum UnicodeData.DecompositionType)
```

Get the Unicode decomposition type of `_char`

*See https://www.unicode.org/reports/tr44/#Decomposition_Type for possible values. This can be used to implement the Unicode decomposition algorithm*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _char | string | The character to get

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | enum UnicodeData.DecompositionType | The Unicode decomposition type of `_char`

### digit

```solidity
function digit(string _char) external view returns (uint8)
```

Get the Unicode digit property of `_char`

*This raises an error for characters without a digit property. Values can only be within 0-9.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _char | string | The character to get

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint8 | The digit value of `_char`

### exists

```solidity
function exists(string _char) external view returns (bool)
```

Check if `_char` exists in the Unicode database

*All getters will error if a character doesn&#39;t exist. exists allows you check before getting.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _char | string | The character to check

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | True if character `_char` is valid and exists

### isAlphabetic

```solidity
function isAlphabetic(string _char) external view returns (bool)
```

Check if `_char` is a alphabetic

*This is only for a single Unicode character not entire strings*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _char | string | the character to get

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | True if the character is a alphabetic

### isAlphanumeric

```solidity
function isAlphanumeric(string _char) external view returns (bool)
```

Check if `_char` is a alphanumeric

*This is only for a single Unicode character not entire strings*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _char | string | the character to get

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | True if the character is a alphanumeric

### isCased

```solidity
function isCased(string _char) external view returns (bool)
```

Check if `_char` is cased

*This is only for a single Unicode character not entire strings*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _char | string | the character to get

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | True if the character is cased

### isLetter

```solidity
function isLetter(string _char) external view returns (bool)
```

Check if `_char` is a letter

*This is only for a single Unicode character not entire strings*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _char | string | the character to get

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | True if the character is a letter

### isLowercase

```solidity
function isLowercase(string _char) external view returns (bool)
```

Check if `_char` is lowercase

*This is only for a single Unicode character not entire strings*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _char | string | the character to get

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | True if the character is lowercase

### isMark

```solidity
function isMark(string _char) external view returns (bool)
```

Check if `_char` is a mark

*This is only for a single Unicode character not entire strings*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _char | string | the character to get

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | True if the character is a mark

### isMath

```solidity
function isMath(string _char) external view returns (bool)
```

Check if `_char` is a mathematic symbol

*This is only for a single Unicode character not entire strings*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _char | string | the character to get

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | True if the character is a mathematic symbol

### isNumber

```solidity
function isNumber(string _char) external view returns (bool)
```

Check if `_char` is a number

*This is only for a single Unicode character not entire strings*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _char | string | the character to get

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | True if the character is a number

### isOther

```solidity
function isOther(string _char) external view returns (bool)
```

Check if `_char` is in the &#39;Other&#39; category

*This is only for a single Unicode character not entire strings*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _char | string | the character to get

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | True if the character is in the &#39;Other&#39; category

### isPunctuation

```solidity
function isPunctuation(string _char) external view returns (bool)
```

Check if `_char` is punctuation

*This is only for a single Unicode character not entire strings*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _char | string | the character to get

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | True if the character is punctuation

### isSeparator

```solidity
function isSeparator(string _char) external view returns (bool)
```

Check if `_char` is a separator (whitespace)

*This is only for a single Unicode character not entire strings*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _char | string | the character to get

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | True if the character is a separator (whitespace)

### isSymbol

```solidity
function isSymbol(string _char) external view returns (bool)
```

Check if `_char` is a symbol

*This is only for a single Unicode character not entire strings*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _char | string | the character to get

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | True if the character is a symbol

### isTitlecase

```solidity
function isTitlecase(string _char) external view returns (bool)
```

Check if `_char` is titlecase

*This is only for a single Unicode character not entire strings*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _char | string | the character to get

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | True if the character is titlecase

### isUppercase

```solidity
function isUppercase(string _char) external view returns (bool)
```

Check if `_char` is uppercase

*This is only for a single Unicode character not entire strings*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _char | string | the character to get

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | True if the character is uppercase

### lowercase

```solidity
function lowercase(string _char) external view returns (string)
```

Get the simple lowercase value for a character if it exists

*This does not handle Special Casing. Contributions to fix this are welcome!*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _char | string | the character to lowercase

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | string | The corresponding lowercase character

### mirrored

```solidity
function mirrored(string _char) external view returns (bool)
```

If `_char` is a &quot;mirrored&quot; character in bidirectional text

*Do not confuse this with the Bidi_Mirroring_Glyph property*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _char | string | The character to get

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | True if `_char` is a &quot;mirrored&quot; character in bidirectional text

### name

```solidity
function name(string _char) external view returns (string)
```

Get the Unicode name of `_char`

*All Unicode characters will have a non-empty name*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _char | string | The character to get

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | string | The Unicode name of `_char`

### numeric

```solidity
function numeric(string _char) external view returns (struct UnicodeData.RationalNumber)
```

Get the Unicode numeric property of `_char`

*This raises an error for characters without a numeric property.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _char | string | The character to get

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | UnicodeData.RationalNumber | The RationalNumber struct for the numeric property of `_char`

### numericType

```solidity
function numericType(string _char) external view returns (enum UnicodeData.NumericType)
```

Get the numeric type for `_char`

*This does not handle derived numeric types from the Unicode Han Database. Contributions to fix this are welcome! https://www.unicode.org/Public/UNIDATA/extracted/DerivedNumericType.txt*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _char | string | the character to get

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | enum UnicodeData.NumericType | The numeric type for the character

### numericValue

```solidity
function numericValue(string _char) external view returns (struct UnicodeData.RationalNumber)
```

Get the numeric value for `_char`

*This does not handle derived numeric types from the Unicode Han Database and is currently identical to the numeric property. Contributions to fix this are welcome! https://www.unicode.org/Public/UNIDATA/extracted/DerivedNumericValues.txt*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _char | string | the character to get

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | UnicodeData.RationalNumber | The numeric value for the character

### owner

```solidity
function owner() external view returns (address)
```



*Returns the address of the current owner.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined

### renounceOwnership

```solidity
function renounceOwnership() external nonpayable
```



*Leaves the contract without owner. It will not be possible to call `onlyOwner` functions anymore. Can only be called by the current owner. NOTE: Renouncing ownership will leave the contract without an owner, thereby removing any functionality that is only available to the owner.*


### set

```solidity
function set(uint32 _codePoint, UnicodeData.Character _data) external nonpayable
```

This should only be used by the owner to initialize and update Unicode character database



#### Parameters

| Name | Type | Description |
|---|---|---|
| _codePoint | uint32 | The Unicode code point to set
| _data | UnicodeData.Character | The character data

### titlecase

```solidity
function titlecase(string _char) external view returns (string)
```

Get the simple titlecase value for a character if it exists

*This does not handle Special Casing. Contributions to fix this are welcome!*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _char | string | the character to titlecase

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | string | The corresponding titlecase character

### transferOwnership

```solidity
function transferOwnership(address newOwner) external nonpayable
```



*Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| newOwner | address | undefined

### uppercase

```solidity
function uppercase(string _char) external view returns (string)
```

Get the simple uppercase value for a character if it exists

*This does not handle Special Casing. Contributions to fix this are welcome!*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _char | string | the character to uppercase

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | string | The corresponding uppercase character



## Events

### OwnershipTransferred

```solidity
event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| previousOwner `indexed` | address | undefined |
| newOwner `indexed` | address | undefined |



