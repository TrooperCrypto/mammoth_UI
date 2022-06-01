import { FC, useEffect, useState } from "react"
import * as starknet from "starknet";

import { truncateAddress } from "../services/address.service"
import {
  getErc20TokenAddress,
  transfer,
} from "../services/token.service"
import {
  addToken,
  getExplorerBaseUrl,
  networkId
} from "../services/wallet.service"
import styles from "../styles/Home.module.css"

export const TokenDapp: FC = () => {
  const [mintAmount, setMintAmount] = useState("10")
  const [transferTo, setTransferTo] = useState("")
  const [transferAmount, setTransferAmount] = useState("1")
  const [lastTransactionHash, setLastTransactionHash] = useState("")
  const [transactionStatus, setTransactionStatus] = useState<
    "idle" | "approve" | "pending" | "success"
  >("idle")

  const buttonsDisabled = ["approve", "pending"].includes(transactionStatus)

  useEffect(() => {
    ;(async () => {
      if (lastTransactionHash && transactionStatus === "pending") {
        await starknet.defaultProvider.waitForTransaction(lastTransactionHash);
        setTransactionStatus("success")
      }
    })()
  }, [transactionStatus, lastTransactionHash])

  const network = networkId()
  if (network !== "goerli-alpha" && network !== "mainnet-alpha") {
    return (
      <>
        <p>
          There is no demo token for this network, but you can deploy one and
          add its address to this file:
        </p>
        <div>
          <pre>packages/playground/src/token.service.ts</pre>
        </div>
      </>
    )
  }

  const handleMintSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setTransactionStatus("approve")

      console.log("mint", mintAmount)
      // const result = await mintToken(mintAmount, network)
      const result = 'cant mint this'
      console.log(result)

      setLastTransactionHash('0x0')
      setTransactionStatus("pending")
    } catch (e) {
      console.error(e)
      setTransactionStatus("idle")
    }
  }

  const handleTransferSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault()
      setTransactionStatus("approve")

      console.log("transfer", { transferTo, transferAmount })
      const result = await transfer(transferTo, transferAmount, network)
      console.log(result)

      setLastTransactionHash(result.transaction_hash)
      setTransactionStatus("pending")
    } catch (e) {
      console.error(e)
      setTransactionStatus("idle")
    }
  }

  const tokenAddress = getErc20TokenAddress(networkId() as any)
  const ethAddress =
    networkId() === "goerli-alpha"
      ? "0x2dd93e385742984bf2fc887cd5d8b5ec6917d80af09cf7a00a63710ad51ba53"
      : undefined

  return (
    <>
      <h3 style={{ margin: 0 }}>
        Transaction status: <code>{transactionStatus}</code>
      </h3>
      {lastTransactionHash && (
        <a
          href={`${getExplorerBaseUrl()}/tx/${lastTransactionHash}`}
          target="_blank"
          rel="noreferrer"
          style={{ color: "blue", margin: "0 0 1em" }}
        >
          <code>{lastTransactionHash}</code>
        </a>
      )}
      <div className="columns">
        <form onSubmit={handleMintSubmit}>
          <h2 className={styles.title}>Mint token</h2>

          <label htmlFor="mint-amount">Amount</label>
          <input
            type="text"
            id="mint-amount"
            name="fname"
            value={mintAmount}
            onChange={(e) => setMintAmount(e.target.value)}
          />

          <input type="submit" disabled={buttonsDisabled} value="Mint" />
        </form>

        <form onSubmit={handleTransferSubmit}>
          <h2 className={styles.title}>Transfer token</h2>

          <label htmlFor="transfer-to">To</label>
          <input
            type="text"
            id="transfer-to"
            name="fname"
            value={transferTo}
            onChange={(e) => setTransferTo(e.target.value)}
          />

          <label htmlFor="transfer-amount">Amount</label>
          <input
            type="text"
            id="transfer-amount"
            name="fname"
            value={transferAmount}
            onChange={(e) => setTransferAmount(e.target.value)}
          />
          <br />
          <input type="submit" disabled={buttonsDisabled} value="Transfer" />
        </form>
      </div>      
      <h3 style={{ margin: 0 }}>
        ERC-20 token address
        <button
          className="flat"
          style={{ marginLeft: ".6em" }}
          onClick={() => addToken(tokenAddress)}
        >
          Add to wallet
        </button>
        <br />
        <code>
          <a
            target="_blank"
            href={`${getExplorerBaseUrl()}/contract/${tokenAddress}`}
            rel="noreferrer"
          >
            {truncateAddress(tokenAddress)}
          </a>
        </code>
      </h3>
      {ethAddress && (
        <h3 style={{ margin: 0 }}>
          Goerli ETH token address
          <button
            className="flat"
            style={{ marginLeft: ".6em" }}
            onClick={() => addToken(ethAddress)}
          >
            Add to wallet
          </button>
          <br />
          <code>
            <a
              target="_blank"
              href={`${getExplorerBaseUrl()}/contract/${ethAddress}`}
              rel="noreferrer"
            >
              {truncateAddress(ethAddress)}
            </a>
          </code>
        </h3>
      )}
    </>
  )
}
