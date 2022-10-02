import { Text, Row, Spacer, Container, Col, useTheme } from '@nextui-org/react';


export default function Footer() {
  const { theme } = useTheme()
  const footer1 = [
    {
      id: 1,
      img: "bakab.png",
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
      <Container display='flex' alignContent='center'>
        <Spacer></Spacer>
        <Row align='center' justify='center' gap={2}>
          {/* Socials */}
            <ul>
              {footer1.map((item, idx) => {
                return (
                  <a key={idx} href={item.url}>
                    <img
                      src={item.img}
                      width="44px"
                      height="44px"
                    ></img>
                  </a>
                );
              })}
            </ul>
        </Row>

      </Container>
    </div>
  );
}