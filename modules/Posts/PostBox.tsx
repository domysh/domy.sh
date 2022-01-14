import Link from "next/link"
import React from "react"
import { OverlayTrigger, Tooltip } from "react-bootstrap"
import ReactMarkdown from "react-markdown"
import style from "./style.module.scss"
import { Category, Post, PublicInfo } from "../interfaces"
import { getCategory } from "../utils"
import { categoryIconColor } from "."

const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export const getStrDate = (isodata:string, isodatatoskip?:string) => {
    const date = new Date(isodata)
    if (isodatatoskip == null){
        if (date.getMinutes() === 1)
            return `${date.getFullYear()}`
        return `${months[date.getMonth()]} ${date.getFullYear()}`
    }
    const start_date = new Date(isodatatoskip)
    const skipmonth = start_date.getMonth() == date.getMonth() || (date.getMinutes() === 1)
    const skipyear = start_date.getFullYear() == date.getFullYear()
    if (skipyear && !skipmonth) return `${months[date.getMonth()]}`
    if (!skipyear && skipmonth) return `${date.getFullYear()}`
    if (!skipyear && !skipmonth) return `${months[date.getMonth()]} ${date.getFullYear()}`
    return "" 
}

export const PostBox = ({ post, infos, category }: { post:Post, infos:PublicInfo, category?:Category }) => {
    
    const currentCategory = category?category:getCategory(infos,post.category)
    
    const starTooltip = (props:any) => (
        <Tooltip id={post._id+"_star_tooltip"} {...props}>
          I'm an important step!
        </Tooltip>
    );

    const categoryTooltip = (props:any) => (
        <Tooltip id={post._id+"_category_tooltip"} {...props}>
          {currentCategory.name}
        </Tooltip>
    );

    const color = currentCategory.color?currentCategory.color:categoryIconColor;

    let date_str = getStrDate(post.date);
    let date_str_end = null;
    let end_date = getStrDate(post.end_date,post.date)
    date_str_end = end_date==""?"":` - ${end_date}`

    const date = <div className={style.date}>
                    {date_str}
                    <div className={style.datend}>{date_str_end}</div>
                </div>
    
    const categoryContent = <OverlayTrigger
            placement="top"
            delay={{ show: 250, hide: 400 }}
            overlay={categoryTooltip}>
            {({ ref, ...triggerHandler }) => (
                <Link href={`/c/${currentCategory._id}`} >
                    <a ref={ref} {...triggerHandler} className={style.category} style={{backgroundColor:color}}>
                        <i className={currentCategory.icon?currentCategory.icon:"fab fa-cuttlefish"} />
                    </a>
                </Link>
            )}
        </OverlayTrigger>

    const star = post.star?
        <OverlayTrigger
            placement="left"
            delay={{ show: 250, hide: 400 }}
            overlay={starTooltip}>
            <i className={`fas fa-star ${style.star_icon}`} /> 
        </OverlayTrigger>:
        <i className={`far fa-star ${style.star_icon}`} />

    const description = <ReactMarkdown unwrapDisallowed allowedElements={["a"]} >
                            {post.description}
                        </ReactMarkdown>

    return <div className={style.box} id={post._id}>
        <div className={style.head}>
            <h2 className={style.title}>{post.title}</h2>
            <div className="flex-fullwidth" />
            <div className={style.metahead}>{date} {categoryContent} {star}</div>
        </div>
        <div className={style.description}>
            {description}
        </div>
        <div className={style.bottom}>
            <div className="flex-fullwidth" />
            {date} {categoryContent} {star}
        </div>
        
    </div>  
}
