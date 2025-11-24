import React, { useContext } from "react"
import { Row, Col } from "react-bootstrap";
import { SocialIcons } from "../SocialIcon"
import style from "./style.module.scss"
import { InfosContext } from "../Context/Infos";
import Image from "next/image";
import { MetaInfo } from "../interfaces";

export const Header = ({ meta }: { meta?: MetaInfo }) => {
  const infos = meta ? { meta } : useContext(InfosContext)

  const background_img = infos.meta.header_img ?
    `/uploads/${infos.meta.header_img}` :
    "/img/header-back.jpg"
  return (<>
    <Row className={`${style.header} g-0`} style={{
      backgroundImage: `url(${background_img})`,
      backgroundPosition: "center",
      backgroundSize: "cover",
    }} >
      <div className={style.darklayer} />
      <Col xs={12} md={8} lg={6} className={style.text}>
        {infos.meta.name}
        <div className={style.subtitle}>{infos.meta.description}</div>
        <SocialIcons className={style.social} />
      </Col>
      <Col md={4} lg={6} className={style.profile_image}>
        {infos.meta.profile_img ?
          <img
            src={`/uploads/${infos.meta.profile_img}`}
            alt="Profile Image" />
          : null}
      </Col>
    </Row>
  </>);
}

