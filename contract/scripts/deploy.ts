import * as dotenv from "dotenv"
import * as hre  from "hardhat";
dotenv.config();

const initialSupply = 100

async function main() {
  
  // here we deploy the contract
 const DefiWageManagerContract = await hre.ethers.deployContract("DefiWageManager", );

  await DefiWageManagerContract.waitForDeployment();

 // print the address of the deployed contract
  console.log("DeFI Wage Manager Contract Address:", DefiWageManagerContract.target);

  console.log("Sleeping.....");
  // Wait for etherscan to notice that the contract has been deployed
  await sleep(30000);

  // Verify the contract after deploying
  await hre.run("verify:verify", {
    address: DefiWageManagerContract.target,
    constructorArguments: [],
  });

  //0xbe8a71B877d3117423f9d32B5e19Bdb82b0b93dE
}
function sleep(ms: any) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});