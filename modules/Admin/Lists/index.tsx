import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { CircleBtn } from "..";
import { Error404 } from "../../Errors";
import { Category, LinkObject, Page, Post } from "../../interfaces";
import { rndId } from "../../utils";
import { CategoryEdit, PostEdit, LinkEdit, PageEdit, PanePopup } from "../EditPanes";
import style from "../style.module.scss"
import { ListCategory, ListLink, ListPage, ListPost } from ".";

export * from "./ListCategory"
export * from "./ListLink"
export * from "./ListPage"
export * from "./ListPost"

const SelectorIcon = ({ to, icon, variant, name, state }:
    { to:number, icon:string, variant:string, name:string, state:[number, (s:number)=>void]}) => {
    const [pane, setPane] = state

    const showTooltip = (props:any) => (
        <Tooltip id={`selection_btn_${to}_tooltip`} {...props}>
          {name}
        </Tooltip>);

    return <OverlayTrigger
        placement="left"
        delay={{ show: 250, hide: 400 }}
        overlay={showTooltip}>
            <CircleBtn
                onClick={()=>{if (pane !== to) setPane(to)}}
                icon={icon}
                variant={variant}
                className={style.btnlink+" "+(to!==pane?style.btnlink_deactivated:null)} />
    </OverlayTrigger>
}

const addElement = (state: [number, (s:number)=>void], closePane: ()=>void) => {
    const [pane] = state;
    switch (pane){
        case 0: return <PostEdit close={closePane} />
        case 1: return <PageEdit close={closePane} />
        case 2: return <LinkEdit close={closePane} />
        case 3: return <CategoryEdit close={closePane} />
        default: return <Error404 />
    }
}

export const ListSelector = ({ state }:{ state: [number, (s:number)=>void] }) => {
    return <>
        <div className={style.listselector}>
            <SelectorIcon state={state} icon="fas fa-file-alt" variant="primary" name="Posts" to={0} />
            <SelectorIcon state={state} icon="fas fa-code" variant="success" name="Static Pages" to={1} />
            <SelectorIcon state={state} icon="fas fa-share-alt-square" variant="warning" name="Social Links" to={2} />
            <SelectorIcon state={state} icon="fab fa-cuttlefish" variant="danger" name="Categories" to={3} />
            <PanePopup show={closePane => addElement(state,closePane)}>
                {open => <CircleBtn onClick={open} icon="fas fa-plus" variant="secondary" className={style.btnlink}/>}
            </PanePopup>
            
        </div>
    </>
}

const trimtxt = (text:string)=> text.length>150?text.substring(0,150)+" [...]":text

export const ListElement = ({ onClick, title, metas, text }:{ onClick:()=>void, title:string|JSX.Element, metas:string|JSX.Element, text?:string }) => {

    return <div className={style.listelement} onClick={onClick}>
        <div className={style.header_post}>
            <h5>{title}</h5>
            <div className="flex-fullwidth" />
            <div className={style.metas} >
                {metas}
            </div>
            <h3><i className={`fas fa-chevron-right ${style.arrow}`} /></h3>
        </div> 
        <div> {text?trimtxt(text):null} </div>
    </div>
}

const emptyListMsg = <div className="center-flex" style={{paddingTop:"100px"}}>
    <u><h2>No content available!</h2></u>
</div>

export const listRender = (Tag:(props:{ value:any })=>JSX.Element,values:any[]) => {
    return <div className={style.list}>
        {values.length===0?emptyListMsg:values.map( (o,i) =>  <div key={rndId()}><Tag value={o} />{i!==values.length-1?<hr />:null}</div>)}
    </div>
}

export const ListElements = ({ data, state }: { data: [Post[],Page[],LinkObject[],Category[]], state: number}) => {
    switch (state){
        case 0: return <ListPost values={data[state]} />
        case 1: return <ListPage values={data[state]} />
        case 2: return <ListLink values={data[state]} />
        case 3: return <ListCategory values={data[state]} />
        default: return <Error404 />
    }
}


