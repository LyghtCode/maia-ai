import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Resell from '../engine/Resell.json';
import MAIA from '../engine/MAIA.json';
import Market from '../engine/Market.json';
import axios from 'axios';
import { Grid, Card, Text, Button, Row, Container, Spacer, Image } from '@nextui-org/react';
import { nftcreator, marketcontract, nftresell } from '../engine/configuration';
import { Alchemy, Network } from "alchemy-sdk";
import confetti from 'canvas-confetti';
import { toast } from 'react-toastify';
import { useAccount, useNetwork, useSigner } from 'wagmi'



export default function Home(props) {
  const [resellnft, getResellNfts] = useState([])
  const [marketnft, getMarketNfts] = useState([])

  // wagmi logic on load - LyghtC0de
  const { address, isConnected } = useAccount()
  const { chain } = useNetwork()
  const { data: signer, isError, isLoading } = useSigner()

  var alchemysettings = {
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY,
    network: Network.MATIC_MAINNET,
  }

  useEffect(() => {
    if (isConnected) {
      loadAlchemyResell()
    }
    // loadAlchemyNewNFTs() [getMarketNfts]
  }, [getResellNfts])

  const handleConfetti = () => {
    confetti();
  };
  const router = useRouter()

  /*
  Chigag - Alchemy Listings Functions
  */
  async function loadAlchemyResell() {
    try {
      //Needs separate Wallet provider since this requires signer from ReSell contract owner - LyghtC0de
      // Careful with exported keys
      const alchemy = new Alchemy(alchemysettings);
      const provider = await alchemy.config.getProvider();
      const wallet = new ethers.Wallet(process.env.NEXT_PUBLIC_RESELL_OWNER_WALLET, provider);
      const contract = new ethers.Contract(nftresell, Resell, wallet);
      const itemArray = [];
      const mintedNfts = await alchemy.nft.getNftsForOwner(nftresell);
      console.log(mintedNfts);
      for (const nft of mintedNfts.ownedNfts) {
        let token = nft.tokenId;
        let rawprice = contract.getPrice(token);
        let imagePath = nft.media[0].gateway;
        if (imagePath == undefined) {
          console.log("")
        } else {
          Promise.resolve(rawprice).then((_hex) => {
            let img = imagePath.replace("ipfs://", "https://ipfs.io/ipfs/")
            let desc = nft.description
            var salePrice = Number(_hex)
            let formatprice = ethers.utils.formatUnits(salePrice.toString(), "ether");
            let nftdata = {
              name: nft.rawMetadata.name,
              image: img,
              tokenId: token,
              description: desc,
              value: formatprice,
            }
            itemArray.push(nftdata)
          })
        }
      }
      await new Promise(r => setTimeout(r, 3000));
      getResellNfts(itemArray);

    } catch (error) {
      toast.error(error.reason);

    }

  }

  async function loadAlchemyNewNFTs() {
    //Needs separate Wallet provider instance since this requires signer from NFT Market contract owner - LyghtC0de
    // Careful with exported keys
    const alchemy = new Alchemy(alchemysettings)
    const provider = await alchemy.config.getProvider()
    const wallet = new ethers.Wallet(process.env.NEXT_APP_RESELL_CONTRACT_OWNER_KEY, provider)
    const tokenContract = new ethers.Contract(nftcreator, MAIA, wallet)
    const marketContract = new ethers.Contract(marketcontract, Market, wallet)
    const data = await marketContract.getAvailableNft()
    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
      }
      return item
    }))
    getMarketNfts(items)
  }

  async function buyMarketNfts(nft) {
    const contract = new ethers.Contract(marketcontract, Market, signer)
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
    const transaction = await contract.n2DMarketSale(nftcreator, nft.tokenId, {
      value: price
    })
    await transaction.wait()
    loadAlchemyNewNFTs();
  }


  return (
    <div>
      <Spacer></Spacer>
      <Container display='flex' justify='center' alignContent='center' xs css={{ marginBottom: "$3" }}>
        <Row justify='center'>
          <Image src="bakab.png" style={{ maxWidth: '77px', marginRight: '0px' }} />
        </Row>
      </Container>
      {/* </Container> */}

      <Container display='flex' justify='center' alignContent='center' sm="true">
        <Grid.Container display='flex' justify='center' alignContent='center' gap={1}>
          {resellnft.slice(0, 9).map((nft, id) => {
            async function buylistNft() {

              // try {
              const rawBuy = nft.value
              const cost = rawBuy * 1e18

              // Chigag Network Logic - LyghtC0de
              let network = chain.name;
              console.log("Connected network is: " + chain.name);
              if (network === 'Polygon') {
                //Buy Resell Logic
                const contract = new ethers.Contract(nftresell, Resell, signer)
                const transaction = await contract.buyNft(nft.tokenId, {
                  value: cost.toString(),
                })
                await transaction.wait()
                router.push("/gallery")
              } else {
                toast.error("Switch to Polygon")
              }

            }
            return (
              <Grid key={id} xs={3}>
                <Card
                  isHoverable
                  key={id}
                  style={{ boxShadow: "0px 0px 5px #f2e900" }}
                  variant="shadow"
                >
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      fontFamily: "Genos",
                      fontWeight: "300",
                      fontSize: "20px",
                      marginLeft: "3px",
                    }}
                  >
                    {nft.name} Token-{nft.tokenId}
                  </Text>
                  <Card.Body css={{ p: 0 }}>
                    <Card.Image
                      style={{ maxWidth: "150px", borderRadius: "6%" }}
                      src='whoami.jpeg'
                    />
                  </Card.Body>
                  <Card.Footer css={{ justifyItems: "flex-start" }}>
                    <Row wrap="wrap" justify="space-between" align="center">
                      <Text>{nft.description}</Text>
                      <p style={{ fontSize: "30px" }}>
                        {nft.value}{" "}
                        <img
                          src="matic.svg"
                          style={{
                            width: "40px",
                            height: "35px",
                          }}
                        />
                      </p>
                      <Button
                        color="gradient"
                        style={{ fontSize: "20px" }}
                        onPress={() => handleConfetti(buylistNft(nft))}
                      >
                        Buy Me
                      </Button>
                    </Row>
                  </Card.Footer>
                </Card>
              </Grid>
            );
          })}
        </Grid.Container>
      </Container>
      <Container sm="true">
        <Grid.Container display='flex' justify='center' alignContent='center' gap={1}>
          {marketnft.slice(0, 9).map((nft, i) => (
            <Grid key={i} xs={3}>
              <Card
                style={{ boxShadow: "0px 0px 5px #ffffff" }}
                variant="bordered"
                key={i}
              >
                <Text
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    fontFamily: "Genos",
                    fontWeight: "300",
                    fontSize: "20px",
                    marginLeft: "3px",
                  }}
                >
                  {nft.name}
                </Text>
                <Card.Body css={{ p: 0 }}>
                  <Card.Image
                    style={{ maxWidth: "150px", borderRadius: "6%" }}
                    src={nft.image}
                  />
                </Card.Body>
                <Card.Footer css={{ justifyItems: "flex-start" }}>
                  <Row wrap="wrap" justify="space-between" align="center">
                    <Text wrap="wrap">{nft.description}</Text>
                    <Text style={{ fontSize: "30px" }}>
                      {nft.price}
                      <img
                        src="matic.svg"
                        style={{
                          width: "40px",
                          height: "35px",
                        }}
                      />
                    </Text>
                    <Button
                      color="gradient"
                      style={{ fontSize: "20px" }}
                      onClick={() => handleConfetti(buyMarketNfts(nft))}
                    >
                      Buy
                    </Button>
                  </Row>
                </Card.Footer>
              </Card>
            </Grid>
          ))}
        </Grid.Container>
      </Container>
    </div>
  );
}