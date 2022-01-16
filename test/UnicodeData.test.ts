import { ethers } from "hardhat";
import { Signer } from "ethers";
import { expect } from "chai";

const deploy = async () => {
  const C = await ethers.getContractFactory("UnicodeData");
  const contract = await C.deploy();

  return contract;
};

describe("UnicodeData Contract", function () {
  it("should deploy", async function () {
    try {
      await deploy();
    } catch (error) {
      expect(false).to.equal("failed to deploy");
    }
  });

  it("should initialize", async function () {
    expect(false).to.equal(true);
  });

  it("should return a character from a string", async function () {
    expect(false).to.equal(true);
  });

  it("should return a character from a codepoint", async function () {
    expect(false).to.equal(true);
  });

  it("should allow the owner to set a character", async function () {
    expect(false).to.equal(true);
  });

  it("should not allow non-owners to set a character", async function () {
    expect(false).to.equal(true);
  });

  it("should get the numeric type for a character", async function () {
    expect(false).to.equal(true);
  });

  it("should get the numeric value for a character", async function () {
    expect(false).to.equal(true);
  });

  it("should identify uppercase characters", async function () {
    expect(false).to.equal(true);
  });

  it("should identify lowercase characters", async function () {
    expect(false).to.equal(true);
  });

  it("should identify titlecase characters", async function () {
    expect(false).to.equal(true);
  });

  it("should identify cased characters", async function () {
    expect(false).to.equal(true);
  });

  it("should identify alphabetic characters", async function () {
    expect(false).to.equal(true);
  });

  it("should identify math characters", async function () {
    expect(false).to.equal(true);
  });

  it("should identify emoji characters 🤓", async function () {
    expect(false).to.equal(true);
  });
});
