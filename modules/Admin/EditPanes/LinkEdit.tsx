import { useState } from "react"
import { LinkObject } from "../../interfaces"
import Router from "next/router"
import { Alert, Button, FormControl, InputGroup } from "react-bootstrap"
import style from "../style.module.scss"
import { HuePicker, TwitterPicker } from "react-color"
import { categoryIconColor } from "../../Posts"
import { SocialIcon } from "../../SocialIcon"
import { IconPicker } from "../../IconPicker"

export const LinkEdit = ({ link }:{ link?:LinkObject }) => {
    const [name, setName] = useState<string>(link?link.name:"")
    const [color, setColor] = useState<string>(link?link.color:"")
    const [icon, setIcon] = useState<string>(link?link.icon:"")
    const [url, setUrl] = useState<string>(link?link.url:"")
    const [error, setError] = useState<string|null>(null);

    const original = name === (link?link.name:"") && color === (link?link.color:"") &&
        icon === (link?link.icon:"") && url === (link?link.url:"")

    let request = {name,color,icon,url,_id:link?link._id:null}

    const submitData = () => {
        fetch("/api/private/link",{
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

    const deleteData = () => {
        if(confirm("Are you sure to delete '"+name+"'")){
            fetch("/api/private/link",{
                method:"DELETE",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({_id:link?._id})
            }).then( res => res.json() ).then(res => {
                if (res.status === "ok")
                    Router.reload()
                else
                    setError(res.status)
            }).catch(err => {
                setError("Error: "+err)
            })
        }
    }
    return <>
    <h1 style={{ textAlign:"center" }}>
        {link?"Editor":"Create"} Static Page
        {original?<Button className={style.donebtn} variant="success" disabled><i className="fas fa-check" /></Button>:
            <Button className={style.donebtn} variant="success" onClick={submitData}><i className="fas fa-check" /></Button>}
        {link?<Button className={style.donebtn} onClick={deleteData} style={{marginLeft:"20px"}} variant="danger"><i className="fas fa-trash" /></Button>:null}
    </h1>
    <div style={{marginTop:"40px"}} />
    
    <InputGroup className="mb-3">
        <InputGroup.Text><b>Name</b></InputGroup.Text>
        <FormControl defaultValue={name} onChange={(v)=>{setName((v.target as HTMLInputElement).value)}} />
    </InputGroup>
    <InputGroup className="mb-3">
        <InputGroup.Text><b>Url</b></InputGroup.Text>
        <FormControl defaultValue={url} onChange={(v)=>{setUrl((v.target as HTMLInputElement).value)}} />
    </InputGroup>
    
    <div className="center-flex" style={{justifyContent:"space-around"}}>
        <IconPicker value={icon} onChange={v=>{setIcon(v)}} color={ color !== ""?color:categoryIconColor } />
        <div style={{transform:"scale(2)",padding:"40px"}} className="center-flex" >
            <SocialIcon link={request as LinkObject} />
        </div>
        <div className="center-flex" style={{flexDirection:"column"}}>
            <TwitterPicker triangle="hide" color={ color !== ""?color:categoryIconColor } onChangeComplete={ (v:{hex:string})=>{setColor(v.hex)} } />
            <div style={{marginTop:"20px"}}>
                <HuePicker color={ color !== ""?color:categoryIconColor } onChange={ (v:{hex:string})=>{setColor(v.hex)} } />
            </div>
        </div>
    </div>
    {error?
        <Alert variant="danger" style={{marginTop:"20px"}}>
            {error}
        </Alert>:null}
        
</>
}