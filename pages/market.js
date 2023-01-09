import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import Resell from '../engine/Resell.json';
import MAIA from '../engine/MAIA.json'
import { Card, Button, Col, Row, Container, Text, Grid, Input, useTheme, Spacer, Image } from '@nextui-org/react';
import { nftresell, nftcollection, nftcreator } from '../engine/configuration';
import { Alchemy, Network } from "alchemy-sdk";
import { toast } from 'react-toastify';
import { useAccount, useNetwork, useSigner } from 'wagmi'


export default function Sell(props) {
  const { theme } = useTheme()

  const { address, isConnected } = useAccount()
  const { chain } = useNetwork()
  const { data: signer, isError, isLoading } = useSigner()

  const [nfts, getNfts] = useState([])
  const [loaded, awaitLoading] = useState('not-loaded')
  const [resalePrice, updateresalePrice] = useState({ price: '' })

  var alchemysettings = {
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY,
    network: Network.MATIC_MAINNET,
  }
  //check connection before querying - LyghtC0de
  useEffect(() => {
    if (isConnected) {
      getAlchemyNFTs()
      console.log("Connected to " + chain.name)
    }

  }, [getNfts])

  async function getAlchemyNFTs() {
    try {
      const alchemy = new Alchemy(alchemysettings);

      // Chigag Network Logic -LyghtC0de
      let network = chain.name;
      console.log("Connected network is: " + chain.name);
      if (network === 'Polygon') {
        console.log("Retrieving NFT's from Alchemy...")
        // Alchemy Logic - LyghtC0de
        const mintedNfts = await alchemy.nft.getNftsForOwner(address);
        var itemArray = [];
        console.log(mintedNfts)
        for (const nft of mintedNfts.ownedNfts) {
          let contractaddr = nft.contract.address;
          let token = nft.tokenId;
          let collection = nftcollection.toLowerCase();
          if (contractaddr === collection) {
            const response = await alchemy.nft.getNftMetadata(
              contractaddr,
              token
            )
            await new Promise((r) => setTimeout(r, 1000));
            let name = response.title;
            let imagePath = response.rawMetadata.image;
            if (imagePath == undefined) {
              console.log("");
            } else {
              let img = imagePath.replace("ipfs://", "https://ipfs.io/ipfs/");
              let desc = response.description;
              alchemy.nft.getContractMetadata(contractaddr).then((result) => {
                let nftdata = {
                  name: name,
                  img: img,
                  tokenId: token,
                  desc: desc,
                  contract: result.name,
                };
                itemArray.push(nftdata);
              });
            }
          }
          let creator = nftcreator.toLowerCase();
          if (contractaddr === creator) {
            const response = await alchemy.nft.getNftMetadata(
              contractaddr,
              token
            )
            console.log(response)
            await new Promise((r) => setTimeout(r, 1000));
            let name = response.title;
            let imagePath = response.rawMetadata.image;
            if (imagePath == undefined) {
              console.log("");
            } else {
              let img = imagePath.replace("ipfs://", "https://ipfs.io/ipfs/");
              let desc = response.description;
              alchemy.nft.getContractMetadata(contractaddr).then((result) => {
                let nftdata = {
                  name: name,
                  img: img,
                  tokenId: token,
                  desc: desc,
                  contract: result.name,
                };
                itemArray.push(nftdata);
              });
            }
          }
        }
        await new Promise((r) => setTimeout(r, 1000));
        getNfts(itemArray);
        awaitLoading("loaded");

      }
      else {
        toast.error("Switch to Polygon");
      }

    } catch (error) {
      toast.error(error.reason);

    }

  }

  if (loaded === "loaded" && !nfts.length)
    return (
      <div>
        <Spacer></Spacer>
        <Container display='flex' justify='center' alignContent='center' md="true">

          <Row justify='center'>
            <Image src="ahau.png" style={{ maxWidth: '77px', marginRight: '0px' }} />
          </Row>
          <Row display='flex' justify='center' alignContent='center'>
            <Col css={{ size: "$50", paddingLeft: "$10", paddingTop: "$1" }}>
              <Card css={{ p: "$3", backgroundColor: "$red200", boxShadow: '0px 0px 4px #f2e900' }}>
                <Card css={{ p: "$3", marginTop: '$1', backgroundColor: "$black" }}>
                  <Row display='flex' justify='center' alignContent='center'>
                    <Button
                      size="sm"
                      color="gradient"
                      onPress={getAlchemyNFTs}
                      css={{ marginRight: '4px' }}

                    >
                      Refresh NFTs
                    </Button>
                  </Row>
                </Card>
              </Card>
            </Col>
          </Row>
          <Text h4>No NFT's Found on Wallet!</Text>
        </Container>
      </div>
    );

  return (
    <div>
      <Spacer></Spacer>
      <Container display='flex' justify='center' alignContent='center' md="true">
        <Row justify='center'>
          <Image src="ahau.png" style={{ maxWidth: '77px', marginRight: '0px' }} />
        </Row>
        <Row display='flex' justify='center' alignContent='center'>
          <Col css={{ size: "$50", paddingLeft: "$10", paddingTop: "$1" }}>
            <Card css={{ p: "$3", backgroundColor: "$black", boxShadow: '0px 0px 4px #ffffff' }}>
              <Card css={{ p: "$3", marginTop: '$1', backgroundColor: "$black" }}>
                <Row display='flex' justify='center' alignContent='center'>
                </Row>
                <Row display='flex' justify='center' alignContent='center'>
                  <Button
                    size="sm"
                    color="gradient"
                    onPress={getAlchemyNFTs}
                    css={{ marginRight: '4px' }}

                  >
                    Refresh NFTs
                  </Button>
                </Row>
              </Card>
            </Card>
          </Col>
        </Row>
        <Row>
          <Grid.Container display='flex' justify='center' alignContent='center' gap={3}>
            {nfts.map((nft, i) => {
              async function executeRelist() {
                const { price } = resalePrice;
                if (!price) return;
                try {
                  relistNFT();
                } catch (error) {
                  console.log("Transaction Failed", error);
                }
              }
              async function relistNFT() {
                const price = ethers.utils.parseUnits(
                  resalePrice.price,
                  "ether"
                );
                const contractnft = new ethers.Contract(
                  nftcollection,
                  MAIA,
                  signer
                )
                const checkapproved = await contractnft.isApprovedForAll(address, nftresell)
                if (checkapproved === true) {
                  let contract = new ethers.Contract(nftresell, Resell, signer);
                  let listingFee = await contract.getListingFee();
                  listingFee = listingFee.toString();
                  let transaction = await contract.listSale(nft.tokenId, price, {
                    value: listingFee,
                  })
                  await transaction.wait();
                  getAlchemyNFTs();
                }
                else {
                  let approval = await contractnft.setApprovalForAll(nftresell, true);
                  await approval.wait()
                  let contract = new ethers.Contract(nftresell, Resell, signer);
                  let listingFee = await contract.getListingFee();
                  listingFee = listingFee.toString();
                  let transaction = await contract.listSale(nft.tokenId, price, {
                    value: listingFee,
                  });
                  await transaction.wait();
                  getAlchemyNFTs();
                }
              }
              return (
                <Grid key={i}>
                  <Card
                    isHoverable
                    css={{ mw: "240px", marginRight: "$1" }}
                    variant="shadow"
                    key={i}
                    value={i}
                  >
                    <Card.Image src='whoami.jpeg' />
                    <Card.Body md="true">
                      <h5
                        style={{
                          color: "#9D00FF",
                          fontFamily: "Genos",
                        }}
                      >
                        {nft.contract}
                      </h5>
                      <Text h6>
                        {nft.name} Token-{nft.tokenId}
                      </Text>
                      <Text css={{ fontSize: '$sm' }}>{nft.desc}</Text>
                      <Input
                        size="sm"

                        css={{
                          marginTop: "$2",
                          maxWidth: "120px",
                          marginBottom: "$2",
                          border: "$blue500",
                        }}
                        style={{
                          color: "white",
                          fontFamily: "Genos",
                          fontWeight: "bolder",
                          fontSize: "15px",
                        }}
                        aria-label="Set your price"
                        placeholder="Set your Price"
                        onChange={(e) =>
                          updateresalePrice({
                            ...resalePrice,
                            price: e.target.value,
                          })
                        }
                      />
                      <Button onPress={executeRelist}>Resale NFT</Button>
                    </Card.Body>
                  </Card>
                </Grid>
              );
            })}
          </Grid.Container>
        </Row>
      </Container>
    </div>
  )
}

