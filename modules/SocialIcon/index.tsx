import React, { CSSProperties, useContext } from "react"
import style from "./style.module.scss"
import { LinkObject } from "../interfaces"
import { InfosContext } from "../Context/Infos"

const SocialIconRow = (
    props:{icon_color?:string, color?:string, link:string, fa:string}) => {
    const color = props.color?props.color:"#000" 
    const icon_color = props.icon_color?props.icon_color:"#FFF" 
    return (
        <a href={props.link} className={style.link} rel="noreferrer" target="_blank" style={{backgroundColor:color}}>
            <i className={props.fa} style={{color:icon_color}}/>
        </a>
    );
}

export const SocialIcon = ({link}:{link:LinkObject}) => <SocialIconRow link={link.link} color={link.color} fa={link.icon} />

export const SocialIcons = (props:{style?:CSSProperties, className?:string}) => {
    const links = useContext(InfosContext).links
    return(
    <div className={style.list+" "+props.className} style={props.style}>
        {links.map((o,i) => <SocialIcon link={o} key={i} />)}
    </div>
    );

}