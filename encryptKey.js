const ethers = require("ethers");
const fs = require("fs-extra");
require("dotenv").config();
async function main() {
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
  const encryptedJsonKey = await wallet.encrypt(
    process.env.PK_PASS,
    process.env.PRIVATE_KEY
  );
  console.log(encryptedJsonKey);
  fs.writeFileSync("./.encryptedKey.json", encryptedJsonKey);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
