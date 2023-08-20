import { createRef, useEffect, useState } from "react";
import { Alert, Button, Form, InputGroup } from "react-bootstrap";
import { dataDelete, PanePopup } from ".";
import { Loading } from "../../Errors";
import { FileInfo } from "../../interfaces";
import { ListElement, listRender } from "../Lists";
import style from "../style.module.scss"
import { SmallFileDetails } from "..";
import { img_extentions } from "../../utils";

export const UploadFile = ({ onChange }: { onChange?:()=>void }) => {
    const [file, setFile] = useState<File|null>(null);
    const [success, setSuccess] = useState<string|null>(null);
    const [error, setError] = useState<string|null>(null);

    const form_input = createRef<HTMLFormElement>()

    useEffect(() => {(async ()=>{if (file && form_input.current){
        const current_form = form_input.current
        const res = await fetch("/api/private/upload",{
            method: "POST",
            body: new FormData(current_form)
        }).then( res => res.json())

        if (res.status !== "ok"){
            setError(res.status)
            setSuccess(null)
        }
        else{
            setSuccess(file.name)
            setError(null)
            onChange?onChange():null
        }
        
        current_form.reset()
        setFile(null)
    }})()},[file])
    
    return (<>
        {file?<Loading />:null}
        <h2>Upload your files here</h2>
        <form ref={form_input} encType="multipart/form-data" >
            <Form.Group controlId="formFile" className="mb-3">
                <Form.Control type="file" name="file" onChange={(res) => {
                    const files = (res.target as HTMLInputElement).files
                    if (files && files.length == 1) setFile(files[0])
                    else setFile(null)
                } }/>
            </Form.Group>
        </form>
        {success?
            <Alert variant="success" style={{marginTop:"20px"}}>
                Upload of '{success}' completed!
            </Alert>:null}
        {error?
            <Alert variant="danger" style={{marginTop:"20px"}}>
                {error}
            </Alert>:null}
    </>)
}

export const ShowFile = ({ close, file }:{ close:()=>void, file:FileInfo }) => {
    const [error, setError] = useState<string|null>(null)
    const deleteData = dataDelete("file",file.filename,{_id:file._id},setError, close)
    return <>
    <h1 style={{ textAlign:"center" }}>
        File View
        <Button className={style.donebtn} onClick={deleteData} style={{marginLeft:"20px"}} variant="danger"><i className="fas fa-trash" /></Button>
    </h1>
    <div style={{marginTop:"40px"}} />
    <div className="center-flex" >
        {img_extentions.find( ext => file.filename.toLowerCase().endsWith("."+ext) )?<img src={`/api/file/${file._id}`} style={{maxHeight:"45vh"}} />:null}
    </div>
    <div style={{marginTop:"40px"}} />
    <Alert variant="dark">
        <h3>Filename: <small>{file.filename}</small></h3>
        <h3>FileID: <small>{file._id}</small></h3>
        <h3>Download: <small><a href={`/api/file/${file._id}`} target="_blank">{`/api/file/${file._id}`}</a></small></h3>
    </Alert>
    {error?
        <Alert variant="danger" style={{marginTop:"20px"}}>
            {error}
        </Alert>:null}
        
    </>
}


const FileSelectPane = ({ close, setFile }:{ close:()=>void, setFile:(file:FileInfo|null)=>void}) => {
    const [fileList,setFileList] = useState<FileInfo[]>([])
    
    const reload_filelist = ()=>{(async ()=>{
        setFileList(await fetch("/api/private/file").then( res => res.json() ) as unknown as FileInfo[])
    })()}

    useEffect(reload_filelist,[])

    const selectFile = (file:FileInfo|null) => {
        setFile(file)
        close()
    }
    

    const LinkElement = ({value}:{value:FileInfo}) => {
        return <div className="center-flex" >
            <SmallFileDetails file={value} />
            <ListElement
                title={value.filename}
                metas={<code>{value._id}</code>}
                onClick={()=>{selectFile(value)}}
                text={`/api/file/${value._id}`}
            />
        </div>
    }
    return <>
        <h1>Choose a file <Button onClick={()=>{selectFile(null)}} style={{marginLeft:"20px"}} variant="danger"><i className="fas fa-times" /></Button></h1>
        <div style={{marginTop:"30px"}} />
        <UploadFile onChange={reload_filelist} />
        <div style={{marginTop:"30px"}} />
        {listRender(LinkElement,fileList, {maxHeight:"65vh"})}
     
    </>
}

export const FileChooser = ({ onChange, file }:{ onChange?:(v:FileInfo|null)=>void, file?:string}) => {

    const [fileSelected, setFile] = useState<FileInfo|null>(null);

    const [loading, setLoading] = useState(false);

    useEffect(()=>{if(file){
        setLoading(true);
        fetch("/api/private/file",{
            method: "POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({_id:file})
        })
        .then(res => res.json())
        .then(res =>{
            setFile(res as FileInfo)
            setLoading(false);
        }).catch(()=>{
            setFile(null)
            setLoading(false);
        })
    }},[])

    useEffect(()=>{onChange?onChange(fileSelected):null},[fileSelected])

    return <>
        <InputGroup className="mb-3 center-flex">
            <PanePopup show={closePane => <FileSelectPane close={closePane} setFile={setFile} />}>
                {open => <Button variant="primary" onClick={open}>
                    {fileSelected?"Change File":"Choose File"}
                </Button>}
            </PanePopup>
            <InputGroup.Text><b>
                {fileSelected?
                    <>Selected: <a href={`/api/file/${fileSelected._id}`} target="_blank">{fileSelected.filename}</a></>:
                    loading?<>Loading...</>:<>No file selected</>}
            </b></InputGroup.Text>
        </InputGroup>
    </>
}