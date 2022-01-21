import { useContext, useEffect, useState } from "react";
import { Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { Error404, Loading } from "../Errors";
import { Category, LinkObject, Page, Post, PublicInfo } from "../interfaces";
import { CircleBtn } from "./CircleBtn";
import style from "./style.module.scss"
import { marktext_to_plain } from "../utils";
import { categoryButtonRender, dateRender, Star } from "../Posts";
import { SocialIcon } from "../SocialIcon";
import { EditPost, PanePopup } from "./Panes";
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
        case 1: return <>Page Create</>//<PageEdit />
        case 2: return <>Link Create</>//<LinkEdit />
        case 3: return <>Category Create</>//<CategoryEdit />
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

const ListPost = ({ values }:{ values: Post[] }) => {
    const PostElement = ({post}:{post:Post}) => {
        return <PanePopup show={<EditPost post={post} />}>
            {open => <ListElement 
                title={post.title}
                metas={<>{dateRender(post)} <Star star={post.star} /></>}
                text={marktext_to_plain(post.description)}
                onClick={open}
            />}
        </PanePopup>
    }
    return <div className={style.list}>
        {values.length===0?emptyListMsg:values.map( (o,i) =>  <><PostElement post={o} key={o._id} />{i!==values.length-1?<hr />:null}</>)}
    </div>
}

const ListPage = ({ values }:{ values: Page[] }) => {
    const PageElement = ({page}:{page:Page}) => {
        return <PanePopup show={<>Please, I wanna edit static page /{page._id}</>}>
            {open => <ListElement 
                title={page.name}
                metas={<code>{"/"+page._id}</code>}
                text={marktext_to_plain(page.content)}
                onClick={open}
            />}
        </PanePopup>
    }
    return <div className={style.list}>
        {values.length===0?emptyListMsg:values.map( (o,i) =>  <><PageElement page={o} key={`static_page_${i}`} />{i!==values.length-1?<hr />:null}</>)}
    </div>
}

const ListLink = ({ values }:{ values: LinkObject[] }) => {
    const LinkElement = ({link}:{link:LinkObject}) => {
        return <PanePopup show={<>Please, I wanna edit the link of {link.name}</>}>
            {open => <ListElement 
                title={link.name}
                metas={<SocialIcon link={link} />}
                onClick={open}
            />}
        </PanePopup>
    }
    return <div className={style.list}>
        {values.length===0?emptyListMsg:values.map( (o,i) =>  <><LinkElement link={o} key={`link_${i}`} />{i!==values.length-1?<hr />:null}</>)}
    </div>
}

const ListCategory = ({ values }:{ values: Category[] }) => {
    const CategoryElement = ({category}:{category:Category}) => {
        return <PanePopup show={<>Please, I wanna edit this category: {category.name}</>}>
            {open => <ListElement 
                title={category.name}
                metas={categoryButtonRender(category)}
                text={category.description}
                onClick={open}
            />}
        </PanePopup>
    }
    return <div className={style.list}>
        {values.length===0?emptyListMsg:values.map( (o,i) =>  <><CategoryElement category={o} key={`category_${i}`} />{i!==values.length-1?<hr />:null}</>)}
    </div>
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