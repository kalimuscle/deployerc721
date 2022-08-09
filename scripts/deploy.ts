import { ethers } from "hardhat";

async function main() {

  const Bolt = await ethers.getContractFactory("BoltToken");
  const bolt = await Bolt.deploy();

  await bolt.deployed();

  console.log("BoltToken NFT contract deployed to:", bolt.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
