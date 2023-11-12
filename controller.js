const starknet = require("starknet");
const fs = require("fs");
const router = require("./router.json");
const abi = require("./abi.json");

const provider = new starknet.RpcProvider({
  nodeUrl:
    "https://starknet-mainnet.g.alchemy.com/v2/MMC_IgNUW2z5_iIEYa1PhiNBD_WKOdpo",
});

async function getEventsFromChain() {
  let eventsRes;
  let eventDataArray = new Set();

  console.log("provider =", provider);

  //   const transaction = provider.getTransactionReceipt(
  //     "0x0237285ac5eded656df24ae938f0512fe1a902f78af9ea3cf268c2fe9b7a8d10"
  //   );
  //   console.log(transaction);

  let block = await provider.getBlock("latest");
  // console.log("bloc #", block.block_number);

  let continuationToken = "0";
  let chunkNum = 1;
  while (eventDataArray.size < 2) {
    eventsRes = await provider.getEvents({
      from_block: {
        block_number: block.block_number - 1000,
      },
      to_block: {
        block_number: block.block_number,
      },
      address:
        "0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8",
      keys: [
        [
          "0x99cd8bde557814842a3121e8ddfd433a539b8c9f14bf31ebf108d12e6196e9",
          // "0xe316f0d9d2a3affa97de1d99bb2aac0538e2666d0d8545545ead241ef0ccab",
        ],
      ],
      chunk_size: 10,
      // continuation_token: continuationToken,
    });

    console.log(eventsRes);
    const nbEvents = eventsRes.events.length;
    continuationToken = eventsRes.continuation_token;
    // console.log("chunk nb =", chunkNum, ".", nbEvents, "events recovered.");
    // console.log("continuation_token =", continuationToken);
    for (let i = 0; i < nbEvents; i++) {
      const event = eventsRes.events[i];
      // console.log(
      //   "event #",
      //   i,
      //   "data length =",
      //   event.data.length,
      //   "key length =",
      //   event.keys.length,
      //   ":",
      //   event.transaction_hash
      // );

      const transactionReciept = await provider.getTransactionReceipt(
        event.transaction_hash
      );
      for (j = 0; j < transactionReciept.events.length; j++) {
        // console.log("transactionReciept =", transactionReciept.events[j].keys);

        if (
          transactionReciept.events[j].keys[0] ===
          "0xe316f0d9d2a3affa97de1d99bb2aac0538e2666d0d8545545ead241ef0ccab"
        ) {
          eventDataArray.add(transactionReciept.transaction_hash);
        }
      }

      // eventDataArray.push(event.data);
      // console.log("\nkeys =", event.keys, "data =", event.data);
    }
    // console.log("eventDataArray =", eventDataArray, "\n");
    chunkNum++;
  }
  const object = { transactions: [...eventDataArray] };

  return object;

  // res.status(200).json({ transactions: [...eventDataArray] });
}

async function debugTransactions(req, res) {
  const object = await getEventsFromChain();
  const transactions = [];
  for (let i = 0; i < object.transactions.length; i++) {
    const transactionReciept = await provider.getTransactionReceipt(
      object.transactions[i]
    );
    transactions.push(transactionReciept);
  }
  let newtransactions = [];
  console.log(transactions[0].transaction_hash);
  const debug = transactions[0].events;
  console.log("DEBUG: ", debug);
  for (let i = 0; i < debug.length; i++) {
    if (
      debug[i].keys[0] ===
      "0x99cd8bde557814842a3121e8ddfd433a539b8c9f14bf31ebf108d12e6196e9"
    ) {
      newtransactions.push(debug[i]);
    }
  }
  let transfers;
  if (
    newtransactions[0]?.from_address !==
    newtransactions[newtransactions.length - 2].from_address
  ) {
    transfers = [
      newtransactions[0],
      newtransactions[newtransactions.length - 2],
    ];
  } else {
    transfers = [
      newtransactions[0],
      newtransactions[newtransactions.length - 3],
    ];
  }

  const token0keys = transfers[0];
  const token1keys = transfers[1];

  const token0 = token0keys.from_address;
  const token1 = token1keys.from_address;

  const amountInToken0 = token0keys.data[2];
  const amountInToken1 = token1keys.data[2];

  const token1Obj = {
    token: token1,
    amount: amountInToken1,
  };

  const token0Obj = {
    token: token0,
    amount: amountInToken0,
  };

  const obj = { token0Obj, token1Obj };

  await getTokens(obj);

  res.status(200).json({
    hash: transactions[0].transaction_hash,
    transactions: transfers,
    newtransactions,
    token0Obj,
    token1Obj,
  });
}

async function getTokens(obj) {
  const token0 = obj.token0Obj.token;
  const token1 = obj.token1Obj.token;
  const amount0 = obj.token0Obj.amount;
  const amount1 = obj.token1Obj.amount;

  const routerContract = new starknet.Contract(
    router,
    "0x041fd22b238fa21cfcf5dd45a8548974d8263b3a531a60388411c5e230f97023",
    provider
  );

  console.log("routerContract =", routerContract.functions.get_amounts_out);

  const getAmountsOut = await routerContract.get_amounts_out(
    starknet.cairo.uint256(amount0),

    [token0,token1]
  );

  console.log("getAmountsOut =", getAmountsOut.amounts);
  await testABI()
}

async function testABI(){

  const contract = new starknet.Contract(abi, '0x68f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8', provider);

  console.log(await contract.get_name())
  // const impl = await contract.implementation();

  // console.log(impl);
  // console.log('Impl: ', '0x' + impl.implementation_hash_.toString(16));

  // const implCompiledClass = await provider.getClassAt('0x' + impl.implementation_hash_.toString(16));
  // fs.writeFileSync('./implAbiERC.json', starknet.json.stringify(implCompiledClass.abi, undefined,2));

  // console.log(await implementTokenContract.name());
}

module.exports = { debugTransactions };
