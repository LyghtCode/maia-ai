import { createTheme, NextUIProvider } from "@nextui-org/react";
import { Navbar, Image, Link } from '@nextui-org/react';
import Footer from './footer';
import { ToastContainer, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
import { motion, AnimatePresence, LazyMotion, domAnimation } from 'framer-motion';
import "@fontsource/genos"


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
    fontFamily: 'Genos',
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
      sans: 'Genos, sans-serif;'
    }
  }
})
const collapseItems = [
  "Mint",
  "Create",
  "Market",
  "Gallery",
];

function MyApp({ Component, pageProps, router }) {
  // const router = useRouter();
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

              <Navbar.Link style={{ fontFamily: 'Genos', fontSize: '44px', color: '#00ff9f', fontWeight: '200' }} href="/"><Image src="chakra.png" style={{ maxWidth: '44px', marginRight: '0px' }}></Image></Navbar.Link>
              {/* <Navbar.Link style={{fontFamily:'SF Pro Display', fontSize:'25px', color:'white', fontWeight:'500'}} href="/create">
              Create
            </Navbar.Link> */}
              {/* <Navbar.Link style={{ fontFamily: 'Genos', fontSize: '33px', color: '#00ff9f', fontWeight: '260' }} href="/fiat">Fiat</Navbar.Link> */}
              <Navbar.Link style={{ fontFamily: 'Genos', fontSize: '44px', color: '#00ff9f', fontWeight: '260' }} href="/mint"><Image src="osram.png" style={{ maxWidth: '44px', marginRight: '0px' }} /></Navbar.Link>
              <Navbar.Link style={{ fontFamily: 'Genos', fontSize: '44px', color: '#00ff9f', fontWeight: '260' }} href="/create"><Image src="mmere.png" style={{ maxWidth: '44px', marginRight: '0px' }} /></Navbar.Link>
              <Navbar.Link style={{ fontFamily: 'Genos', fontSize: '44px', color: '#00ff9f', fontWeight: '260' }} href="/market"><Image src="bese.png" style={{ maxWidth: '44px', marginRight: '0px' }} /></Navbar.Link>
              <Navbar.Link style={{ fontFamily: 'Genos', fontSize: '44px', color: '#00ff9f', fontWeight: '260' }} href="/gallery"><Image src="tree.png" style={{ maxWidth: '44px', marginRight: '0px' }} /></Navbar.Link>
            </Navbar.Content>
            {/* Mobile Menu */}
            <Navbar.Collapse>

              <Navbar.CollapseItem>
                <Image src="chakra.png" style={{ maxWidth: '33px', marginRight: '0px' }} />
                <Link
                  color="#f2e900"
                  css={{
                    minWidth: "66%",
                    fontSize: '33px',
                  }}
                  href="/"
                >Home
                </Link>
              </Navbar.CollapseItem>
              <Navbar.CollapseItem>
                <Image src="osram.png" style={{ maxWidth: '33px', marginRight: '0px' }} />
                <Link
                  color="#f2e900"
                  css={{
                    minWidth: "66%",
                    fontSize: '33px',
                  }}
                  href="/mint"
                >Mint
                </Link>
              </Navbar.CollapseItem>
              <Navbar.CollapseItem>
                <Image src="mmere.png" style={{ maxWidth: '33px', marginRight: '0px' }} />
                <Link
                  color="#f2e900"
                  css={{
                    minWidth: "66%",
                    fontSize: '33px',
                  }}
                  href="/create"
                >Create
                </Link>
              </Navbar.CollapseItem>
              <Navbar.CollapseItem>
                <Image src="bese.png" style={{ maxWidth: '33px', marginRight: '0px' }} />
                <Link
                  color="#f2e900"
                  css={{
                    minWidth: "66%",
                    fontSize: '33px',
                  }}
                  href="/mint"
                >Market
                </Link>
              </Navbar.CollapseItem>
              <Navbar.CollapseItem>
                <Image src="tree.png" style={{ maxWidth: '33px', marginRight: '0px' }} />
                <Link
                  color="#f2e900"
                  css={{
                    minWidth: "66%",
                    fontSize: '33px',
                  }}
                  href="/gallery"
                >Gallery
                </Link>
              </Navbar.CollapseItem>

            </Navbar.Collapse>
            {/* Rainbow Kit Button */}
            <ConnectButton label='Knnxt' showBalance={false} accountStatus={{
              smallScreen: 'avatar',
              largeScreen: 'full',
            }} />
          </Navbar>
          {/* Animation Settings */}
          <LazyMotion features={domAnimation}>
            <AnimatePresence mode="wait"
            >
              <motion.div className="page-wrap" key={router.route} initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
              >
                {/* Main Site Pages */}
                <Component {...pageProps} key={router.route} />
              </motion.div>
            </AnimatePresence>
          </LazyMotion>
          {/* Footer Starts Here */}
          <Footer />
          {/* Toastsss P: */}
          <ToastContainer transition={Zoom} autoClose={7777} theme='dark' />
        </NextUIProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
  