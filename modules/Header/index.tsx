import React, { useContext } from "react"
import { Row, Col } from "react-bootstrap";
import { SocialIcons } from "../SocialIcon"
import style from  "./style.module.scss"
import { Spacer } from "../utils";
import { InfosContext } from "../Context/Infos";
import Image from "next/image";

export const Header = () => {
  const infos = useContext(InfosContext)

  const background_img = infos.meta.header_img?
        new URL(`/api/file/${infos.meta.header_img}`,infos.publicurl).href:
            "/img/header-back.jpg"
  return (<>
    <Row className={`${style.header} g-0`} >
        <Image
            src={background_img}
            alt="Background"
            layout="fill"
            objectFit="cover"
            objectPosition="center"
            className={style.backimage} 
            priority />
        <div className={style.darklayer} />
        <Col xs={12} md={8} lg={6} className={style.text}>
        {infos.meta.name}
        <div className={style.subtitle}>{infos.meta.description}</div>
        <SocialIcons className={style.social} />
      </Col>
      <Col md={4} lg={6} className={style.profile_image}>
        {infos.meta.profile_img?
        <Image
          src={new URL(`/api/file/${infos.meta.profile_img}`,infos.publicurl).href}
          alt="Profile Image"
          width="700"
          height="700"
          objectFit="contain" />:null}
      </Col>
    </Row>
    <Spacer />
  </>);
}

