import { ListElement, listRender } from "."
import { Category } from "../../interfaces"
import { CategoryButton } from "../../Posts"
import { CategoryEdit, PanePopup } from "../EditPanes"

export const ListCategory = ({ values }:{ values: Category[] }) => {
    const CategoryElement = ({value}:{value:Category}) => {
        return <PanePopup show={closePane => <CategoryEdit category={value} close={closePane} />}>
            {open => <ListElement
                title={value.name}
                metas={<CategoryButton category={value} />}
                text={value.description}
                onClick={open}
            />}
        </PanePopup>
    }
    return listRender(CategoryElement,values)
}