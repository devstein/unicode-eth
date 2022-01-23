# Unicode

*Devin Stein*

> A library for validating, parsing, and manipulating UTF-8 encoded Unicode strings

For character introspection or more complex transformations, checkout the UnicodeData contract.

*All external and public functions use self as their first parameter to allow &quot;using Unicode for strings;&quot;. If you have ideas for new functions or improvements, please contribute!*

## Methods

### CHAR_NOT_FOUND

```solidity
function CHAR_NOT_FOUND() external view returns (uint256)
```

The return value of indexOf and bytesIndicesOf if the character is not found

*Use CHAR_NOT_FOUND to check if indexOf or bytesIndicesOf does not find the inputted character*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined

### bytesIndicesOf

```solidity
function bytesIndicesOf(string self, string _of) external pure returns (uint256, uint256)
```

Get the starting (inclusive) and ending (exclusive) bytes indices of character `_of` in string `self`

*bytesIndicesOf returns (CHAR_NOT_FOUND, CHAR_NOT_FOUND) if `_of` isn&#39;t found in `self`*

#### Parameters

| Name | Type | Description |
|---|---|---|
| self | string | The input string
| _of | string | The character to find the bytes indices of

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | The starting (inclusive) and ending (exclusive) indites the character in the bytes underlying the string
| _1 | uint256 | undefined

### charAt

```solidity
function charAt(string self, uint256 _idx) external pure returns (string)
```

Get the UTF-8 character at `_idx` for `self`

*charAt will error if the idx is out of bounds*

#### Parameters

| Name | Type | Description |
|---|---|---|
| self | string | The input string
| _idx | uint256 | The index of the character to get

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | string | The character at the given index

### codePointAt

```solidity
function codePointAt(string self, uint256 _idx) external pure returns (uint32)
```

Get the Unicode code point at `_idx` for `self`

*codePointAt requires a valid UTF-8 string*

#### Parameters

| Name | Type | Description |
|---|---|---|
| self | string | The input string
| _idx | uint256 | The index of the code point to get

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint32 | The Unicode code point at the given index

### decode

```solidity
function decode(string self) external pure returns (string[])
```

Decode every UTF-8 characters in `self`



#### Parameters

| Name | Type | Description |
|---|---|---|
| self | string | The input string

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | string[] | An ordered array of all UTF-8 characters  in `self`

### decodeChar

```solidity
function decodeChar(string self, uint256 _cursor) external pure returns (string, uint256)
```

Decode the next UTF-8 character in `self` given a starting position of `_cursor`

*decodeChar is useful for functions want to iterate over the string in one pass and check each category for a condition*

#### Parameters

| Name | Type | Description |
|---|---|---|
| self | string | The input string
| _cursor | uint256 | The starting bytes position (inclusive) of the character

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | string | The next character as a string and the starting position of the next character.
| _1 | uint256 | undefined

### indexOf

```solidity
function indexOf(string self, string _of) external pure returns (uint256)
```

Get the character index of `_of` in string `self`

*indexOf returns CHAR_NOT_FOUND if `_of` isn&#39;t found in `self`*

#### Parameters

| Name | Type | Description |
|---|---|---|
| self | string | The input string
| _of | string | The character to find the index of

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | The index of the character in the given string

### isASCII

```solidity
function isASCII(string self) external pure returns (bool)
```

Check if `self` contains only single byte ASCII characters (0-127)

*If a string is only ASCII, then it&#39;s safe to treat each byte as a character. This returns false for extended ASCII (128-255) because they are use two bytes in UTF-8.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| self | string | The input string

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | True if  the `self` only contains ASCII

### isUTF8

```solidity
function isUTF8(string self) external pure returns (bool)
```

Check if `self` is valid UTF-8



#### Parameters

| Name | Type | Description |
|---|---|---|
| self | string | The input string

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | True if the string is UTF-8 encoded

### length

```solidity
function length(string self) external pure returns (uint256)
```

Get length of `self`

*For efficiency, length assumes valid UTF-8 encoded input. It only does simple checks for bytes sequences*

#### Parameters

| Name | Type | Description |
|---|---|---|
| self | string | The input string

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | The number of UTF-8 characters in `self`

### toCodePoint

```solidity
function toCodePoint(string self) external pure returns (uint32)
```

Get the code point of character: `self`

*This function requires a valid UTF-8 character*

#### Parameters

| Name | Type | Description |
|---|---|---|
| self | string | The input character

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint32 | The code point of `self`




