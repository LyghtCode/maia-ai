import { useState, useEffect } from 'react';
import { Button, Col, Row, Container, Text, useTheme, Spacer, Image, Grid, Input } from '@nextui-org/react';
import { Alchemy, Network } from "alchemy-sdk";
import { toast } from 'react-toastify';
import Masonry from '@mui/lab/Masonry';
import Card from '@mui/joy/Card';
import CardCover from '@mui/joy/CardCover';
import CardOverflow from '@mui/joy/CardOverflow';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import { useAccount, useNetwork } from 'wagmi';
import { useQuery } from 'react-query';

import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
const supabase = createClient('https://nullspauughetdzjgtjj.supabase.co', process.env.NEXT_PUBLIC_SUPABASE_KEY)

// https://znvgxowkyhkrfxbzwedo.supabase.co/storage/v1/object/public/images/41fb287f-7bd4-4896-b4aa-db24f145e388/ffe676d5-b440-4b24-a1ca-4480839a3c80

const CDNURL = "https://nullspauughetdzjgtjj.supabase.co/storage/v1/object/public/maia-images/all";



export default function Gallery(props) {
  const { theme } = useTheme()
  const [images, setImages] = useState([]);
  const { address } = useAccount();

  async function getImages() {
    const { data, error } = await supabase
      .storage
      .from('maia-images')
      .list('all/', {
        limit: 100,
        offset: 1,
        sortBy: { column: "name", order: "asc" }
      });   // Cooper/
    // data: [ image1, image2, image3 ]
    // image1: { name: "subscribeToCooperCodes.png" }

    // to load image1: CDNURL.com/subscribeToCooperCodes.png -> hosted image

    if (data !== null) {
      console.log(data);
      setImages(data);
    } else {
      alert("Error loading images");
      console.log(error);
    }
  }
  useEffect(() => {
    if (address) {
      getImages();
    }
  }, [address]);




  if (!address)
    return (
      <div>
        <Spacer></Spacer>
        <Container display='flex' justify='center' aligncontent='center' md="true">
          <Row justify='center'>
            <Image src="lamat.png" style={{ maxWidth: '77px', marginRight: '0px' }} />
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
          }} h4>Connect Wallet</Text>
        </Container>
      </div>
    );

  return (
    <div>
      <Spacer></Spacer>
      <Container display='flex' justify='center' aligncontent='center' md="true">
        <Row justify='center'>
          <Image src="bakab.png" style={{ maxWidth: '77px', marginRight: '0px' }} />
        </Row>
        <Row display='flex' justify='center' aligncontent='center'>

          <Masonry columns={3} spacing={.3}>
            {images.map((img, i) => {
              return (

                <div key={i}>

                  {img.metadata.mimetype === "video/mp4" ?
                    <Card key={i}
                      value={i} sx={{ flexGrow: 1 }}>
                      <CardCover>
                        <video
                          autoPlay
                          loop
                          muted
                          poster="bakab.png"
                        >
                          <source
                            src={CDNURL + "/" + img.name}
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
                          {image.name}
                        </Typography>
                      </CardContent>
                    </Card>
                    :

                    <Card key={i}
                      value={i} sx={{ flexGrow: 1, }}>
                      <CardOverflow>
                        <img
                          src={CDNURL + "/" + img.name}
                          alt={img.name}
                          loading="lazy"
                        />
                        <Typography
                          fontWeight="xsm"
                          textColor="#7828C8"
                        >
                          {img.name}
                        </Typography>
                      </CardOverflow>
                    </Card>
                  }
                </div>

              );
            })}
          </Masonry>
        </Row>
      </Container>
    </div>

  )
}

