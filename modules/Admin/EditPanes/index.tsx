import { Alert, Button, Container, FormControl, InputGroup } from "react-bootstrap"
import style from "../style.module.scss"
import dynamic from 'next/dynamic';
import 'react-markdown-editor-lite/lib/index.css';
import ReactMarkdown from "react-markdown";
import { useContext, useState } from "react";
import Popup from "reactjs-popup";
import { InfosContext } from "../../Context/Infos";
import { AdminDataReload } from "../";

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
    const closeModal = () => setOpen(false);
    return (<>
        {children(()=>{setOpen(true)})}
        <Popup open={open} closeOnDocumentClick onClose={closeModal} closeOnEscape={false}>
            <div className={style.panewindow}>
                <div className="center-flex" style={{height:"100%"}}>
                    <Container style={{width:"100%"}}>
                        <div className={style.panewindow_header}>
                            <i className="fas fa-times" onClick={closeModal} />
                        </div>
                        {show(closeModal)}
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
    const [name, setName] = useState(infos.meta.name)
    const [error, setError] = useState<string|null>(null);

    const original = site_name === infos.meta.site_name && description === infos.meta.description && footer === infos.meta.footer && name === infos.meta.name

    const submitData = dataEdit("meta", {site_name, description, footer, name}, setError, close)

    return <>
        <h1 style={{ textAlign:"center" }}>
            Edit Site Meta Information
            {original?<Button className={style.donebtn} variant="success" disabled><i className="fas fa-check" /></Button>:
                <Button className={style.donebtn} variant="success" onClick={submitData}><i className="fas fa-check" /></Button>}
        </h1>
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
        {error?
            <Alert variant="danger" style={{marginTop:"20px"}}>
                {error}
            </Alert>:null}
    </>
}





