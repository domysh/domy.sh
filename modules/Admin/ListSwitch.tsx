import { useContext, useEffect, useState } from "react";
import { Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { Error404, Loading } from "../Errors";
import { Category, LinkObject, Page, Post, PublicInfo } from "../interfaces";
import { CircleBtn } from "./CircleBtn";
import style from "./style.module.scss"
import { getCategory, marktext_to_plain, rndId } from "../utils";
import { CategoryButton, PostDate, Star } from "../Posts";
import { SocialIcon } from "../SocialIcon";
import { CategoryEdit, EditPost, LinkEdit, PageEdit, PanePopup } from "./Panes";
import { InfosContext } from "../Context/Infos";

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

const addElement = (state: [number, (s:number)=>void]) => {
    const [pane] = state;
    switch (pane){
        case 0: return <EditPost />
        case 1: return <PageEdit />
        case 2: return <LinkEdit />
        case 3: return <CategoryEdit />
        default: return <Error404 />
    }
}

const ListSelector = ({ state }:{ state: [number, (s:number)=>void] }) => {
    return <>
        <div className={style.listselector}>
            <SelectorIcon state={state} icon="fas fa-file-alt" variant="primary" name="Posts" to={0} />
            <SelectorIcon state={state} icon="fas fa-code" variant="success" name="Static Pages" to={1} />
            <SelectorIcon state={state} icon="fas fa-share-alt-square" variant="warning" name="Social Links" to={2} />
            <SelectorIcon state={state} icon="fab fa-cuttlefish" variant="danger" name="Categories" to={3} />
            <PanePopup show={addElement(state)}>
                {open => <CircleBtn onClick={open} icon="fas fa-plus" variant="secondary" className={style.btnlink}/>}
            </PanePopup>
            
        </div>
    </>
}

const trimtxt = (text:string)=> text.length>150?text.substring(0,150)+" [...]":text

const ListElement = ({ onClick, title, metas, text }:{ onClick:()=>void, title:string|JSX.Element, metas:string|JSX.Element, text?:string }) => {

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

const listRender = (Tag:(props:{ value:any })=>JSX.Element,values:any[]) => {
    return <div className={style.list}>
        {values.length===0?emptyListMsg:values.map( (o,i) =>  <div key={rndId()}><Tag value={o} />{i!==values.length-1?<hr />:null}</div>)}
    </div>
}

const ListPost = ({ values }:{ values: Post[] }) => {
    const PostElement = ({value}:{value:Post}) => {
        return <PanePopup show={<EditPost post={value} />}>
            {open => <ListElement 
                title={value.title}
                metas={<>
                    <PostDate post_date={value.date} post_end_date={value.end_date} />
                    <CategoryButton category={getCategory(value.category)} />
                    <Star star={value.star} />
                </>}
                text={marktext_to_plain(value.description)}
                onClick={open}
            />}
        </PanePopup>
    }
    return listRender(PostElement,values)
}

const ListPage = ({ values }:{ values: Page[] }) => {
    const PageElement = ({ value }:{value:Page}) => {
        return <PanePopup show={<PageEdit page={value} />}>
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

const ListLink = ({ values }:{ values: LinkObject[] }) => {
    const LinkElement = ({value}:{value:LinkObject}) => {
        return <PanePopup show={<LinkEdit link={value} />}>
            {open => <ListElement 
                title={value.name}
                metas={<SocialIcon link={value} />}
                onClick={open}
            />}
        </PanePopup>
    }
    return listRender(LinkElement,values)
}

const ListCategory = ({ values }:{ values: Category[] }) => {
    const CategoryElement = ({value}:{value:Category}) => {
        return <PanePopup show={<CategoryEdit category={value} />}>
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


const ListElements = ({ data, state }: { data: [Post[],Page[],LinkObject[],Category[]], state: number }) => {
    switch (state){
        case 0: return <ListPost values={data[state]} />
        case 1: return <ListPage values={data[state]} />
        case 2: return <ListLink values={data[state]} />
        case 3: return <ListCategory values={data[state]} />
        default: return <Error404 />
    }
}

export const ListSwitch = () => {
    const infos = useContext(InfosContext)

    const [pane, setPane] = useState<number>(0)
    const [data, setData] = useState<[Post[],Page[],LinkObject[],Category[]]>([[],[],[],[]])
    const [loaded, setLoading] = useState<boolean>(false);

    useEffect(()=>{(async () =>{
        let posts = await fetch("/api/public/posts").then( res => res.json() ) as unknown as Post[]
        let static_pages = await fetch("/api/public/pages").then( res => res.json() ) as unknown as Page[]
        let links = infos.links
        let categories = await fetch("/api/public/categories").then( res => res.json() ) as unknown as Category[]
        setData([posts,static_pages,links,categories])
        setLoading(true)
    })()},[])

    return <>
        <Row className="row-no-margin">
            <Col xs={12} md={1} className="g-0">
                <ListSelector state={[pane,setPane]} />
            </Col>
            <Col xs={12} md={11} className="g-0">
                <ListElements data={data} state={pane} />
            </Col>
        </Row>
        {loaded?null:<Loading />}
    </>

}