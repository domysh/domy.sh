import { useState } from "react"
import { LinkObject } from "../../interfaces"
import { Alert, Button, Col, FormControl, InputGroup, Row } from "react-bootstrap"
import style from "../style.module.scss"
import { HuePicker, TwitterPicker } from "react-color"
import { categoryIconColor } from "../../Posts"
import { SocialIcon } from "../../SocialIcon"
import { IconPicker } from "../../IconPicker"
import { dataDelete, dataEdit } from "."

export const LinkEdit = ({ link, close }:{ link?:LinkObject, close:()=>void }) => {
    const [name, setName] = useState<string>(link?link.name:"")
    const [color, setColor] = useState<string>(link?link.color:"")
    const [icon, setIcon] = useState<string>(link?link.icon:"")
    const [url, setUrl] = useState<string>(link?link.url:"")
    const [error, setError] = useState<string|null>(null);

    const original = name === (link?link.name:"") && color === (link?link.color:"") &&
        icon === (link?link.icon:"") && url === (link?link.url:"")

    const currentObj = {name,color,icon,url,_id:link?link._id:null}

    const submitData = dataEdit("link",currentObj, setError, close)
    const deleteData = dataDelete("link",name,{_id:link?._id},setError, close)

    return <>
    <h1 style={{ textAlign:"center" }}>
        {link?"Editor":"Create"} Social Link
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
    
    <Row>
        <Col xs={12} md={4}>
            <div className="center-flex">
            <IconPicker value={icon} onChange={v=>{setIcon(v)}} color={ color !== ""?color:categoryIconColor } />
            </div>
        </Col>
        <Col xs={12} md={4}>
            <div className="center-flex" >
                <div style={{transform:"scale(2)",padding:"60px",pointerEvents: "none"}}>
                <SocialIcon link={currentObj as LinkObject} />
                </div>
            </div>
        </Col>
        <Col xs={12} md={4}>
            <div className="center-flex" style={{flexDirection:"column",height:"100%"}}>
                <TwitterPicker triangle="hide" color={ color !== ""?color:categoryIconColor } onChangeComplete={ (v:{hex:string})=>{setColor(v.hex)} } />
                <div style={{marginTop:"20px"}}>
                    <HuePicker color={ color !== ""?color:categoryIconColor } onChange={ (v:{hex:string})=>{setColor(v.hex)} } />
                </div>
            </div>
        </Col>
    </Row>
    {error?
        <Alert variant="danger" style={{marginTop:"20px"}}>
            {error}
        </Alert>:null}
        
</>
}
