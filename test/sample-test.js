const { expect } = require("chai");

describe("Recovery", function () {
  it("Should return the address of the token created", async function () {

    const [deployer, token_creator] = await ethers.getSigners();

    const SimpleToken = await ethers.getContractFactory("SimpleToken", deployer);
    const Recovery = await ethers.getContractFactory("Recovery", deployer);

    this.recovery = await Recovery.deploy();

    // create new token
    await this.recovery.connect(token_creator).generateToken("Token", 1000000000);

    // recompute the address
    this.tokenAddress = ethers.utils.getContractAddress({
      from: this.recovery.address,
      nonce: 1
    })

    // recover contract with tokenAddress
    this.recoveredContract = await ethers.getContractAt("SimpleToken", this.tokenAddress);

    expect(await this.recoveredContract.name()).to.equal("Token");
    expect(await this.recoveredContract.balances(token_creator.address)).to.equal(1000000000)
  });
});
