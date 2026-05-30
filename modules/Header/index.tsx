import React, { useContext } from "react"
import { Row, Col } from "react-bootstrap";
import { SocialIcons } from "../SocialIcon"
import style from "./style.module.scss"
import { InfosContext } from "../Context/Infos";
import Image from "next/image";
import { MetaInfo } from "../interfaces";

export const Header = ({ meta }: { meta?: MetaInfo }) => {
  const infos = meta ? { meta } : useContext(InfosContext)

  return (<>
    <Row className={`${style.header} g-0`}>
      <div className={style.gradient_bg} />
      
      <div className={style.content_wrapper}>
        <div className={style.glass_card}>
          <Col className={style.profile_col}>
            {infos.meta.profile_img ?
              <div className={style.profile_image_wrapper}>
                <img
                  src={`/uploads/${infos.meta.profile_img}`}
                  alt="Profile Image" 
                  className={style.profile_img} />
              </div>
              : null}
          </Col>
          <Col className={style.text_col}>
            <div className={style.text}>
              {infos.meta.name}
              <div className={style.subtitle}>{infos.meta.description}</div>
              <SocialIcons className={style.social} />
            </div>
          </Col>
        </div>
      </div>
    </Row>
  </>);
}

