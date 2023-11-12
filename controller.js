const starknet = require("starknet");
const router = require("./router.json");
const abi = require("./abi.json");
const { ethers } = require("ethers");

const provider = new starknet.RpcProvider({
  nodeUrl:
    "https://starknet-mainnet.g.alchemy.com/v2/MMC_IgNUW2z5_iIEYa1PhiNBD_WKOdpo",
});

async function getEventsFromChain(tokenAddress) {
  let eventsRes;
  let eventDataArray = new Set();

  console.log("provider =", provider);

  let block = await provider.getBlock("latest");

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
      address: tokenAddress,
      keys: [
        [
          "0x99cd8bde557814842a3121e8ddfd433a539b8c9f14bf31ebf108d12e6196e9",
        ],
      ],
      chunk_size: 100,
      // continuation_token: continuationToken,
    });

    console.log(eventsRes);
    const nbEvents = eventsRes.events.length;
    continuationToken = eventsRes.continuation_token;

    for (let i = 0; i < nbEvents; i++) {
      const event = eventsRes.events[i];

      const transactionReciept = await provider.getTransactionReceipt(
        event.transaction_hash
      );
      for (j = 0; j < transactionReciept.events.length; j++) {
        if (
          transactionReciept.events[j].keys[0] ===
          "0xe316f0d9d2a3affa97de1d99bb2aac0538e2666d0d8545545ead241ef0ccab"
        ) {
          eventDataArray.add(transactionReciept.transaction_hash);
        }
      }
    }

    chunkNum++;
  }
  const object = { transactions: [...eventDataArray] };

  return object;
}

async function debugTransactions(req, res) {
  console.log(req.query.tokenAddress);
  const object = await getEventsFromChain(req.query.tokenAddress);

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

  const data = await getTokens(obj, req.query.tokenAddress);

  res.status(200).json({ data, transaction: transactions[0].transaction_hash });
}

async function getTokens(obj, tokenAddress) {
  const token0 = obj.token0Obj.token;
  const token1 = obj.token1Obj.token;
  const amount0 = obj.token0Obj.amount;
  const amount1 = obj.token1Obj.amount;

  const token0Data = await testABI(token0);
  const token1Data = await testABI(token1);

  const parsedAmount0 = ethers.formatUnits(
    amount0.toString(),
    token0Data.tokenDecimals
  );
  const parsedAmount1 = ethers.formatUnits(
    amount1.toString(),
    token1Data.tokenDecimals
  );

  const routerContract = new starknet.Contract(
    router,
    "0x041fd22b238fa21cfcf5dd45a8548974d8263b3a531a60388411c5e230f97023",
    provider
  );

  console.log("routerContract =", routerContract.functions.get_amounts_out);

  const inputAmount = ethers.parseUnits("1", token0Data.tokenDecimals);
  const getAmountsOut = await routerContract.get_amounts_out(
    starknet.cairo.uint256(inputAmount),
    [token0, token1]
  );

  console.log("getAmountsOut =", getAmountsOut.amounts);
  const convertedData = getAmountsOut.amounts.map((item) => ({
    low: Number(item.low),
    high: Number(item.high),
  }));

  const parsedAmountsOut = ethers.formatUnits(
    convertedData[1]?.low.toString(),
    token1Data.tokenDecimals
  );

  console.log("parsedAmountsOut =", parsedAmountsOut);
  console.log("parsedAmount0 =", parsedAmount0);
  console.log("parsedAmount1 =", parsedAmount1);

  const totalTokens = parsedAmount0 * parsedAmountsOut;
  const tax = totalTokens / parsedAmount1;

  const honepotStatus = await honeyPotCheck(tax);
  console.log("totalTokens =", totalTokens);
  return {
    token0: token0Data.tokenName,
    token1: token1Data.tokenName,
    tax,
    isHoneyPot: honepotStatus,
    tokenAddress : tokenAddress
  };
}

// add function to get tokenName and tokenDecimals
async function testABI(tokenAddress) {
  const proxyContract = new starknet.Contract(abi, tokenAddress, provider);

  console.log("proxyContract =", proxyContract.abi);

  const nameInDecimal = await proxyContract.name();
  const decimalsNo = await proxyContract.decimals();

  const hexName = nameInDecimal.name.toString(16);

  const tokenName = Buffer.from(hexName, "hex").toString("utf8");
  console.log(tokenName);

  const tokenDecimals = Number(decimalsNo.decimals);
  console.log(tokenDecimals);

  const data = {
    tokenName,
    tokenDecimals,
  };

  return data;
}

async function honeyPotCheck(tax){
  if(tax > 40){
    return true;
  } else {
    return false;
  }
}




module.exports = { debugTransactions, testABI };
