import { createRef, useContext, useEffect, useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { dataDelete } from ".";
import { AdminDataReload } from "..";
import { Loading } from "../../Errors";
import { FileInfo } from "../../interfaces";
import style from "../style.module.scss"

export const UploadFile = ({ close }:{ close:()=>void }) => {
    const [file, setFile] = useState<File|null>(null);
    const [success, setSuccess] = useState<string|null>(null);
    const [error, setError] = useState<string|null>(null);

    const form_input = createRef<HTMLFormElement>()
    const reload = useContext(AdminDataReload)

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
            reload()
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