# Unicode Ethereum Project

The Unicode Ethereum Project is an initiative to provide libraries and contracts for Unicode data, algorithms, and utilities for Ethereum developers.

## Project Status

The Unicode Ethereum Project is under active development and has not been deployed the Ethereum Mainnet. We want to get sufficient feedback from the community before committing the resources required to deployed the Unicode Character Database to Ethereum. Please checkout [contributing](#contributing) to see how you can make an impact!


| Contract    | Rinkeby                                                                                                                       | Ropsten                                                                                                                       | Polygon Mumbai                                                                                                                  | Polygon Mainnet | Ethereum Mainnet |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | --------------- | ---------------- |
| Unicode     | [0xA1263c98FA087dfc400003a1F0F8f154705edC53](https://rinkeby.etherscan.io/address/0xA1263c98FA087dfc400003a1F0F8f154705edC53) | [0xe1a5dc72931a1e9c75bfa50787ab0f8f3d666956](https://ropsten.etherscan.io/address/0xe1a5dc72931a1e9c75bfa50787ab0f8f3d666956) | [0xDdF956e33f238bE394787A4C04EF3038E3307802](https://mumbai.polygonscan.com/address/0xDdF956e33f238bE394787A4C04EF3038E3307802) | ❌               | ❌                |
| UTF8Encoder | [0x11168016803F91611E4ff5a5cd6Db43D7C772707](https://rinkeby.etherscan.io/address/0x11168016803F91611E4ff5a5cd6Db43D7C772707) | [0x9fB43dc6c94763d7158E68da24BE6537Dfa4258a](https://ropsten.etherscan.io/address/0x9fB43dc6c94763d7158E68da24BE6537Dfa4258a) | [0xbC7b39ed8132064eCC00dfD8E5f07f3DD0b38d2B](https://mumbai.polygonscan.com/address/0xbC7b39ed8132064eCC00dfD8E5f07f3DD0b38d2B) | ❌               | ❌                |
| UnicodeData | [0x37F0927Db2Bad67E708416F3C2FbaAC42A376741](https://rinkeby.etherscan.io/address/0x37F0927Db2Bad67E708416F3C2FbaAC42A376741) | ❌                                                                                                                             | ❌                                                                                                                               | ❌               | ❌                |

## Motivation

Unicode data and algorithms are essential to any major programming language. Solidity, like many lower-level programming languages, represent strings as a [UTF-8 encoded bytes](https://docs.soliditylang.org/en/v0.8.10/types.html#bytes-and-string-as-arrays) and does not natively support character-based operations like `length`, `charAt`, or `isLowercase`. There are popular third-party libraries for string manipulation, like https://github.com/Arachnid/solidity-stringutils, but none that provide information about the underlying Unicode characters. If you are building an application or contract that receives user input as strings, understanding user input is critical for any validation, sanitization, or standardization logic.

Unlike libraries in other programming languages, Solidity contracts are _stateful_. This allows us to not only build out a Unicode Data API, like in other languages, but also store the [Unicode Character Database](https://www.unicode.org/reports/tr44/
) on Ethereum. With the Unicode Character Database accessible within the Ethereum network, it empowers anyone to build out additional APIs and functionality on top of the Unicode Character Database.

As mentioned before, Unicode data and libraries are essential for any major programming language and the Unicode Ethereum Project could not have been possible with out the rich, open source Unicode ecosystem. A few notable projects that helped in getting the Unicode Ethereum Project off the ground were

- https://icu.unicode.org/
- https://github.com/open-i18n/rust-unic/
- https://docs.python.org/3/library/unicodedata.html

## Functionality

### Unicode (UTF-8) Library

```solidity
import "https://github.com/devstein/unicode-eth/contracts/Unicode.sol";

contract MyContract {
  using Unicode for string;

  function simpleEmailVerification(string calldata _email) external pure returns (bool) {
    // '@' exists and is not the first character
    uint atSignIdx = _email.indexOf("@");

    if (atSignIdx == Unicode.CHAR_NOT_FOUND || atSignIdx == 0) return false;

    // '.' exists and is after @
    // NOTE: This is an naive example and would fail on valid email addresses like devin.stein@unicode.org
    uint periodIdx = _email.indexOf(".");

    if (periodIdx == Unicode.CHAR_NOT_FOUND ||  periodIdx < atSignIdx) return false;

    return true;
  }
}
```

### UTF8Encoder Library

A library for encoding Unicode `uint32` code points their UTF-8 string representation.

```solidity
import "https://github.com/devstein/unicode-eth/contracts/UTF8Encoder.sol";

contract MyContract {
  using UTF8Encoder for uint32;

  function codePointToString(uint32 _cp) external pure returns (string memory){
    return _cp.UTF8Encode();
  }
}
```

### UnicodeData Contract

An API for the Unicode Character Database

```solidity
// TODO
```


## Contributing

Building a new Unicode library and API is a massive undertaking and cannot be done alone! For the Unicode Ethereum Project to be successful, we will need the help of the Ethereum community. All contributions, small or large, are welcome! If you have an idea for feature, start [a discussion](https://github.com/devstein/unicode-eth/discussions) or make a pull-request.

