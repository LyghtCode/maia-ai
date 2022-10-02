import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Web3Modal from "web3modal";
import NFT from '../engine/MAIA.json';
import Market from '../engine/Market.json';
import { nftcreator, marketcontract } from '../engine/configuration';
import { Card, Button, Input, Col, Row, Spacer, Container, Text, Image } from '@nextui-org/react';
import 'sf-font'
import client from '../engine/configuration';
import { toast } from 'react-toastify';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function Create() {
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [fileUrl, setFileUrl] = useState(null)
  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })

  useEffect(() => {
  }, [])

  const router = useRouter();
  const { name, description, price } = formInput;

  const handleSubmit = async (e) => {

    e.preventDefault();
    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: description,
      }),
    });
    let prediction = await response.json();
    toast.info("MAIA is creating your NFT...");
    console.log('prediction response is ' + JSON.stringify(prediction));
    if (response.status !== 201) {
      setError(prediction.detail);
      return;
    }
    setPrediction(prediction);

    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed"
    ) {
      await sleep(1000);
      const response = await fetch("/api/predictions/" + prediction.id);
      prediction = await response.json();
      console.log('Second prediction response is ' + JSON.stringify(prediction));
      if (response.status !== 200) {
        setError(prediction.detail);
        return;
      }
      setPrediction(prediction);
    }
  };


  async function createNFT(url) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    let contract = new ethers.Contract(nftcreator, NFT, signer)
    let transaction = await contract.createNFT(url)
    let tx = await transaction.wait()
    let event = tx.events[0]
    let value = event.args[2]
    let tokenId = value.toNumber()
    const price = ethers.utils.parseUnits(formInput.price, 'ether')
    contract = new ethers.Contract(marketcontract, Market, signer)
    let listingFee = await contract.getListingFee()
    listingFee = listingFee.toString()
    transaction = await contract.createVaultItem(nftcreator, tokenId, price, { value: listingFee })
    await transaction.wait()
    router.push('/')
  }


  async function mintNFT(url) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    let contract = new ethers.Contract(nftcreator, NFT, signer)
    let cost = await contract.cost()
    let transaction = await contract.mintNFT(url, { value: cost })
    await transaction.wait()
    router.push('/portal')
  }

  return (
    <div>
      <Spacer></Spacer>
      <Container lg display='flex' css={{ fontFamily: 'Genos', fontWeight: '300', fontSize: '33px', }}>
        <Row justify='center'>
          <Image src="chuwen.png" style={{ maxWidth: '77px' }} />
        </Row>
        <Row align='center' gap={4}>
          <Card css={{ marginTop: '$5', marginBottom: '$5' }}>
            <Card.Body justify='center' style={{ backgroundColor: "#00000040" }}>
              <Text style={
                {
                  fontSize: '23px',
                  textAlign: 'center',
                }
              } >MAIA is an A.I. powered Web3 Marketplace. Name your creation, describe your NFT and let MAIA handle the rest. Creation takes time, please be patient.</Text>
            </Card.Body>
          </Card>
        </Row>

        <Card maxwidth={400} css={{ marginTop: '$5' }} >

          {prediction && (
            <Card.Body justify='center' style={{ backgroundColor: "#00000040" }}>
              <Text style={
                {
                  textAlign: 'center'
                }
              }>{prediction.status}</Text>
              {prediction.output && (
                <Image
                  src={prediction.output[0]}
                  alt="output"
                  width={400}
                  height={400}
                />
              )}
            </Card.Body>
          )}
          {/* <video
              autoPlay
              loop
              poster="ghost.gif"
            >
              <source
                src="cyberpunk1.mp4"
                type="video/mp4"
              />
            </video> */}


        </Card>
        <Spacer></Spacer>
        <Card aligncontent='center' style={{ background: '#000000', boxShadow: '0px 0px 5px #ffffff60' }}>
          <Card css={{ marginTop: '$1' }}>
            <Card.Body style={{ backgroundColor: "#000000" }}>
              <Input
                placeholder='Enter your NFT Name'
                aria-label='Enter your NFT Name'
                onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
              />
            </Card.Body>
          </Card>

          {/* <Card>
            <Card.Body style={{ backgroundColor: "#000000" }}>
              <input
                type="file"
                name="Asset"
                onChange={onChange}
              />
              {fileUrl && <img src={fileUrl} alt="File Upload" />}
            </Card.Body>
          </Card> */}
          <Container justify='center' aligncontent='center' css={{ marginBottom: '$2' }}>
            {/* <Row justify='center'>
              <Input
                css={{ marginTop: '$2' }}
                placeholder="Set your price in MATIC"
                aria-label="Set your price in MATIC"
                onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
              />
            </Row> */}
            <form onSubmit={handleSubmit}>
              <Card >
                <Card.Body style={{ backgroundColor: "#000000" }}>
                  <Input
                    placeholder="NFT Description"
                    aria-label="NFT Description"
                    onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
                  />
                </Card.Body>
              </Card>
              <Row justify='center'>
                <Button type='submit' auto bordered rounded ghost animated shadow justify='center' style={{ fontSize: '20px' }} css={{ marginTop: '$2', marginBottom: '$5' }}>
                  <Image src="chuwen.png" style={{ maxWidth: '44px', marginRight: '0px' }}  ></Image>
                </Button>
              </Row>
            </form>
          </Container>
        </Card>

      </Container>
    </div>
  )
}
