import { createTheme, NextUIProvider } from "@nextui-org/react";
import 'sf-font';
import { Text, Navbar, Image, Link } from '@nextui-org/react';
import Footer from './footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Typography from '@mui/joy/Typography';
import '@rainbow-me/rainbowkit/styles.css';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import {
  getDefaultWallets,
  RainbowKitProvider,
  midnightTheme
} from '@rainbow-me/rainbowkit';
import {
  chain,
  configureChains,
  createClient,
  WagmiConfig,
} from 'wagmi';
import { infuraProvider } from 'wagmi/providers/infura';
import { publicProvider } from 'wagmi/providers/public';

const { chains, provider } = configureChains(
  [chain.polygon],
  [
    infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_KEY }),
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'LyghtC0des Marketplace',
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})

const theme = createTheme({
  type: 'dark',
  theme: {
    fontFamily: 'Space Grotesk',
    colors: {
      primaryLight: '#00ff9f',
      primaryLightHover: '#00b8ff',
      primaryLightActive: '#d600ff',
      primaryLightContrast: '#f2e900',
      primary: '#00ff9f',
      primaryBorder: '#00b8ff',
      primaryBorderHover: '#d600ff',
      primarySolidHover: '$green700',
      primarySolidContrast: '#001eff',
      primaryShadow: '#f2e900',
      transparent: '#00000000',
      secondary: '#bd00ff',

      gradient: 'linear-gradient(112deg, $blue100 -25%, $green500 -10%, $purple300 90%)',
      link: '#5E1DAD',

      myColor: '#00000030'

    },
    space: {},
    fonts: {
      sans: 'Space Grotesk, sans-serif;'
    }
  }
})
const collapseItems = [
  "Mint",
  "Create",
  "Market",
  "Gallery",
];

function MyApp({ Component, pageProps }) {
  //******LyghtC0des NFT Marketplace******//

  return (
    // the magic sauce
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider coolMode theme={midnightTheme({
        accentColor: '#bd00ff',
        borderRadius: 'small',
        overlayBlur: 'small',

      })}
        modalSize="compact" chains={chains}>
        {/* Next U.I. */}
        <NextUIProvider theme={theme}>
          <Navbar isBordered variant="floating">
            {/* Branding */}
            <Navbar.Brand>
              <Navbar.Toggle aria-label="toggle navigation" />
              {/* <Image src="chakra.png" style={{ maxWidth: '66px', marginRight: '0px' }}  ></Image> */}
              {/* <Text color="inherit" hideIn="xs" size={36} css={{ fontWeight: "300", textShadow: '0px 0px 3px #f2e900' }}>
                Clubhouse
              </Text> */}
            </Navbar.Brand>
            {/* Nav Menu */}
            <Navbar.Content enableCursorHighlight activeColor='secondary' hideIn="xs" variant="solid-rounded">

              <Navbar.Link style={{ fontFamily: 'Space Grotesk', fontSize: '44px', color: '#00ff9f', fontWeight: '200' }} href="/"><Image src="chakra.png" style={{ maxWidth: '44px', marginRight: '0px' }}  ></Image></Navbar.Link>
              {/* <Navbar.Link style={{fontFamily:'SF Pro Display', fontSize:'25px', color:'white', fontWeight:'500'}} href="/create">
              Create
            </Navbar.Link> */}
              {/* <Navbar.Link style={{ fontFamily: 'Space Grotesk', fontSize: '33px', color: '#00ff9f', fontWeight: '260' }} href="/fiat">Fiat</Navbar.Link> */}
              <Navbar.Link style={{ fontFamily: 'Space Grotesk', fontSize: '44px', color: '#00ff9f', fontWeight: '260' }} href="/mint"><Image src="osram.png" style={{ maxWidth: '44px', marginRight: '0px' }}  ></Image></Navbar.Link>
              <Navbar.Link style={{ fontFamily: 'Space Grotesk', fontSize: '44px', color: '#00ff9f', fontWeight: '260' }} href="/create"><Image src="mmere.png" style={{ maxWidth: '44px', marginRight: '0px' }}  ></Image></Navbar.Link>
              <Navbar.Link style={{ fontFamily: 'Space Grotesk', fontSize: '44px', color: '#00ff9f', fontWeight: '260' }} href="/market"><Image src="bese.png" style={{ maxWidth: '44px', marginRight: '0px' }}  ></Image></Navbar.Link>
              <Navbar.Link style={{ fontFamily: 'Space Grotesk', fontSize: '44px', color: '#00ff9f', fontWeight: '260' }} href="/gallery"><Image src="tree.png" style={{ maxWidth: '44px', marginRight: '0px' }}  ></Image></Navbar.Link>
            </Navbar.Content>
            {/* Mobile Menu */}
            <Navbar.Collapse>
              {collapseItems.map((item, index) => (
                <Navbar.CollapseItem key={item}>
                  <Link
                    color="#f2e900"
                    css={{
                      minWidth: "66%",
                    }}
                    href={"/" + item.toLowerCase()}
                  >
                    {item}
                  </Link>
                </Navbar.CollapseItem>
              ))}
            </Navbar.Collapse>
            {/* Rainbow Kit Button */}
            <ConnectButton label='Knnxt' showBalance={false} accountStatus={{
              smallScreen: 'avatar',
              largeScreen: 'full',
            }} />
          </Navbar>
          {/* Main Site Pages */}
          <Component {...pageProps} />
          {/* Footer Starts Here */}
          <Footer>
            <Footer />
          </Footer>
          {/* Toastsss P: */}
          <ToastContainer theme='dark' />
        </NextUIProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
