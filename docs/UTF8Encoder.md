# UTF8Encoder

*Devin Stein*

> A library for encoding UTF-8 strings





## Methods

### UTF8Encode

```solidity
function UTF8Encode(uint32 self) external pure returns (string)
```

Get the UTF-8 string for `self`

*UTF8Encode will error if the code point is not valid*

#### Parameters

| Name | Type | Description |
|---|---|---|
| self | uint32 | The code point to UTF-8 encode

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | string | The UTF-8 string for the given code point




