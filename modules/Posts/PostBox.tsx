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

export const Star = React.forwardRef<HTMLElement,{star:boolean}>(({star, ...props},ref) => {
    return star?<i className={`fas fa-star ${style.star_icon}`} ref={ref} {...props} />:
        <i className={`far fa-star ${style.star_icon}`} ref={ref} {...props} />
})

export const CategoryButton = ({ category }:{ category?:Category }) => {
    let categ:Category = category?category:{_id:"", name:"", description:"", highlighted:false}
    const color = categ.color?categ.color:categoryIconColor;
    const categoryTooltip = (props:any) => (
        <Tooltip id={categ._id+"_category_tooltip"} {...props}>
          {categ.name}
        </Tooltip>
    );
    return <OverlayTrigger
            placement="top"
            delay={{ show: 250, hide: 400 }}
            overlay={categoryTooltip}>
            {({ ref, ...triggerHandler }) => (
                <Link href={`/c/${categ._id}`} >
                    <a ref={ref} {...triggerHandler} className={style.category} style={{backgroundColor:color}}>
                        <i className={categ.icon?categ.icon:"fab fa-cuttlefish"} />
                    </a>
                </Link>
            )}
        </OverlayTrigger>
}

export const PostDate = ({post_date,post_end_date}:{post_date:string,post_end_date:string}) => {
    const date_str = getStrDate(post_date);
    let date_str_end = null;
    let end_date = getStrDate(post_end_date,post_date)
    date_str_end = end_date==""?"":` - ${end_date}`

    return <div className={style.date}>
                {date_str}
                <div className={style.datend}>{date_str_end}</div>
            </div>
}

export const PostBox = ({ post }: { post:Post }) => {
    
    const date = <PostDate post_date={post.date} post_end_date={post.end_date} />
    const currentCategory = getCategory(post.category)
    const categoryContent = <CategoryButton category={currentCategory} />
    const star = <Star star={post.star} />
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
