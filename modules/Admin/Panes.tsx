import { Alert, Button, Container, Form, FormControl, InputGroup } from "react-bootstrap"
import style from "./style.module.scss"
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from 'next/dynamic';
import 'react-markdown-editor-lite/lib/index.css';
import ReactMarkdown from "react-markdown";
import { getCategory, MdPost } from "../utils";
import { useContext, useEffect, useState } from "react";
import { Post } from "../interfaces";
import { CategoryButton, PostBox, PostDate, Star } from "../Posts";
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
                    <Container style={{width:"100%"}}>
                        <div className={style.panewindow_header}>
                            <i className="fas fa-times" onClick={closeModal} />
                        </div>
                        {show}
                    </Container>
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



const PostDatePicker = ({ name, defaultValue, onChange }:{ name:string, defaultValue:string, onChange:(v:string) => void }) => {
    const defaultDate = new Date(defaultValue)
    const [month, setMonth] = useState(defaultDate.getMinutes()===1?"--":(defaultDate.getMonth()+1).toString())
    const [year, setRawYear] = useState(defaultDate.getFullYear().toString())

    const setYear = (value:string) => {
        let res = value.split("").map( (c) => {
            let digit = parseInt(c)
            return (digit >= 0 && digit <= 9)?
                digit.toString():""
        }).join("")
        console.log(res)
        let yy = parseInt(res)
        if (yy < 100 || isNaN(yy)){
            setRawYear("100")   
        }else if (yy > 9999){
            setRawYear("9999")
        }else{
            setRawYear(yy.toString())
        }
    }

    useEffect(()=>{
        onChange(new Date(parseInt(year),(month === "--")?0:parseInt(month)-1, 1,0,(month === "--")?1:0,0,0).toISOString())
    },[year,month])
    return <>
        <InputGroup.Text>
            <b>{name}</b>
        </InputGroup.Text>
        <Form.Select onChange={ (v) => {setMonth((v.target as HTMLSelectElement).value)} } defaultValue={month}>
            {["--",1,2,3,4,5,6,7,8,9,10,11,12].map((o)=><option value={o} key={"month_"+o}>{o}</option>)}
        </Form.Select>
        <FormControl defaultValue={year} type="number" onChange={(v)=>setYear((v.target as HTMLInputElement).value)} />
    
    </>
}

export const EditPost = ({ post }:{ post?:Post }) => {
    const [actualDate] = useState(currentDate())
    const infos = useContext(InfosContext)
    const [title, setTitle] = useState<string>(post?post.title:"")
    const [description, setDescription] = useState<string>(post?post.description:"")
    const [category, setCategory] = useState<string>(post?post.category:"")
    const [star, setStar] = useState<boolean>(post?post.star:false)
    const [date, setDate] = useState<string>(post?post.date:actualDate)
    const [end_date, setEndDate] = useState<string>(post?post.end_date:actualDate)
    const [error, setError] = useState<string|null>(null);

    const original = title === (post?post.title:"") && description === (post?post.description:"") &&
                     category === (post?post.category:"") && star === (post?post.star:false) &&
                     date === (post?post.date:actualDate) && end_date === (post?post.end_date:actualDate)

    let request = {_id:post?post._id:null,title,description,category,star,date,end_date}

    const submitData = () => {
        fetch("/api/private/setpost",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(request)
        }).then( res => res.json() ).then(res => {
            if (res.status === "ok")
                Router.reload()
            else
                setError(res.status)
        }).catch(err => {
            setError("Error: "+err)
        })
    }

    return <>
        <h1 style={{ textAlign:"center" }}>
            {post?"Editor":"Create"} Post
            {original?<Button className={style.donebtn} variant="success" disabled><i className="fas fa-check" /></Button>:
                <Button className={style.donebtn} variant="success" onClick={submitData}><i className="fas fa-check" /></Button>}
        </h1>
        <div style={{marginTop:"40px"}} />
        
        <InputGroup className="mb-3">
            <InputGroup.Text><b>Title</b></InputGroup.Text>
            <FormControl defaultValue={title} onChange={(v)=>{setTitle((v.target as HTMLInputElement).value)}} />
            <InputGroup.Text>
                <CategoryButton category={getCategory(category)} />
            </InputGroup.Text>
            <Form.Select onChange={ (v) => {setCategory((v.target as HTMLSelectElement).value)} } defaultValue={category}>
                <option value="">Select a category</option>
                {infos.categories.map((o,k)=><option value={o._id} key={"category_"+k}>{o.name}</option>)}
            </Form.Select>
            <InputGroup.Text onClick={()=>{setStar(!star)}}><Star star={star} /></InputGroup.Text>
        </InputGroup>

        <InputGroup className="mb-3">

            <PostDatePicker name="From:" defaultValue={date} onChange={(v)=>{setDate(v)}} />
            <PostDatePicker name="To:" defaultValue={end_date} onChange={(v)=>{setEndDate(v)}} />
            <InputGroup.Text>
                <PostDate post_date={date} post_end_date={end_date} />
            </InputGroup.Text>
        </InputGroup>
        
        <MdEditor
            className={style.mdeditor}
            renderHTML={(v) => <MdPost>{v}</MdPost>}
            defaultValue={description}
            onChange={(v)=>{setDescription(v.text)}}
        />
        {error?
            <Alert variant="danger" style={{marginTop:"20px"}}>
                {error}
            </Alert>:null}
        <div className={style.backpost}>
            <PostBox post={request as Post} />
        </div>

            
    </>
}