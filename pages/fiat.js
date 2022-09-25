import { Card, Button, Input, Col, Row, Spacer, Container, Text, Image } from '@nextui-org/react';
import 'sf-font'

export default function createMarket() {


  return (
    <div>
      <Spacer></Spacer>
      <Container display='flex' justify='center' alignContent='center' lg gap={2} css={{ fontFamily: 'Space Grotesk', fontWeight: '300' }}>
        <Text h2>Buy MATIC w/Credit Card</Text>
        <Row display='flex' justify='center' align='center' gap={4}>
            <Spacer></Spacer>
            <iframe
                    src="https://widget.onramper.com?color=bd00ff&apiKey=pk_prod_s0mLpQOWRPkpbZZGX4zyE2nLlt4hVRikf8rsPMres300&defaultCrypto=MATIC&defaultAmount=750&defaultFiat=USD&onlyCryptos=MATIC&supportSell=false"
                    height="600px"
                    width="420px"
                    title="Onramper widget"
                    frameBorder="0"
                    allow="accelerometer; autoplay; camera; gyroscope; payment"
                >
                </iframe>
        </Row>
      </Container>
    </div>
  )
}
