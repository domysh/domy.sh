import { Alert, Button, Col, Container, FormControl, InputGroup, Row } from "react-bootstrap"
import style from "../style.module.scss"
import dynamic from 'next/dynamic';
import 'react-markdown-editor-lite/lib/index.css';
import ReactMarkdown from "react-markdown";
import { useContext, useState } from "react";
import Popup from "reactjs-popup";
import { InfosContext } from "../../Context/Infos";
import { AdminDataReload } from "../";
import { FileChooser } from "./FileEdit";
import { Header } from "../../Header";
import { MetaInfo } from "../../interfaces";

export * from "./CategoryEdit"
export * from "./PostEdit"
export * from "./LinkEdit"
export * from "./PageEdit"

export const dataEdit = (privateUrl:string, request:any, setError: (v:string)=>void, close: ()=>void) => {
    const reload = useContext(AdminDataReload)
    return () => {
        fetch("/api/private/"+privateUrl,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(request)
        }).then( res => res.json() ).then(res => {
            if (res.status === "ok"){
                close()
                reload()
            }else
                setError(res.status)
        }).catch(err => {
            setError("Error: "+err)
        })
    }


}

export const dataDelete = (privateUrl:string, name:string, request:any, setError: (v:string)=>void, close: ()=>void) => {
    const reload = useContext(AdminDataReload)
    return () => {
        if(confirm("Are you sure to delete '"+name+"'")){
            fetch("/api/private/"+privateUrl,{
                method:"DELETE",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(request)
            }).then( res => res.json() ).then(res => {
                if (res.status === "ok"){
                    reload()
                    close()
                }else
                    setError(res.status)
            }).catch(err => {
                setError("Error: "+err)
            })
        }
    }
}

export const PanePopup = ({ show, children }:{ show:(s:()=>void)=>JSX.Element, children:(s:()=>void)=>JSX.Element }) => {
    const [open, setOpen] = useState(false);
    const closeModal = () => {setOpen(false);}
    return (<>
        {children(()=>{setOpen(true)})}
        <Popup open={open} onClose={closeModal} closeOnEscape={false} modal nested>
            <div className={style.panewindow}>
                <div className={style.inner_div}> 
                    <Container style={{width:"100%",height:"100%"}}>
                        <div style={{paddingBottom:"70px"}} />
                        <div className={style.panewindow_header}>
                            <i className="fas fa-times" onClick={closeModal} />
                        </div>
                        <div>
                            {show(closeModal)}
                        </div>
                        <div style={{paddingTop:"70px"}} />
                    </Container>      
                </div>
            </div>
        </Popup>    
    </>);
}

export const MdEditor = dynamic(() => import('react-markdown-editor-lite'), {
    ssr: false,
});

export const EditMetas = ({close}:{close:()=>void}) => {
    const infos = useContext(InfosContext)
    const [site_name, setSitename] = useState(infos.meta.site_name)
    const [description, setDescription] = useState(infos.meta.description)
    const [footer, setFooter] = useState(infos.meta.footer)
    const [profile_img, setProfileImg] = useState(infos.meta.profile_img)
    const [header_img, setHeaderImg] = useState(infos.meta.header_img)
    //const [favicon_img, setFaviconImg] = useState(infos.meta.favicon_img)
    const [name, setName] = useState(infos.meta.name)
    const [error, setError] = useState<string|null>(null);

    const original = site_name === infos.meta.site_name && description === infos.meta.description && footer === infos.meta.footer &&
            name === infos.meta.name && profile_img === infos.meta.profile_img && header_img === infos.meta.header_img
            // && favicon_img === infos.meta.favicon_img

    const submitData = dataEdit("meta", {site_name, description, footer, name,
                        profile_img:profile_img?profile_img:"",
                        header_img:header_img?header_img:"",
                        //favicon_img:favicon_img?favicon_img:"",
                    }, setError, close)

    const actualMeta:MetaInfo = {site_name, description, footer, name,profile_img:profile_img?profile_img:"",header_img:header_img?header_img:""}

    return <>
        <h1 style={{ textAlign:"center" }}>
            Edit Site Meta Information
            {original?<Button className={style.donebtn} variant="success" disabled><i className="fas fa-check" /></Button>:
                <Button className={style.donebtn} variant="success" onClick={submitData}><i className="fas fa-check" /></Button>}
        </h1>
        <div style={{marginTop:"40px"}} />
        <Header meta={actualMeta}/>
        <div style={{marginTop:"40px"}} />
        <InputGroup className="mb-3" onChange={(v)=>{setName((v.target as HTMLInputElement).value)}}>
            <InputGroup.Text id="input-name"><b>Name</b></InputGroup.Text>
            <FormControl aria-describedby="input-name" defaultValue={infos.meta.name} />
        </InputGroup>
        <InputGroup className="mb-3" onChange={(v)=>{setSitename((v.target as HTMLInputElement).value)}}>
            <InputGroup.Text id="input-site-name"><b>Site Name</b></InputGroup.Text>
            <FormControl aria-describedby="input-site-name" defaultValue={infos.meta.site_name} />
        </InputGroup>
        <InputGroup className="mb-3" onChange={(v)=>{setDescription((v.target as HTMLInputElement).value)}}>
            <InputGroup.Text id="input-site-motd"><b>Site Motd</b></InputGroup.Text>
            <FormControl aria-describedby="input-site-name" defaultValue={infos.meta.description} />
        </InputGroup>
        <h3>Footer</h3>
        <MdEditor
            className={style.mdeditor}
            renderHTML={(v)=>{
                return <ReactMarkdown>{v}</ReactMarkdown>}}
            defaultValue={infos.meta.footer}
            onChange={(v)=>{setFooter(v.text)}}
        />
        <div style={{marginTop:"40px"}} />
        <Row>
            <Col xs={12} md={6}style={{textAlign:"center"}}>
                <h4>Profile Image</h4>
                <FileChooser onChange={(file)=>{setProfileImg(file?file._id:undefined)}} file={profile_img} />
            </Col>
            <Col xs={12} md={6} style={{textAlign:"center"}}>
                <h4>Header Image</h4>
                <FileChooser onChange={(file)=>{setHeaderImg(file?file._id:undefined)}} file={header_img}/>
            </Col>
            {/*
            <div style={{marginLeft:"50px"}} />
            <div>
                Site Icon
                <FileChooser onChange={(file)=>{setFaviconImg(file?file._id:undefined)}} file={favicon_img}/>
            </div>
            */}
        </Row>
        {error?
            <Alert variant="danger" style={{marginTop:"20px"}}>
                {error}
            </Alert>:null}
    </>
}





