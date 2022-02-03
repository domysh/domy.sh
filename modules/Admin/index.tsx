import { Col, Container, Row } from "react-bootstrap"
import React, { useEffect, useState } from "react"
import { Button } from "react-bootstrap"
import currentStyle from "./style.module.scss"
import { logout } from "../Auth";
import { EditMetas, PanePopup } from "./EditPanes";
import { InfosContext } from "../Context/Infos";
import { useContext, createContext } from "react";
import { Spacer } from "../utils"
import { AdminInfos, Category, FileInfo, LinkObject, MetaInfo, Page, Post } from "../interfaces";
import { ListElements, ListSelector } from "./Lists";
import { Loading } from "../Errors";
import Head from "next/head";
import style from "./style.module.scss"

export const Header = () => {
    const infos = useContext(InfosContext)
    return <>
        <h1 className={currentStyle.header}>
            <div className={currentStyle.header_title}>
                Admin Panel - <u>{infos.meta.site_name}</u>
            </div>
            <div className={currentStyle.header_btns} >
                <PanePopup show={closePane => <EditMetas close={closePane} />}>
                    { open => <CircleBtn icon="fas fa-edit" variant="success" onClick={open} /> }
                </PanePopup>
                <CircleBtn onClick={logout} icon="fas fa-sign-out-alt" variant="danger" />
            </div>
        </h1>
    </>
}

export const CircleBtn = React.forwardRef<HTMLButtonElement,{ icon:string, onClick?: (p:any) => any, className?:string|null, variant:string}>(
    ({icon, className, onClick, variant, ...props}, ref)=> {
    return <Button
               ref={ref}
               onClick={onClick}
               className={`${currentStyle.btn} ${className?className:""}`}
               variant={variant}
               {...props}>
            <i className={icon} />
        </Button>
})

export const AdminDataReload = createContext<()=>void>(()=>{})

export const AdminPage = () => {
    const infos = useContext(InfosContext)

    const [pane, setPane] = useState<number>(0)
    const [data, setData] = useState<AdminInfos>([[],[],[],[],[]])
    const [loaded, setLoaded] = useState<boolean>(false);

    useEffect(()=>{
        if (loaded) return;
        else (async () =>{
            const posts = await fetch("/api/public/posts").then( res => res.json() ) as unknown as Post[]
            const static_pages = await fetch("/api/public/pages").then( res => res.json() ) as unknown as Page[]
            infos.links = await fetch("/api/public/links").then( res => res.json() ) as unknown as LinkObject[]
            infos.meta = await fetch("/api/public/meta").then( res => res.json() ) as unknown as MetaInfo
            infos.categories = await fetch("/api/public/categories").then( res => res.json() ) as unknown as Category[]
            const files = await fetch("/api/private/file").then( res => res.json() ) as unknown as FileInfo[]
            setData([posts,static_pages,infos.links,infos.categories,files])
            setLoaded(true)
    })()},[loaded])
    
    return <AdminDataReload.Provider value={() => setLoaded(false)}>
            <Head>
                <title>Admin Interface</title>
            </Head>
            <Header />
            <Container>
                <Row className="row-no-margin">
                    <Col xs={12} md={1} className="g-0">
                        <ListSelector state={[pane,setPane]} />
                    </Col>
                    <Col xs={12} md={11} className="g-0">
                        <ListElements data={data} state={pane} />
                    </Col>
                </Row>
                
            </Container>
            {loaded?null:<Loading />}

        </AdminDataReload.Provider>
}
