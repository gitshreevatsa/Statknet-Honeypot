import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultWallets,
  RainbowKitProvider,
  Chain,
} from "@rainbow-me/rainbowkit";
import type { AppProps } from "next/app";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import {
  arbitrum,
  goerli,
  mainnet,
  optimism,
  polygon,
  base,
  zora,
} from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

const taikoChain: Chain = {
  id: 167004,
  name: "Taiko",
  network: "taiko",
  iconUrl: "https://chainlist.org/unknown-logo.png",
  iconBackground: "#fff",
  nativeCurrency: {
    decimals: 18,
    name: "Taiko",
    symbol: "TAIKO",
  },
  rpcUrls: {
    public: { http: ["https://api.avax.network/ext/bc/C/rpc"] },
    default: {
      http: ["https://rpc.a2.taiko.xyz(opens in a new tab)"],
    },
  },
  blockExplorers: {
    default: { name: "Taiko", url: "https://explorer.a2.taiko.xyz/" },
    etherscan: { name: "Taiko", url: "https://explorer.a2.taiko.xyz/" },
  },
  testnet: false,
};

const celoChain: Chain = {
  id: 44787,
  name: "Celo Alfajores Testnet",
  network: "alfajores",
  iconUrl: "https://icons.llamao.fi/icons/chains/rsz_celo.jpg",
  iconBackground: "#fff",
  nativeCurrency: {
    decimals: 18,
    name: "Celo Alfajores Testnet",
    symbol: "CELO",
  },
  rpcUrls: {
    public: { http: ["https://api.avax.network/ext/bc/C/rpc"] },

    default: {
      http: ["https://alfajores-forno.celo-testnet.org"],
    },
  },
  // blockExplorers: {
  //   default: { name: 'Taiko', url: 'https://explorer.a2.taiko.xyz/' },
  //   etherscan: { name: 'Taiko', url: 'https://explorer.a2.taiko.xyz/' },
  // },
  testnet: true,
};

const fvmChain: Chain = {
  id: 3141,
  name: "Filecoin Hyperspace Testnet",
  network: "hyperspace",
  iconUrl: "https://icons.llamao.fi/icons/chains/rsz_filecoin.jpg",
  iconBackground: "#fff",
  nativeCurrency: {
    decimals: 18,
    name: "Filecoin Hyperspace Testnet",
    symbol: "tFIL",
  },
  rpcUrls: {
    public: { http: ["https://api.avax.network/ext/bc/C/rpc"] },

    default: {
      http: ["https://filecoin-hyperspace.chainstacklabs.com/rpc/v1"],
    },
  },
  testnet: true,
};

const mantleChain: Chain = {
  id: 5001,
  name: "Mantle",
  network: "mantle",
  iconUrl: "https://chainlist.org/unknown-logo.png",
  iconBackground: "#fff",
  nativeCurrency: {
    decimals: 18,
    name: "Mantle Testnet",
    symbol: "BIT",
  },
  rpcUrls: {
    public: { http: ["https://api.avax.network/ext/bc/C/rpc"] },

    default: {
      http: ["https://rpc.testnet.mantle.xyz"],
    },
  },
  // blockExplorers: {
  //   default: { name: 'Taiko', url: 'https://explorer.a2.taiko.xyz/' },
  //   etherscan: { name: 'Taiko', url: 'https://explorer.a2.taiko.xyz/' },
  // },
  testnet: true,
};

const scrollChain: Chain = {
  id: 534353,
  name: "Scroll",
  network: "scroll",
  iconUrl: "https://chainlist.org/unknown-logo.png",
  iconBackground: "#fff",
  nativeCurrency: {
    decimals: 18,
    name: "Scroll Alpha Testnet",
    symbol: "SCROLL",
  },
  rpcUrls: {
    public: { http: ["https://api.avax.network/ext/bc/C/rpc"] },

    default: {
      http: ["https://alpha-rpc.scroll.io/l2"],
    },
  },
  // blockExplorers: {
  //   default: { name: 'Taiko', url: 'https://explorer.a2.taiko.xyz/' },
  //   etherscan: { name: 'Taiko', url: 'https://explorer.a2.taiko.xyz/' },
  // },
  testnet: true,
};

// const minaChain: Chain = {
//   id: 167004,
//   name: 'Taiko',
//   network: 'taiko',
//   iconUrl: 'https://example.com/icon.svg',
//   iconBackground: '#fff',
//   nativeCurrency: {
//     decimals: 18,
//     name: 'Taiko',
//     symbol: 'TAIKO',
//   },
//   rpcUrls: {
//     default: {
//       http: ['https://rpc.a2.taiko.xyz(opens in a new tab)'],
//     },
//   },
//   blockExplorers: {
//     default: { name: 'Taiko', url: 'https://explorer.a2.taiko.xyz/' },
//     etherscan: { name: 'Taiko', url: 'https://explorer.a2.taiko.xyz/' },
//   },
//   testnet: false,
// };

const lineaChain: Chain = {
  id: 59140,
  name: "Linea",
  network: "linea",
  iconUrl: "https://chainlist.org/unknown-logo.png",
  iconBackground: "#fff",
  nativeCurrency: {
    decimals: 18,
    name: "Linea",
    symbol: "LINEA",
  },
  rpcUrls: {
    public: { http: ["https://api.avax.network/ext/bc/C/rpc"] },

    default: {
      http: ["https://rpc.goerli.linea.build"],
    },
  },
  // blockExplorers: {
  //   default: { name: 'Taiko', url: 'https://explorer.a2.taiko.xyz/' },
  //   etherscan: { name: 'Taiko', url: 'https://explorer.a2.taiko.xyz/' },
  // },
  testnet: true,
};

const neonChain: Chain = {
  id: 245022926,
  name: "Neon EVM Devnet",
  network: "neon",
  iconUrl: "https://chainlist.org/unknown-logo.png",
  iconBackground: "#fff",
  nativeCurrency: {
    decimals: 18,
    name: "Neon EVM Devnet",
    symbol: "NEON",
  },
  rpcUrls: {
    public: { http: ["https://proxy.devnet.neonlabs.org/solana"] },

    default: {
      http: ["https://proxy.devnet.neonlabs.org/solana"],
    },
  },
  // blockExplorers: {
  //   default: { name: 'Taiko', url: 'https://explorer.a2.taiko.xyz/' },
  //   etherscan: { name: 'Taiko', url: 'https://explorer.a2.taiko.xyz/' },
  // },
  testnet: true,
};

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    zora,
    taikoChain,
    celoChain,
    fvmChain,
    mantleChain,
    scrollChain,
    lineaChain,
    neonChain,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true" ? [goerli] : []),
  ],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "RainbowKit App",
  projectId: "e31cd04d28e87ef2aaaf58e7716dceb6",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
