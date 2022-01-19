import Link from "next/link"
import React from "react"
import { OverlayTrigger, Tooltip } from "react-bootstrap"
import style from "./style.module.scss"
import { Category, Post, PublicInfo } from "../interfaces"
import { getCategory, MdPost } from "../utils"
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

export const Star = React.forwardRef(({star, ...props}:{star:boolean},ref) => {
    return star?<i ref={ref} className={`fas fa-star ${style.star_icon}`} {...props} />:
        <i ref={ref} className={`far fa-star ${style.star_icon}`} {...props} />
})

export const starRender = (post:Post) => {
    const starTooltip = (props:any) => (
        <Tooltip id={post._id+"_star_tooltip"} {...props}>
          I'm an important step!
        </Tooltip>
    );
    return post.star?
        <OverlayTrigger
            placement="left"
            delay={{ show: 250, hide: 400 }}
            overlay={starTooltip}>
            <Star star={post.star} />
        </OverlayTrigger>:<Star star={post.star} />
}

export const categoryButtonRender = (category:Category) => {
    const color = category.color?category.color:categoryIconColor;
    const categoryTooltip = (props:any) => (
        <Tooltip id={category._id+"_category_tooltip"} {...props}>
          {category.name}
        </Tooltip>
    );
    return <OverlayTrigger
            placement="top"
            delay={{ show: 250, hide: 400 }}
            overlay={categoryTooltip}>
            {({ ref, ...triggerHandler }) => (
                <Link href={`/c/${category._id}`} >
                    <a ref={ref} {...triggerHandler} className={style.category} style={{backgroundColor:color}}>
                        <i className={category.icon?category.icon:"fab fa-cuttlefish"} />
                    </a>
                </Link>
            )}
        </OverlayTrigger>
}

export const dateRender = (post:Post) => {
    const date_str = getStrDate(post.date);
    let date_str_end = null;
    let end_date = getStrDate(post.end_date,post.date)
    date_str_end = end_date==""?"":` - ${end_date}`

    return <div className={style.date}>
                {date_str}
                <div className={style.datend}>{date_str_end}</div>
            </div>
}

export const PostBox = ({ post, infos }: { post:Post, infos:PublicInfo }) => {
    
    
    const date = dateRender(post)
    const currentCategory = getCategory(infos,post.category)
    const categoryContent = categoryButtonRender(currentCategory)
    const star = starRender(post)
    const description = <MdPost>{post.description}</MdPost>

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
