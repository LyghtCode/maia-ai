import 'sf-font';
import { Text, Row, Spacer, Container, Col, useTheme } from '@nextui-org/react';


export default function Footer() {
  const { theme } = useTheme()
  const footer1 = [
    {
      id: 1,
      img: "chakra.png",
      url: "https://lyghtcode.vercel.app",
    },
    {
      id: 2,
      img: "coqui.png",
      url: "https://github.com/LyghtCode",
    },
    {
      id: 3,
      img: "dragon.png",
      url: "https://twitter.com/TainoMusica",
    },
    // {
    //   id: 4,
    //   img: "instagram-svgrepo-com.svg",
    //   url: "https://www.instagram.com/golfdao1/",
    // },
    // {
    //   id: 5,
    //   img: "linkedin-svgrepo-com.svg",
    //   url: "https://www.linkedin.com/in/golfdao/",
    // },
  ];


  return (
    <div>
      <Container>
        <Spacer></Spacer>
        <Row gap={2}>
          {/* Polygon Logo */}
          {/* <Col>
            <Text h3
                style={{
                  color: "#ffffff",
                  fontSmooth: "always",
                  textShadow: "-0px 0px 3px #ffffff",
                  fontFamily: "Space Grotesk",
                  fontWeight: "300",
                }}>Deployed on</Text>
            <ul>
              {footer2.map((item, idx) => {
                return (
                  <img
                    key={idx}
                    src={item.img}
                    style={{ marginRight: "5px" }}
                    width="50px"
                    height="50px"
                  ></img>
                );
              })}
            </ul>
          </Col> */}
          {/* Alchmey Logo */}
          {/* <Col style={{ marginLeft: "5px" }}>
            <Text h3
                style={{
                  color: "#ffffff",
                  fontSmooth: "always",
                  textShadow: "-0px 0px 3px #ffffff",
                  fontFamily: "Space Grotesk",
                  fontWeight: "300",
                }}>Powered by</Text>
            <a href="">
              <img
                src="alchemyblue.png"
                style={{
                  width: "50px",
                }}
              />
            </a>
          </Col> */}
          {/* Socials */}
          <Col>
            <Text h3
                style={{
                  color: "#ffffff",
                  fontSmooth: "always",
                  textShadow: "-0px 0px 3px #f2e900",
                  fontFamily: "Space Grotesk",
                  fontWeight: "400",
                }}>
              
            </Text>
            <ul>
              {footer1.map((item, idx) => {
                return (
                  <a key={idx} href={item.url}>
                    <img
                      src={item.img}
                      style={{ marginRight: "1px" }}
                      width="66px"
                      height="66px"
                    ></img>
                  </a>
                );
              })}
            </ul>
          </Col>
          {/* Chigag Branding */}
          <Col>
            <a href="https://lyghtcode.vercel.app/">
              <Text
                h3
                style={{
                  color: theme.colors.primaryLightHover.value,
                  fontSmooth: "always",
                  textShadow: "-0px 0px 3px #ffffff",
                  fontFamily: "Space Grotesk",
                  fontWeight: "300",
                }}
              >
                Web3 by
              </Text>
              <Text
                h3
                style={{
                  color:theme.colors.primaryLightContrast.value,
                  fontSmooth: "always",
                  textShadow: "-0px 0px 3px #ffffff",
                  fontFamily: "Space Grotesk",
                  fontWeight: "260",
                }}
              >
                LyghtC0de
              </Text>
            </a>
          </Col>
        </Row>

      </Container>
    </div>
  );
}