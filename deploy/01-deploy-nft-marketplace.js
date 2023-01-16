const { network } = require("hardhat")
const { developmentChains, VERIFICATION_BLOCK_CONFIRMATIONS } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => { // these two objects come from the hre the Hardhat Runtime envirement. (i think thats what it stands for.. could be slightly off.)
    // getNamedAccounts allows us to access the signer / accounts[0] the account we are using to deploy the stuff. 
    // deployments lets us actually deploy and log (plus other stuff but that is what we are doing here..)
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const waitBlockConfirmations = developmentChains.includes(network.name) // if its a testnet than we should do 6 / couple as stipulated in our helper-hardhat-config
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS

    log("----------------------------------------------------") // letting us know we are starting the magic. 
    const arguments = [] // arguments to deploy 
    const nftMarketplace = await deploy("NftMarketplace", { // NftMarketplace - hardhat is smart enough to look into contracts for a contract with this name and it takes care of buisness
        from: deployer,
        args: arguments,
        log: true,
        waitConfirmations: waitBlockConfirmations,
    })

    // Verify the deployment
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(nftMarketplace.address, arguments)
    }
    log("----------------------------------------------------")
}

module.exports.tags = ["all", "nftmarketplace"]
