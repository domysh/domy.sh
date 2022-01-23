import { ListElement, listRender } from "."
import { LinkObject } from "../../interfaces"
import { SocialIcon } from "../../SocialIcon"
import { LinkEdit, PanePopup } from "../EditPanes"

export const ListLink = ({ values }:{ values: LinkObject[] }) => {
    const LinkElement = ({value}:{value:LinkObject}) => {
        return <PanePopup show={closePane => <LinkEdit link={value} close={closePane} />}>
            {open => <ListElement 
                title={value.name}
                metas={<SocialIcon link={value} />}
                onClick={open}
                text={value.url}
            />}
        </PanePopup>
    }
    return listRender(LinkElement,values)
}