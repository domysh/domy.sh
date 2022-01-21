import { Button, Container, FormControl, InputGroup } from "react-bootstrap"
import style from "./style.module.scss"
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from 'next/dynamic';
import 'react-markdown-editor-lite/lib/index.css';
import ReactMarkdown from "react-markdown";
import { MdPost } from "../utils";
import { useContext, useState } from "react";
import { Post } from "../interfaces";
import { Star } from "../Posts";
import { EmojiRender } from "../EmojiRender";
import { InfosContext } from "../Context/Infos";
import Popup from "reactjs-popup";
import Router from 'next/router'


export const PanePopup = ({ show, children }:{ show:JSX.Element, children:(s:()=>void)=>JSX.Element }) => {
    const [open, setOpen] = useState(false);
    const closeModal = () => setOpen(false);
    return (<>
        {children(()=>{setOpen(true)})}
        <Popup open={open} closeOnDocumentClick onClose={closeModal}>
            <div className={style.panewindow}>
                <div className="center-flex" style={{height:"100%"}}>
                    <div>
                        <div className={style.panewindow_header}>
                            <i className="fas fa-times" onClick={closeModal} />
                        </div>
                        {show}
                    </div>
                </div>
            </div>
        </Popup>    
    </>);
}

const MdEditor = dynamic(() => import('react-markdown-editor-lite'), {
    ssr: false,
});

export const EditMetas = () => {
    const infos = useContext(InfosContext)
    const [site_name, setSitename] = useState(infos.meta.site_name)
    const [description, setDescription] = useState(infos.meta.description)
    const [footer, setFooter] = useState(infos.meta.footer)
    const [name, setName] = useState(infos.meta.name)
    const original = site_name === infos.meta.site_name && description === infos.meta.description && footer === infos.meta.footer && name === infos.meta.name

    const submitData = () => {
        let request = {site_name, description, footer, name}

        fetch("/api/private/setmeta",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(request)
        }).then(() => {
            Router.reload()
        })
    }

    return <>
        <h1 style={{ textAlign:"center" }}>
            Edit Site Meta Information
            {original?<Button className={style.donebtn} variant="success" disabled><i className="fas fa-check" /></Button>:
                <Button className={style.donebtn} variant="success" onClick={submitData}><i className="fas fa-check" /></Button>}
        </h1>
        <div style={{marginTop:"40px"}} />
        <Container style={{height:"100%"}}>
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
            <MdEditor
                className={style.mdeditor}
                renderHTML={(v)=>{
                    return <EmojiRender><ReactMarkdown>{v}</ReactMarkdown></EmojiRender>}}
                defaultValue={infos.meta.footer}
                onChange={(v)=>{setFooter(v.text)}}
            />
        </Container>
    </>
}

const currentDate = (res:Date|null=null, hideMonth=false) => {
    if (res == null) res = new Date()
    res.setDate(0)
    res.setHours(0)
    res.setMinutes(hideMonth?1:0)
    res.setSeconds(0)
    res.setMilliseconds(0)
    return res.toISOString()
}

export const EditPost = ({ post }:{ post?:Post }) => {
    const [actualDate] = useState(currentDate())

    const [title, setTitle] = useState<string>(post?post.title:"")
    const [description, setDescription] = useState<string>(post?post.description:"")
    const [category, setCategory] = useState<string>(post?post.category:"")
    const [star, setStar] = useState<boolean>(post?post.star:false)
    const [date, setDate] = useState<string>(post?post.date:actualDate)
    const [end_date, setEndDate] = useState<string>(post?post.end_date:actualDate)

    const original = title === (post?post.title:"") && description === (post?post.description:"") &&
                     category === (post?post.category:"") && star === (post?post.star:false) &&
                     date === (post?post.date:actualDate) && end_date === (post?post.end_date:actualDate)

    const submitData = () => {
        let request = {_id:post?post._id:null,title,description,category,star,date,end_date}
        
        fetch("/api/private/setpost",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(request)
        }).then(() => {
            Router.reload()
        })
    }

    return <>
        <h1 style={{ textAlign:"center" }}>
            {post?"Editor":"Create"} Post
            {original?<Button className={style.donebtn} variant="success" disabled><i className="fas fa-check" /></Button>:
                <Button className={style.donebtn} variant="success" onClick={submitData}><i className="fas fa-check" /></Button>}
        </h1>
        <div style={{marginTop:"40px"}} />
        <Container style={{height:"100%"}}>
            <InputGroup className="mb-3" onChange={(v)=>{setTitle((v.target as HTMLInputElement).value)}}>
                <InputGroup.Text id="input-title"><b>Title</b></InputGroup.Text>
                <FormControl aria-describedby="input-title" defaultValue={post?post.title:""} />
                <InputGroup.Text onClick={()=>{setStar(!star)}}><Star star={star} /></InputGroup.Text>
            </InputGroup>
            <MdEditor
                className={style.mdeditor}
                renderHTML={(v) => <MdPost>{v}</MdPost>}
                defaultValue={description}
                onChange={(v)=>{setDescription(v.text)}}
            />
        </Container>
    </>
}