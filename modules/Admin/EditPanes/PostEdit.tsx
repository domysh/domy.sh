import { useContext, useEffect, useState } from "react"
import { Alert, Button, Form, FormControl, InputGroup } from "react-bootstrap"
import { dataDelete, dataEdit, MdEditor } from "."
import { InfosContext } from "../../Context/Infos"
import { Post } from "../../interfaces"
import { CategoryButton, PostBox, PostDate, Star } from "../../Posts"
import { getCategory, MdPost } from "../../utils"
import style from "../style.module.scss"

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


export const PostEdit = ({ post, close }:{ post?:Post, close:()=>void }) => {
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

    const currentObj = {_id:post?post._id:null,title,description,category,star,date,end_date}

    const submitData = dataEdit("post",currentObj, setError, close)
    const deleteData = dataDelete("post",title,{_id:post?._id},setError, close)

    return <>
        <h1 style={{ textAlign:"center" }}>
            {post?"Editor":"Create"} Post
            {original?<Button className={style.donebtn} variant="success" disabled><i className="fas fa-check" /></Button>:
                <Button className={style.donebtn} variant="success" onClick={submitData}><i className="fas fa-check" /></Button>}
            {post?<Button className={style.donebtn} onClick={deleteData} style={{marginLeft:"20px"}} variant="danger"><i className="fas fa-trash" /></Button>:null}
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
            <PostBox post={currentObj as Post} />
        </div>

            
    </>
}