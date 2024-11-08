# RippleMarket

XRPL Sea Hackathon 2024

### [Demo Video](https://drive.google.com/file/d/1g31eIzJlZHkbmONdH_wjPscdRO9Ma4Z-/view?resourcekey) | [Demo](http://13.125.58.215:3000/) | [Pitchdeck](https://drive.google.com/file/d/1SpbAWFqRXAxWxNxUf0pQRAjOUFkK8CuY/view?usp=sharing)

## Overview
The Ripple Market project in Danggeun Market aims to bring the convenience, security, and efficiency of Ripple (XRP) payments to the popular Korean community-based app, where people buy, sell, and trade locally. By integrating Ripple, the project expands Danggeun Market’s reach, offering a reliable platform for `global peer-to-peer (P2P) transactions` that emphasizes safe, low-cost, and accessible trading within local communities. The project combines Danggeun Market’s active user base with Web3 technology to enhance the overall trading experience, reducing entry barriers to blockchain for new users.

## Key Features
Platform for Secondhand Goods
- Fully support secondhand goods transactions, enabling users to easily buy and sell pre-owned items in their communities.

Escrow Service for Secure Transactions
- Protect against scams by holding payments until both parties verify the transaction, adding a layer of safety, especially for transactions involving package shipments.

Social Login and Fiat On-Ramp
- Offer social login for easy access, and fiat on-ramp options so users can convert traditional currency to Ripple seamlessly, enhancing accessibility.

Bridge for Multi-Network Support
- Ensure compatibility with multiple networks through a bridge feature, allowing users to engage with different blockchains and optimize transaction options.

Token Swap Functionality
- Support token swaps between stablecoins and other tokens, giving users the flexibility to transact in the currency of their choice.

### social login
`components/wallet.tsx`

### fiat on ramp
`app/charge/page.tsx`

### escrow send
```ts
  const onEscrowSendTransaction = async () => {
    try {

      if (!account){
        alert('account loding..')
        return;
      }
      const preimageData = crypto.randomBytes(32);

      // Create a new PreimageSha256 fulfillment
      const myFulfillment = new PreimageSha256();
      myFulfillment.setPreimage(preimageData);

      // Get the condition in hex format
      const conditionHex = myFulfillment
        .getConditionBinary()
        .toString("hex")
        .toUpperCase();
      console.log("Condition in hex format: ", conditionHex);

      let finishAfter = new Date(new Date().getTime() / 1000);
      finishAfter = new Date(finishAfter.getTime() * 1000 + 3);
      console.log("This escrow will finish after!!: ", finishAfter);

      console.log(product)
      if (!product) {
        return;
      }

      const tx = {
        TransactionType: "EscrowCreate",
        Account: account,
        Amount: xrpToDrops(product.price),
        Destination: product.owner,
        Condition: conditionHex, // SHA-256 해시 조건
        FinishAfter: isoTimeToRippleTime(finishAfter.toISOString()), // Refer for more details: https://xrpl.org/basic-data-types.html#specifying-time
      };
      console.log("tx", tx)
      const txSign: any = await provider?.request({
        method: "xrpl_submitTransaction",
        params: {
          transaction: tx,
        },
      });

      console.log("txRes", txSign);
      console.log(
        "txRes.result.tx_json.OfferSequence :",
        txSign.result.tx_json.Sequence
      );
      console.log("condition : ", conditionHex);
      console.log(
        "fullfillment : ",
        myFulfillment.serializeBinary().toString("hex").toUpperCase()
      );
      const txHash = txSign.result.tx_json.hash; // Extract transaction hash from the response

      await pb.collection("ripplemarket").update(product.id, {
        txhash: txHash,
        fulfillment: myFulfillment
          .serializeBinary()
          .toString("hex")
          .toUpperCase(),
        condition: conditionHex,
        sequence: txSign.result.tx_json.Sequence,
        state: "Reserved",
        buyer: account,
      });
      alert("Escrow Success");
      window.location.reload();
    } catch (error) {
      console.log("error", error);
    }
  };
```

### escrow approve
```ts
const onApprove = async() => {
  if (!product) {
    return;
  }
  await pb.collection("ripplemarket").update(product.id, {
      state: "Approve",
  });
  window.location.reload();
}
```

### escrow receive
```ts
  const onReceive =async() => {
    if (!account){
      alert('account loding..')
      return;
    }
    if (!product) {
      return;
    }
    console.log(product)
    const tx = {
      TransactionType: "EscrowFinish",
      Account: account,
      Owner: product.buyer,
      OfferSequence: product.sequence, // 에스크로 트랜잭션의 시퀀스 번호
      Condition: product.condition, // 생성된 조건
      Fulfillment: product.fulfillment
    };

    console.log(tx)
    const txSign: any = await provider?.request({
      method: "xrpl_submitTransaction",
      params: {
        transaction: tx,
      },
    });
    console.log("txSign : ",txSign)
    await pb.collection("ripplemarket").update(product.id, {
      state: "Complete",
    });
    //window.location.reload()
  }
```

### bridge
implement failed(env issue)
```ts
import "@therootnetwork/api-types";
import { ApiPromise } from "@polkadot/api";
import { getPublicProvider } from "@therootnetwork/api";
import { Keyring } from "@polkadot/keyring";

const keyring = new Keyring({type:"ethereum"});

const mnemonic = ""
const derivePath = "m/44'/60'/0'/0/0"
const seed = `${mnemonic}/${derivePath}`

const privateKey = ""

const suri = privateKey? privateKey : seed
const wallet = keyring.addFromUri(suri)

console.log(`address: ${wallet.address}`)

const promiseApi = ApiPromise.create({
    ...getPublicProvider("porcini"),
});

async function xrplBridge(amount: number, destination: string) {
    const api = await promiseApi

    const tx = await api.tx.xrplBridge.withdrawXrp(amount, destination)
    const signedTx = await tx.signAndSend(wallet)
    console.log(`Transaction hash: ${signedTx}`)
    return signedTx
}

xrplBridge(1000000, "0x72ee785458b89d5ec64bec8410c958602e6f7673")
```