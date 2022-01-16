import { ethers } from "hardhat";
import { Signer } from "ethers";
import { expect } from "chai";

const deploy = async () => {
  const C = await ethers.getContractFactory("Unicode");
  const contract = await C.deploy();

  return contract;
};

describe("Unicode Library", function () {
  it("should deploy", async function () {
    try {
      await deploy();
    } catch (error) {
      expect(false).to.equal("failed to deploy");
    }
  });

  it("should return true for all ascii characters", async function () {
    const max = 128;
    const codePoints = [...Array(max).keys()];
    // concat them separately or else the encoding changes
    const str = codePoints.map((v) => String.fromCodePoint(v)).join("");

    const contract = await deploy();

    const expected = true;
    const actual = await contract.isASCII(str);
    expect(actual).to.equal(expected);
  });

  it("should return false for non-ascii characters", async function () {
    const str = "😢";

    const contract = await deploy();

    const expected = false;
    const actual = await contract.isASCII(str);
    expect(actual).to.equal(expected);
  });

  it("should return the UTF-8 length", async function () {
    const str = "A😢Ÿ";

    const contract = await deploy();

    const expected = 3;
    const actual = await contract.length(str);
    expect(actual).to.equal(expected);
  });

  it("should return the code point for a character", async function () {
    const characters = ["A", "😢", "Ÿ"];

    const contract = await deploy();

    for (let c of characters) {
      const expected = c.codePointAt(0);
      const actual = await contract.toCodePoint(c);
      expect(actual).to.equal(expected);
    }
  });

  it("should error for code point for a non-character", async function () {
    const str = "i'm not a character!";

    const contract = await deploy();

    try {
      await contract.toCodePoint(str);
      expect(false).to.equal("should reject non characters");
    } catch (err) {}
  });

  // TODO: Construct error tests for isUTF8
  it("should correctly validate UTF-8", async function () {
    const str = "A\\Ÿ😢, Ÿ";

    const contract = await deploy();

    const expected = true;
    const actual = await contract.isUTF8(str);
    expect(actual).to.equal(expected);
  });

  it("should decode from position 0", async function () {
    const str = "A\\Ÿ😢, Ÿ";

    const contract = await deploy();

    let [char, cursor] = await contract.decodeChar(str, 0);
    expect(char).to.equal("A");
    expect(cursor).to.equal(1);

    [char, cursor] = await contract.decodeChar(str, cursor);
    expect(char).to.equal("\\");
    expect(cursor).to.equal(2);

    [char, cursor] = await contract.decodeChar(str, cursor);
    expect(char).to.equal("Ÿ");
    expect(cursor).to.equal(4);
  });

  it("should fail to decode on an out of bounds position", async function () {
    const str = "A\\Ÿ😢, Ÿ";

    const contract = await deploy();

    try {
      await contract.decodeChar(str, 10000);
      expect(false).to.equal(true);
    } catch (err) {}
  });

  it("should fail to decode on an invalid position", async function () {
    const str = "😢";

    const contract = await deploy();

    try {
      await contract.decodeChar(str, 1);
      expect(false).to.equal(true);
    } catch (err) {}
  });

  it("should decode an emoji character", async function () {
    const str = "😢";

    const contract = await deploy();

    const [char, cursor] = await contract.decodeChar(str, 0);
    expect(char).to.equal("😢");
    expect(cursor).to.equal(4);
  });

  it("should decode an entire string", async function () {
    const str = "A\\Ÿ😢, Ÿ";

    const contract = await deploy();

    const chars = await contract.decode(str);
    for (let c of str) {
      expect(chars).to.contain(c);
    }
  });

  it("should get the charAt at an index", async function () {
    const str = "AŸ - z";
    const contract = await deploy();

    const idx = 1;
    const expected = str.charAt(idx);
    const char = await contract.charAt(str, idx);
    expect(char).to.equal(expected);
  });

  it("should get the charAt at the last index", async function () {
    const str = "AŸ - z";
    const contract = await deploy();

    const idx = str.length - 1;
    const expected = str.charAt(idx);
    const char = await contract.charAt(str, idx);
    expect(char).to.equal(expected);
  });

  it("should failed to get the charAt at an out of bounds index", async function () {
    const str = "AŸ - z";
    const contract = await deploy();

    try {
      await contract.charAt(str, str.length);
      expect(false).to.equal(true);
    } catch (err) {}
  });

  it("should get the codePointAt at an index", async function () {
    const str = "AŸ - z";
    const contract = await deploy();

    const idx = 1;
    const expected = str.codePointAt(idx);
    const char = await contract.codePointAt(str, idx);
    expect(char).to.equal(expected);
  });

  it("should get the codePointAt at the last index", async function () {
    const str = "AŸ - z";
    const contract = await deploy();

    const idx = str.length - 1;
    const expected = str.codePointAt(idx);
    const char = await contract.codePointAt(str, idx);
    expect(char).to.equal(expected);
  });

  it("should get the indexOf each character", async function () {
    const str = "AŸ -?z";
    const contract = await deploy();

    // @ts-ignore
    for (let i in str) {
      const char = str[i];
      const idx = await contract.indexOf(str, char);
      expect(idx).to.equal(idx);
    }
  });

  it("should return the CHAR_NOT_FOUND for a missing character", async function () {
    const str = "AŸ -?z";
    const contract = await deploy();

    const char = "🚨";
    const idx = await contract.indexOf(str, char);
    const CHAR_NOT_FOUND = await contract.CHAR_NOT_FOUND();
    expect(idx).to.equal(CHAR_NOT_FOUND);
  });

  it("should get the bytesIndicesOf each character", async function () {
    const str = "AŸ -?z";
    const contract = await deploy();

    let [start, end] = await contract.bytesIndicesOf(str, "A");
    expect(start).to.equal(0);
    expect(end).to.equal(1);

    [start, end] = await contract.bytesIndicesOf(str, "Ÿ");
    expect(start).to.equal(1);
    expect(end).to.equal(3);
  });

  it("should return the (CHAR_NOT_FOUND, CHAR_NOT_FOUND) for an missing character", async function () {
    const str = "AŸ -?z";
    const contract = await deploy();

    const char = "🚨";
    const [start, end] = await contract.bytesIndicesOf(str, char);
    const CHAR_NOT_FOUND = await contract.CHAR_NOT_FOUND();
    expect(start).to.equal(CHAR_NOT_FOUND);
    expect(end).to.equal(CHAR_NOT_FOUND);
  });
});
