import { Category } from "../../interfaces"
import { useState } from "react"
import { Alert, Button, Form, FormControl, InputGroup } from "react-bootstrap"
import style from "../style.module.scss"
import { HuePicker, TwitterPicker } from "react-color"
import { CategoryButton, categoryIconColor } from "../../Posts"
import { IconPicker } from "../../IconPicker"
import { dataDelete, dataEdit } from "."

export const CategoryEdit = ({ category, close }:{ category?:Category, close:()=>void }) => {

    const [name, setName] = useState<string>(category?category.name:"")
    const [_id, setRawId] = useState<string>(category?category._id:"")
    const [color, setColor] = useState<string>(category?category.color:"")
    const [icon, setIcon] = useState<string>(category?category.icon:"")
    const [description, setDescription] = useState<string>(category?category.description:"")
    const [highlighted, setHighlighted] = useState<boolean>(category?category.highlighted:false)
    const [error, setError] = useState<string|null>(null);

    const setId = (v:string) => {
        const check = new RegExp(/^[A-Za-z0-9_-]$/);
        const res = v.split("").map( (c:string) => {
            if (check.test(c)) return c
            else return ""
        }).join("")
        setRawId(res)   
    }

    const original = name === (category?category.name:"") && color === (category?category.color:"") &&
        icon === (category?category.icon:"") && description === (category?category.description:"") && highlighted === (category?category.highlighted:false)

    const currentObj = {name,_id,color,icon,description,highlighted,create:category?false:true}
    const submitData = dataEdit("category",currentObj, setError, close)
    const deleteData = dataDelete("category",name,{_id:category?._id},setError, close)

    return <>
    <h1 style={{ textAlign:"center" }}>
        {category?"Editor":"Create"} Category
        {original?<Button className={style.donebtn} variant="success" disabled><i className="fas fa-check" /></Button>:
            <Button className={style.donebtn} variant="success" onClick={submitData}><i className="fas fa-check" /></Button>}
        {category?<Button className={style.donebtn} onClick={deleteData} style={{marginLeft:"20px"}} variant="danger"><i className="fas fa-trash" /></Button>:null}
    </h1>
    <div style={{marginTop:"40px"}} />
    
    <InputGroup className="mb-3">
        <InputGroup.Text><b>Name</b></InputGroup.Text>
        <FormControl defaultValue={name} onChange={(v)=>{setName((v.target as HTMLInputElement).value)}} />
        <InputGroup.Text><b>Highlighted</b></InputGroup.Text>
        <InputGroup.Text onClick={()=>{setHighlighted(!highlighted)}}>
            <Form.Check type="checkbox" checked={highlighted} readOnly />
        </InputGroup.Text>
    </InputGroup>
    <InputGroup className="mb-3">
        <InputGroup.Text><b>Description</b></InputGroup.Text>
        <FormControl defaultValue={description} onChange={(v)=>{setDescription((v.target as HTMLInputElement).value)}} />
        <InputGroup.Text><b>Link</b></InputGroup.Text>
        {!category? <FormControl value={"/c/"+_id} onChange={(v)=>{setId((v.target as HTMLInputElement).value.substring(3))}} />:
            <InputGroup.Text><b>/c/{_id}</b></InputGroup.Text>}
    </InputGroup>
    
    <div className="center-flex" style={{justifyContent:"space-around"}}>
        <IconPicker value={icon} onChange={v=>{setIcon(v)}} color={ color !== ""?color:categoryIconColor } />
        <div style={{transform:"scale(2)",padding:"40px"}} className="center-flex" >
            <CategoryButton category={currentObj as Category} />
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