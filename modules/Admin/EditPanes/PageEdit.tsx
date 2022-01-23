import { useState } from "react"
import { Alert, Button, Form, FormControl, InputGroup } from "react-bootstrap"
import ReactMarkdown from "react-markdown"
import { dataDelete, dataEdit, MdEditor } from "."
import { Page } from "../../interfaces"
import style from "../style.module.scss"

export const PageEdit = ({ page, close }:{ page?:Page, close:()=>void }) => {
    const [name, setName] = useState<string>(page?page.name:"")
    const [description, setDescription] = useState<string>(page?page.description:"")
    const [content, setContent] = useState<string>(page?page.content:"")
    const [_id, setRawId] = useState<string>(page?page._id:"")
    const [highlighted, setHighlighted] = useState<boolean>(page?page.highlighted:false)
    const [error, setError] = useState<string|null>(null);

    const original = name === (page?page.name:"") && description === (page?page.description:"") &&
        content === (page?page.content:"") && _id === (page?page._id:"") && highlighted === (page?page.highlighted:false)

    const setId = (v:string) => {
        const check = new RegExp(/^[A-Za-z0-9_-]$/);
        const res = v.split("").map( (c:string) => {
            if (check.test(c)) return c
            else return ""
        }).join("")
        setRawId(res)   
    }

    const currentObj = {_id,highlighted,content,description,name,create:page?false:true}

    const submitData = dataEdit("page", currentObj, setError, close)
    const deleteData = dataDelete("page",name,{_id:page?._id},setError, close)

    return <>
    <h1 style={{ textAlign:"center" }}>
        {page?"Editor":"Create"} Static Page
        {original?<Button className={style.donebtn} variant="success" disabled><i className="fas fa-check" /></Button>:
            <Button className={style.donebtn} variant="success" onClick={submitData}><i className="fas fa-check" /></Button>}
        {page?<Button className={style.donebtn} onClick={deleteData} style={{marginLeft:"20px"}} variant="danger"><i className="fas fa-trash" /></Button>:null}
    </h1>
    <div style={{marginTop:"40px"}} />
    
    <InputGroup className="mb-3">
        <InputGroup.Text><b>Name</b></InputGroup.Text>
        <FormControl defaultValue={name} onChange={(v)=>{setName((v.target as HTMLInputElement).value)}} />
        {_id === ""?null:<><InputGroup.Text><b>Highlighted</b></InputGroup.Text>
        <InputGroup.Text onClick={()=>{setHighlighted(!highlighted)}}><Form.Check type="checkbox" checked={highlighted} readOnly /></InputGroup.Text></>}
    </InputGroup>
    <InputGroup className="mb-3">
        <InputGroup.Text><b>Description</b></InputGroup.Text>
        <FormControl defaultValue={description} onChange={(v)=>{setDescription((v.target as HTMLInputElement).value)}} />
        <InputGroup.Text><b>Link</b></InputGroup.Text>
        {!page? <FormControl value={"/"+_id} onChange={(v)=>{setId((v.target as HTMLInputElement).value.substring(1))}} />:
            <InputGroup.Text><b>/{_id}</b></InputGroup.Text>}
    </InputGroup>
    
    <MdEditor
        className={style.mdeditor}
        renderHTML={(v) => <ReactMarkdown>{v}</ReactMarkdown>}
        defaultValue={content}
        onChange={(v)=>{setContent(v.text)}}
    />
    {error?
        <Alert variant="danger" style={{marginTop:"20px"}}>
            {error}
        </Alert>:null}
        
</>

}