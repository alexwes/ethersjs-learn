const ethers = require("ethers")
const fs = require("fs-extra")
require("dotenv").config()

//TIME: 7:57:50

async function main() {
  // http://127.0.0.1:7545
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL)

  const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf8")
  let wallet = ethers.Wallet.fromEncryptedJsonSync(
    encryptedJson,
    process.env.PK_PASS
  )

  wallet = await wallet.connect(provider)

  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8")
  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf8"
  )

  const contractFactory = new ethers.ContractFactory(abi, binary, wallet)

  console.log("Deploying, please wait...")
  const contract = await contractFactory.deploy()
  await contract.deployTransaction.wait(1)

  const cFaveNum = await contract.retrieve()
  console.log(`Current Favorite Number: ${cFaveNum.toString()}`)
  const txresp = await contract.store("7")
  const txReceipt = await txresp.wait(1)

  const newFave = await contract.retrieve()
  console.log(`Current Favorite Number: ${newFave.toString()}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error)
    process.exit(1)
  })
