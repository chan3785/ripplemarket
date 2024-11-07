import { CHAIN_NAMESPACES } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { getDefaultExternalAdapters } from "@web3auth/default-evm-adapter";
import { Web3Auth } from "@web3auth/modal";

const clientId =
  "BIDKZ3f2QOYeATbQ-6K3z9MT836zvCzLf0mh35ZB930bQpzcl4w6KJ--okRFMr7vxL5XBxK38I6nsyVIFrri3P8";

  const chainConfig = {
    chainId: "0xaa36a7",
    displayName: "Ethereum Sepolia",
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    tickerName: "Ethereum Sepolia",
    ticker: "ETH",
    rpcTarget: "https://rpc.ankr.com/eth_sepolia",
    blockExplorerUrl: "https://sepolia.etherscan.io",
    logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
  };

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
});

export const trnWeb3auth = new Web3Auth({
  clientId,
  uiConfig: {
    logoLight: "https://web3auth.io/images/web3auth-logo.svg",
    logoDark: "https://web3auth.io/images/web3auth-logo---Dark.svg",
  },
  privateKeyProvider,
  web3AuthNetwork: "sapphire_devnet",
});

const adapters = await getDefaultExternalAdapters({ options: web3AuthOptions });

adapters.forEach((adapter) => {
  web3auth.configureAdapter(adapter);
});