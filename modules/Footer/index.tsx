import React, { useContext } from "react"
import { Container } from "react-bootstrap";
import { SocialIcons } from "../SocialIcon"
import ReactMarkdown from "react-markdown";
import style from "./style.module.scss"
import { Spacer } from "../utils";
import { InfosContext } from "../Context/Infos";

export const Footer = () => {
    const infos = useContext(InfosContext)
    return (<> <Spacer />
    <Container fluid className={style.main_footer}>
        <img className={style.footer_logo} src="/favicon.ico" alt="Site Icon" placeholder="blur"  />
        <div className={style.social_wrapper}>
            <SocialIcons />
        </div>
        <div className={style.text_spacer} />
        <div className={style.text}>
            <ReactMarkdown children={infos.meta.footer} />
        </div>
    </Container>
    </>);
}

