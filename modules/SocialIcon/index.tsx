import React, { CSSProperties } from "react"
import style from "./style.module.scss"
import { LinkObject } from "../interfaces"



export const SocialIcon = (
    props:{icon_color?:string, color?:string, link:string, fa:string}) => {
    const color = props.color?props.color:"#000" 
    const icon_color = props.icon_color?props.icon_color:"#FFF" 
    return (
        <a href={props.link} className={style.list} rel="noreferrer" target="_blank" style={{backgroundColor:color}}>
            <i className={props.fa} style={{color:icon_color}}/>
        </a>
    );
}

export const SocialIcons = (props:{style?:CSSProperties, className?:string, links:LinkObject[]}) => {
    return(
    <div className={style.link+" "+props.className} style={props.style}>
        {props.links.map(
            (o,i) => <SocialIcon link={o.link} color={o.color} fa={o.icon} key={i} />)}
    </div>
    );

}