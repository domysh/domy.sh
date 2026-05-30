import style from "./style.module.scss"
import { Category } from "../interfaces"
import Link from "next/link"

export const categoryIconColor = "#6366F1"

export const CategoryView = ({ category }: { category: Category }) => {
    return <Link href={`/c/${category.id}`} className={style.link_wrapper}>
        <div className={style.box} id={category.id}>
            <div className={style.header}>
                <div className={style.icon_wrapper} style={{ color: category.color || categoryIconColor }}>
                    <i className={category.icon || "fab fa-cuttlefish"}></i>
                </div>
                <h2 className={style.title}>{category.name}</h2>
            </div>
            <div className={style.description}>
                {category.description}
            </div>
        </div>
    </Link>
}
