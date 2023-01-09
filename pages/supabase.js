import { useState, useEffect } from 'react';
import { Button, Col, Row, Container } from '@nextui-org/react';
import Card from '@mui/joy/Card';
import CardCover from '@mui/joy/CardCover';
import CardOverflow from '@mui/joy/CardOverflow';
import CardContent from '@mui/joy/CardContent';

import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@supabase/supabase-js'
import { useAccount, useNetwork } from 'wagmi';

// Create a single supabase client for interacting with your database
const supabase = createClient('https://nullspauughetdzjgtjj.supabase.co', process.env.NEXT_PUBLIC_SUPABASE_KEY)

// https://znvgxowkyhkrfxbzwedo.supabase.co/storage/v1/object/public/images/41fb287f-7bd4-4896-b4aa-db24f145e388/ffe676d5-b440-4b24-a1ca-4480839a3c80

const CDNURL = "https://nullspauughetdzjgtjj.supabase.co/storage/v1/object/public/maia-images/all";

export default function Supabase() {
  const [ email, setEmail ] = useState("");
  const [ images, setImages ] = useState([]);
  const { address } = useAccount();
  const [fileUrl, setFileUrl] = useState(null);
  console.log(email);
  



  async function getImages() {
    const { data, error } = await supabase
      .storage
      .from('maia-images')
      .list('all/', {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "asc"}
      });   // Cooper/
      // data: [ image1, image2, image3 ]
      // image1: { name: "subscribeToCooperCodes.png" }

      // to load image1: CDNURL.com/subscribeToCooperCodes.png -> hosted image

      if(data !== null) {
        console.log(data);
        setImages(data);
      } else {
        alert("Error loading images");
        console.log(error);
      }
  }

  
  useEffect(() => {
    // if(address) {
      getImages();
    // }
  }, [address]);

  
  async function uploadImage(e) {
    let file = e.target.files[0];

    // userid: Cooper
    // Cooper/
    // Cooper/myNameOfImage.png
    // Lindsay/myNameOfImage.png

    const { data, error } = await supabase
      .storage
      .from('maia-images')
      .upload("all/" + predictiom.name, file)  // Cooper/ASDFASDFASDF uuid, taylorSwift.png -> taylorSwift.png

    if(data) {
      console.log(data);
    } else {
      console.log(error);
    }
  }

  async function deleteImage(imageName) {
    const { error } = await supabase
      .storage
      .from('images')
      .remove([ address + "/" + imageName])
    
    if(error) {
      alert(error);
    } else {
      getImages();
    }
  }


  return (
    <Container align="center" className="container-sm mt-4">
      {/* 
        if they dont exist: show them the login page
        if the user exists: show them the images / upload images page
      */}
      { address === null ? 
        <>
          <h1>Welcome to ImageWall</h1>
              
            <h2>Connect Your Wallet</h2>
          
        </>
      : 
        <>
          <h1>Your ImageWall</h1>
          <Button onClick={() => signOut()}>Sign Out</Button>
          <p>Current user: {address}</p>
          <p>Use the Choose File button below to upload an image to your gallery</p>
          <form className="mb-3" style={{maxWidth: "500px"}}>
          <Card>
            <CardCover style={{ backgroundColor: "#000000" }}>
              <input
                type="file"
                name="Asset"
                onChange={(e) => uploadImage(e)}
              />
              {fileUrl && <img src={fileUrl} alt="File Upload" />}
            </CardCover>
          </Card>
          </form>
          <hr />
          <h3>Your Images</h3>
          {/* 
            to get an image: CDNURL + user.id + "/" + image.name 
            images: [image1, image2, image3]  
          */ }
          <Row xs={1} md={3} className="g-4">
            {images.map((image) => {
              return (
                <Col key={CDNURL + "/" + image.name}>
                  <Card>
                    <CardCover variant="top" src={CDNURL +"/" + image.name} />
                    <CardContent>
                      <Button variant="danger" onClick={() => deleteImage(image.name)}>Delete Image</Button>
                    </CardContent>
                  </Card>
                </Col>
              )
            })}
          </Row>
        </>
      }
    </Container>
  );
}

