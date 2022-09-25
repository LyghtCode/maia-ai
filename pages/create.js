import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Web3Modal from "web3modal";
import NFT from '../engine/MAIA.json';
import Market from '../engine/Market.json';
import { nftcreator, marketcontract } from '../engine/configuration';
import { Card, CardCover, Button, Input, Col, Row, Spacer, Container, Text, Image } from '@nextui-org/react';
import 'sf-font'
import client from '../engine/configuration';

export default function createMarket() {
  const [fileUrl, setFileUrl] = useState(null)
  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })

  useEffect(() => {
  }, [])

  const router = useRouter()

  async function onChange(e) {
    const file = e.target.files[0]
    try {
      const added = await client.add(
        file,
        {
          progress: (prog) => console.log(`received: ${prog}`)
        }
      )
      const url = `https://ipfs.io/ipfs/${added.path}`
      setFileUrl(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }
  }

  async function createMarket() {
    const { name, description, price } = formInput
    if (!name || !description || !price || !fileUrl) return
    const data = JSON.stringify({
      name, description, image: fileUrl
    })
    try {
      const added = await client.add(data)
      const url = `https://ipfs.io/ipfs/${added.path}`
      createNFT(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }
  }

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

  async function buyNFT() {
    const { name, description } = formInput
    if (!name || !description || !fileUrl) return
    const data = JSON.stringify({
      name, description, image: fileUrl
    })
    try {
      const added = await client.add(data)
      const url = `https://ipfs.io/ipfs/${added.path}`
      mintNFT(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }
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
      <Container lg gap={2} css={{ fontFamily: 'Space Grotesk', fontWeight: '300' }}>
        <Row justify='center'>
          <Image src="mmere.png" style={{ maxWidth: '77px', marginRight: '0px' }} />
        </Row>
        <Row align='center' gap={4}>
          <Col css={{ marginRight: '$7' }}>
            <Spacer></Spacer>
            <Card css={{ marginTop: '$5', marginBottom: '$5' }}>
              <Card.Body justify='center' style={{ backgroundColor: "#00000040" }}>
                <Text >MAIA is an A.I. powered Web3 Marketplace. Name your creation, describe your NFT and let MAIA handle the rest. Creation takes time, please be patient.</Text>
              </Card.Body>
            </Card>

            <Card css={{ marginTop: '$5' }} >
              <Card.Body style={{ backgroundColor: "#00000040" }}>

                <video
                  autoPlay
                  loop
                  poster="ghost.gif"
                >
                  <source
                    src="cyberpunk1.mp4"
                    type="video/mp4"
                  />
                </video>

              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Spacer></Spacer>

            <Card alignContent='center' style={{ maxWidth: '300px', background: '#000000', boxShadow: '0px 0px 5px #ffffff60' }}>
              <Card css={{ marginTop: '$1' }}>
                <Card.Body style={{ backgroundColor: "#000000" }}>
                  <Input
                    placeholder='Enter your NFT Name'
                    aria-label='Enter your NFT Name'
                    onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
                  />
                </Card.Body>
              </Card>
              <Card >
                <Card.Body style={{ backgroundColor: "#000000" }}>
                  <Input
                    placeholder="NFT Description"
                    aria-label="NFT Description"
                    onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
                  />
                </Card.Body>
              </Card>
              <Card>
                <Card.Body style={{ backgroundColor: "#000000" }}>
                  <input
                    type="file"
                    name="Asset"
                    onChange={onChange}
                  />
                  {fileUrl && <img src={fileUrl} alt="File Upload" />}
                </Card.Body>
              </Card>
              <Container justify='center' alignContent='center' css={{ marginBottom: '$2' }}>
                <Row justify='center'>
                  <Input
                    css={{ marginTop: '$2' }}
                    placeholder="Set your price in MATIC"
                    aria-label="Set your price in MATIC"
                    onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
                  />
                </Row>
                <Row justify='center'>
                  <Button auto bordered rounded ghost animated shadow justify='center' style={{ fontSize: '20px' }} onPress={createMarket} css={{ marginTop: '$2', marginBottom: '$5' }}>
                    <Image src="mmere.png" style={{ maxWidth: '44px', marginRight: '0px' }}  ></Image>
                  </Button>
                </Row>
              </Container>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
