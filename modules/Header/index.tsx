import React, { useContext } from "react"
import { Row, Col } from "react-bootstrap";
import { SocialIcons } from "../SocialIcon"
import style from  "./style.module.scss"
import { Spacer } from "../utils";
import { InfosContext } from "../Context/Infos";
import profileImg from "../../public/img/profile.png"
import Image from "next/image";

export const Header = () => {
  const infos = useContext(InfosContext)
  return (<>
    <Row className={`${style.header} g-0`} >
      <Col xs={12} md={8} lg={6} className={style.text}>
      {infos.meta.name}
        <div className={style.subtitle}>{infos.meta.description}</div>
        <SocialIcons className={style.social} />
      </Col>
      <Col md={4} lg={6} className={style.profile_image}>
        <Image src={profileImg} placeholder="blur" className={style.header_profile} alt="Profile Image" />
      </Col>
    </Row>
    <Spacer />
  </>);
}

