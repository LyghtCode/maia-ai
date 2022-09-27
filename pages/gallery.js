import { useState, useEffect } from 'react';
import { Button, Col, Row, Container, Text, useTheme, Spacer, Image, Grid, Input } from '@nextui-org/react';
import 'sf-font';
import { Alchemy, Network } from "alchemy-sdk";
import { toast } from 'react-toastify';
import Masonry from '@mui/lab/Masonry';
import Card from '@mui/joy/Card';
import CardCover from '@mui/joy/CardCover';
import CardOverflow from '@mui/joy/CardOverflow';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import { useAccount, useNetwork } from 'wagmi'



export default function Gallery(props) {
  const { theme } = useTheme()

  const { address, isConnecting, isDisconnected, isConnected } = useAccount()
  const { chain } = useNetwork()


  const [nfts, getNfts] = useState([])
  const [loaded, awaitLoading] = useState('not-loaded')

  var alchemysettings = {
    apiKey: process.env.NEXT_APP_ALCHEMY_KEY,
    network: Network.MATIC_MAINNET,
  }

  useEffect(() => {
    if (isConnected) {
      getAlchemyNFTs()
      console.log("Connected to " + chain.name)
    }

  }, [getNfts])

  async function getAlchemyNFTs() {
    try {
      const alchemy = new Alchemy(alchemysettings);
      var itemArray = [];

      // Chigag Network Logic - LyghtC0de
      let network = chain.name;
      console.log("Connected network is: " + chain.name);
      if (network === 'Polygon') {
        console.log("Retrieving NFT's from Alchemy...")
        // Alchemy Logic - LyghtC0de
        const mintedNfts = await alchemy.nft.getNftsForOwner(address);
        console.log(mintedNfts)
        for (const nft of mintedNfts.ownedNfts) {
          let contractaddr = nft.contract.address;
          let token = nft.tokenId;
          let name = nft.title;
          let imagePath = nft.media[0].gateway;
          let nftName = nft.rawMetadata.name;
          let desc = nft.description;

          // Chigag retrieve Metadata - LyghtC0de
          if (contractaddr) {
            if (imagePath == undefined) {
              console.log("");
            } else {
              // Handle broken images - LyghtC0de
              let img = imagePath.replace("ipfs://", "https://ipfs.io/ipfs/");
              //Retrieve Contract name - LyghtC0de
              alchemy.nft.getContractMetadata(contractaddr).then((result) => {
                let nftdata = {
                  name: name,
                  img: img,
                  tokenId: token,
                  desc: desc,
                  nftName: nftName,
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

  if (isDisconnected)
    return (
      <div>
        <Spacer></Spacer>
        <Container display='flex' justify='center' aligncontent='center' md="true">
          <Row justify='center'>
            <Image src="tree.png" style={{ maxWidth: '77px', marginRight: '0px' }} />
          </Row>
          <Row display='flex' justify='center' aligncontent='center'>
            <Col display='flex' justify='center' aligncontent='center' css={{ size: "$50", paddingLeft: "$10", paddingTop: "$1" }}>
              <Card display='flex' justify='center' aligncontent='center' css={{ p: "$3", backgroundColor: "$blue200", boxShadow: '0px 0px 4px #ffffff' }}>
                <Card display='flex' justify='center' aligncontent='center' css={{ p: "$3", marginTop: '$1' }}>
                  <Text h5 id="wallet-address" css={{ color: "#39FF14" }} />
                  <Row display='flex' justify='center' aligncontent='center'>
                    {/* <Button
                    size="sm"
                    color="gradient"
                    onPress={getAlchemyNFTs}
                    css={{ marginRight: '4px' }}

                  >
                    Retrieve NFTs
                  </Button> */}
                  </Row>
                </Card>
              </Card>
            </Col>
          </Row>
          <Text style={{
            color: theme.colors.secondary.value,
          }} h4>No NFT's Found! Please Connect Wallet</Text>
        </Container>
      </div>
    );

  return (
    <div>
      <Spacer></Spacer>
      <Container display='flex' justify='center' aligncontent='center' md="true">
        <Row justify='center'>
          <Image src="tree.png" style={{ maxWidth: '77px', marginRight: '0px' }} />
        </Row>
        <Row display='flex' justify='center' aligncontent='center'>
          <Col css={{ size: "$50", paddingLeft: "$10", paddingTop: "$1" }}>
            <Card css={{ p: "$3", backgroundColor: "$black", boxShadow: '0px 0px 4px #f2e900' }}>
              <Card display='flex' justify='center' aligncontent='center' css={{ backgroundColor: "$black", p: "$3", marginTop: '$1' }}>
                <Row display='flex' justify='center' aligncontent='center'>
                </Row>
                <Row display='flex' justify='center' aligncontent='center'>
                  <Button
                    size="sm"
                    color="gradient"
                    onPress={getAlchemyNFTs}
                    css={{ marginRight: '4px' }}

                  >
                    <Text style={{
                      color: theme.colors.primaryLightContrast.value,
                    }}>Refresh NFTs</Text>
                  </Button>
                </Row>
              </Card>
            </Card>
          </Col>
        </Row>
        <Row display='flex' justify='center' aligncontent='center'>

          <Masonry columns={3} spacing={.3}>
            {nfts.map((nft, i) => {
              return (

                <div key={i}>


                  {nft.img.split('.').pop() === 'mp4' ?
                    <Card key={i}
                      value={i} sx={{ minHeight: 226, flexGrow: 1 }}>
                      <CardCover>
                        <video
                          autoPlay
                          loop
                          muted
                          poster="alchemyblue.png"
                        >
                          <source
                            src={nft.img}
                            type="video/mp4"
                          />
                        </video>
                      </CardCover>
                      <CardContent sx={{ justifyContent: 'center', gap: 0 }}>
                        <Typography
                          fontWeight="xsm"
                          textColor="#7828C8"
                          level="h6"
                          mt={{ xs: 12, sm: 18 }}
                        >
                          {/* {nft.contract} */}
                        </Typography>
                      </CardContent>
                    </Card>

                    :
                    <Card key={i}
                      value={i} sx={{ flexGrow: 1 }}>
                      <CardOverflow>
                        <img
                          src={nft.img}
                          srcSet={nft.img}
                          alt={nft.contract}
                        />
                        {/* <Typography
                            fontWeight="xsm"
                            textColor="#7828C8"
                          >
                            {nft.contract}
                          </Typography> */}
                      </CardOverflow>
                    </Card>
                  }



                  {/* <Typography
                          level="h6"
                          fontWeight="lg"
                          textColor="#"
                          mt={{ xs: 12, sm: 18 }}
                        >
                          {nft.contract}
                        </Typography> */}

                  {/* <Card
                    isHoverable
                    css={{ mw: "240px", marginRight: "$1" }}
                    variant="bordered"
                    key={i}
                    value={i}
                  >
                    <Card.Image src={nft.img} />
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
                        {nft.nftName}
                      </Text> */}
                  {/* Chigag Description is too long for some NFTs */}
                  {/* <Text css={{fontSize:'$sm'}}>{nft.desc}</Text> */}
                  {/* Chigag Hide Resell Price Input for viewer */}
                  {/* <Input
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
                        /> */}
                  {/* </Card.Body>
                  </Card> */}
                </div>
              );
            })}
          </Masonry>
        </Row>
      </Container>
    </div>

  )
}

