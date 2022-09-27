import { ethers } from 'ethers';
import { useState } from 'react';
import { useRouter } from 'next/router';
import AIACollection from '../engine/AIACollection.json'
import { nftcollection } from '../engine/configuration';
import { Button, Input, Col, Row, Spacer, Container, Text, Image, useTheme } from '@nextui-org/react';
import 'sf-font'
import { toast } from 'react-toastify';
import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import CardCover from '@mui/joy/CardCover';
import { useSigner, useAccount, useNetwork } from 'wagmi';





export default function Mint() {
  const { theme } = useTheme()
  const { address } = useAccount()
  const { chain } = useNetwork()
  const { data: signer, isError, isLoading } = useSigner()

  const [formInput, updateFormInput] = useState({ amount: '' })

  const router = useRouter()

  async function mintNFT() {

    try {
      const { amount } = formInput
      //Chigag update TOKEN URI here
      const tokenUri = 'https://bafybeibsj2kao3qxfnasff56jeyww6kpr7ooylta2cqyujkwx44fo5stiu.ipfs.nftstorage.link/metadata/1.json';
      const quantity = Number(amount);

      // Chigag Network Logic - LyghtCode
      let network = chain.name;
      console.log("Connected network is: " + chain.name);
      if (network === 'Polygon') {
        console.log("Preparing Mint...")
        // Alchemy Logic - LyghtCode
        let contract = new ethers.Contract(nftcollection, AIACollection, signer);
        let transaction = await contract.safeMint(address, tokenUri, quantity);
        await transaction.wait();
        router.push('/portal');
      }
      else {
        toast.error("Switch to Polygon");

      }


    } catch (error) {
      //Chigag Add error toasts stupid!!!
      // console.log(error.message);
      // console.log(error.code);
      // console.log(error.reason);
      toast.error(error.reason);
    }

  }

  return (
    <div>
      <Spacer></Spacer>
      <Container display='flex' justify='center' alignContent='center' lg gap={2} css={{ fontFamily: 'Genos', fontWeight: '300' }}>
        <Row justify='center'>
          <Image src="osram.png" style={{ maxWidth: '77px'}} />
        </Row>
        <Row justify='center' gap={1}>
            <Spacer></Spacer>
            <Box
              component="ul"
              sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', p: 0, m: 0 }}
            >
              <Card justify='center' component="li" sx={{ minWidth: 400, maxWidth:600, minHeight: 400, flexGrow: 1 }}>
                <CardCover>
                  {/* //AIA NFT */}
                  <Image height={400} src='ghost.gif'/>
                </CardCover>
              </Card>
            </Box>
          
        </Row>
        <Row justify='center' align='center'>
            <Spacer></Spacer>
            {/* <Text h3>Mint Dashboard</Text> */}
            <Card display='flex' justify='center' style={{ maxWidth: '300px', background: '#000000', boxShadow: '0px 0px 5px #ffffff60' }}>
              <Container justify='center' css={{ marginBottom: '$2' }}>
                <Row justify='center' align='center'>
                  <Input
                    justify='center'
                    css={{ marginTop: '$5' }}
                    placeholder="Trust the Universe"
                    aria-label="Set Quantity - MAX 4"
                    onChange={e => updateFormInput({ ...formInput, amount: e.target.value })}
                  />
                </Row>
                <Row justify='center'>
                  <Button auto bordered rounded ghost animated shadow justify='center' style={{ fontSize: '20px' }} onPress={mintNFT} css={{ marginTop: '$2', marginBottom: '$5' }}>
                    <Image src="osram.png" style={{ maxWidth: '44px', marginRight: '0px' }}  ></Image>
                  </Button>
                </Row>
              </Container>
            </Card>
          </Row>
      </Container>
    </div>
  )
}
