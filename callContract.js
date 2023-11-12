const { Provider, Account, Contract, ec, json } = require("starknet");
const abi = require("./oracleContract.json");

const provider = new Provider({
  sequencer: {
    network:
      "SN_GOERLI",
  },
});

const contractAddress =
  "0x6a0c05a08fbf89100b6082971eb74d9766088da91651e48e4c535945c40d61d";
const contract = new Contract(abi, contractAddress, provider);

const privateKey =
  "0x035d212f9fbbb0c706e4d6b46d0c8c1403ff7904342c0f2da2b5e84fa90e5c5c";
const accountAddress =
  "0x000570d7a5860b8f1689b779e514a81756c0bf54d21c8992211242a77bc43318";

const owner = new Account(provider, accountAddress, privateKey);

async function callOracle(address, honeyPotStatus) {
  let status;
  if (honeyPotStatus === true) {
    status = 1;
  } else {
    status = 0;
  }

  contract.connect(owner);
  const call = contract.populate("set_HoneyPot", [address, status]);
  const tx = await contract.set_HoneyPot(call.calldata);
  await provider.waitForTransaction(tx.transaction_hash);
  console.log("Transaction sent", tx);
}

module.exports = { callOracle };
