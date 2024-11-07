import { CHAIN_NAMESPACES } from "@web3auth/base";
import { XrplPrivateKeyProvider } from "@web3auth/xrpl-provider";
import { Web3Auth } from "@web3auth/modal";

const clientId =
  "BIDKZ3f2QOYeATbQ-6K3z9MT836zvCzLf0mh35ZB930bQpzcl4w6KJ--okRFMr7vxL5XBxK38I6nsyVIFrri3P8";

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.XRPL,
  chainId: "0x2",
  rpcTarget: "https://testnet-ripple-node.tor.us",
  wsTarget: "wss://s.altnet.rippletest.net",
  ticker: "XRP",
  logo: "https://web3auth.io/images/web3auth-logo.svg",
  tickerName: "XRPL",
  displayName: "xrpl testnet",
  blockExplorerUrl: "https://testnet.xrpl.org",
  clientId: "",
};

const privateKeyProvider = new XrplPrivateKeyProvider({
  config: { chainConfig },
});

export const web3auth = new Web3Auth({
  clientId,
  uiConfig: {
    logoLight: "https://web3auth.io/images/web3auth-logo.svg",
    logoDark: "https://web3auth.io/images/web3auth-logo---Dark.svg",
  },
  privateKeyProvider,
  web3AuthNetwork: "sapphire_devnet",
});
