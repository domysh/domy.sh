import React, { useContext } from "react"
import { Container } from "react-bootstrap";
import { SocialIcons } from "../SocialIcon"
import ReactMarkdown from "react-markdown";
import style from "./style.module.scss"
import { Spacer } from "../utils";
import { InfosContext } from "../Context/Infos";
import Image from "next/image";

export const Footer = () => {
    const infos = useContext(InfosContext)
    return (<> <Spacer />
    <Container fluid className={style.main_footer}>
        <div className={style.footer_logo}>
            <Image
                width="130"
                height="130"
                objectFit="contain"
                src="/favicon.ico"
                alt="Site Icon" 
            />
        </div>
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

