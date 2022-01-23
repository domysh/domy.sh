import { ListElement, listRender } from "."
import { Page } from "../../interfaces"
import { marktext_to_plain } from "../../utils"
import { PageEdit, PanePopup } from "../EditPanes"

export const ListPage = ({ values }:{ values: Page[] }) => {
    const PageElement = ({ value }:{value:Page}) => {
        return <PanePopup show={closePane => <PageEdit page={value} close={closePane} />}>
            {open => <ListElement 
                title={value.name}
                metas={<code>{"/"+value._id}</code>}
                text={marktext_to_plain(value.content)}
                onClick={open}
            />}
        </PanePopup>
    }
    return listRender(PageElement,values)
}