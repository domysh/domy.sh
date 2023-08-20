import { ListElement, listRender } from "."
import { SmallFileDetails } from ".."
import { FileInfo } from "../../interfaces"
import { PanePopup } from "../EditPanes"
import { ShowFile } from "../EditPanes/FileEdit"

export const ListFile = ({ values }:{ values: FileInfo[] }) => {
    const LinkElement = ({value}:{value:FileInfo}) => {
        return <PanePopup show={closePane => <ShowFile file={value} close={closePane} />}>
            {open => <div className="center-flex" >
                <SmallFileDetails file={value} />
                <ListElement 
                    title={value.filename}
                    metas={<code>{value._id}</code>}
                    onClick={open}
                    text={`/api/file/${value._id}`}
                />
            </div>}
        </PanePopup>
    }
    return listRender(LinkElement,values)
}