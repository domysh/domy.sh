import { useContext } from "react";
import { InfosContext } from "../Context/Infos";
import { CategoryView } from "./CategoryView";
import style from "./style.module.scss";

export const CategoryList = () => {
    const infos = useContext(InfosContext)
    return (
        <div className={style.grid_container}>
            {infos.categories.map((c) => (
                <CategoryView category={c} key={c.id} />
            ))}
        </div>
    )
}