import { ethers } from "hardhat";
import { Signer } from "ethers";
import { expect } from "chai";

import { deployAll } from "../scripts/contracts";

const deploy = async () => {
  const [c] = await deployAll();
  return c;
};

const character = {
  code: 63,
  name: "QUESTION MARK",
  combining: 0,
  mirrored: false,
  decimal: 255,
  digit: 255,
  numeric: {
    numerator: 0,
    denominator: 1,
  },
  uppercase: 0,
  lowercase: 0,
  titlecase: 0,
  category: "0x506f",
  bidirectional: 13,
  decompositionType: 0,
};

const parameters = [
  character.code,
  [
    character.name,
    [character.numeric.numerator, character.numeric.denominator],
    [], // decomposition
    character.category,
    character.combining,
    character.bidirectional,
    character.decompositionType,
    character.decimal,
    character.digit,
    character.mirrored,
    character.uppercase,
    character.lowercase,
    character.titlecase,
  ],
];

describe("UnicodeData Contract", function () {
  it("should deploy", async function () {
    try {
      await deploy();
    } catch (error) {
      expect(false).to.equal("failed to deploy");
    }
  });

  it("should allow the owner to set a character", async function () {
    const contract = await deploy();

    await contract.set(...parameters);

    const data = await contract.characters(character.code);
    // why does data not return uint32[] decompositonMapping?
    const {
      name,
      numeric,
      category,
      combining,
      bidirectional,
      decompositionType,
      decimal,
      digit,
      mirrored,
      uppercase,
      lowercase,
      titlecase,
    } = data;
    const decompositonMapping = await contract.decompositionMapping("?");

    expect(name).to.equal(character.name);
    expect(numeric).to.deep.equal([
      ethers.BigNumber.from(character.numeric.numerator),
      ethers.BigNumber.from(character.numeric.denominator),
    ]);
    expect(decompositonMapping).to.deep.equal([]);
    expect(category).to.equal(character.category);
    expect(combining).to.equal(character.combining);
    expect(bidirectional).to.equal(character.bidirectional);
    expect(decompositionType).to.equal(character.decompositionType);
    expect(decimal).to.equal(character.decimal);
    expect(digit).to.equal(character.digit);
    expect(mirrored).to.equal(character.mirrored);
    expect(uppercase).to.equal(character.uppercase);
    expect(lowercase).to.equal(character.lowercase);
    expect(titlecase).to.equal(character.titlecase);
  });

  it("should not allow non-owners to set a character", async function () {
    const contract = await deploy();

    const [_, nonOwner] = await ethers.getSigners();
    try {
      await contract.connect(nonOwner).set(...parameters);
      // fail -> should not succeed
      expect(true).to.equal(false);
    } catch (error) {}
  });

  it("should get the numeric type for a character", async function () {
    // TODO
  });

  it("should get the numeric value for a character", async function () {
    // TODO
  });

  it("should identify uppercase characters", async function () {
    // TODO
  });

  it("should identify lowercase characters", async function () {
    // TODO
  });

  it("should identify titlecase characters", async function () {
    // TODO
  });

  it("should identify cased characters", async function () {
    // TODO
  });

  it("should identify alphabetic characters", async function () {
    // TODO
  });

  it("should identify math characters", async function () {
    // TODO
  });
});
