import style from "./style.module.scss"
import { Category } from "../interfaces"
import Link from "next/link"

export const categoryIconColor = "#1b4965"

export const CategoryView = ({ category }: { category: Category }) => {
    return <Link href={`/c/${category._id}`} >
        <div className={style.box} id={category._id}>
            <h2 className={style.title}>{category.name}</h2>
            <div className={style.description}>
                {category.description}
            </div>        
        </div>
    </Link>
    
}
