import { AlchemyProvider } from '@ethersproject/providers'
import { ImmutableXClient } from '@imtbl/imx-sdk'
import { Wallet } from '@ethersproject/wallet'
import { requireEnvironmentVariable } from 'libs/utils'
import { LinkParams } from '@imtbl/imx-sdk'
import { ERC721TokenType } from '@imtbl/imx-sdk'

import env from '../config/client'

const provider = new AlchemyProvider(env.ethNetwork, env.alchemyApiKey);

(async (): Promise<void> => {
  const privateKey = requireEnvironmentVariable('OWNER_ACCOUNT_PRIVATE_KEY')

  const wallet = new Wallet(privateKey)
  const signer = wallet.connect(provider)

  const link = await ImmutableXClient.build({
    ...env.client,
    signer,
    enableDebug: true,
  })

  const payload: LinkParams.Transfer = {
    type: ERC721TokenType.ERC721, // Must be of type ERC721
    tokenId: "1", // the token ID
    tokenAddress: "0x1830f39bd168503A8c8090F1cA6af8Fa79e025FA", // the collection address / contract address this token belongs to
    to: "0x5f3E07793D75e8DaaAF13Fd7697eE2b01F7a4bed", // the wallet address this token is being transferred to
  }
  const response = await link.transfer(payload) // FIXME: maybe link should be instanciated differently?
  console.log("NFT transferred!", response)
})().catch(e => {
  console.log("Error", e)
  process.exit(1)
});