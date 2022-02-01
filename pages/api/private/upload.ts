import { DB } from "../../../js/db"
import { NextApiRequest, NextApiResponse } from "next"
import { File, IncomingForm } from "formidable";
import { getSession } from "next-auth/react";
import fs from 'fs';
import { filename_simplify, validData } from "../../../js/utils";
import { randomUUID } from "crypto";

export const config = {
    api: {
      bodyParser: false,
    }
};

const readUploadedFile = async (file:File) => {
    return await new Promise<Buffer>((resolve) => {
        fs.readFile(file.filepath, (err, data) => resolve(data));
    })
}

const upload_file = async (res:NextApiResponse, file:File) => {
    const db = await DB()
    const unique_name = randomUUID()
    const filename = filename_simplify(file.originalFilename ? file.originalFilename : unique_name)
    try{
        await db.collection("files").insertOne({
            _id: unique_name,
            filename: filename,
            content: await readUploadedFile(file)
        } as any)
        return res.status(200).json({status: "ok"})
    }catch(err){
        return res.status(400).json({ status: "Filename already exists!" })
    }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const db = await DB()
    const session = await getSession({ req })
    if (session == null)
        return res.status(401).json({status:"unauthorized"})
    if (req.method === 'POST') { 
        const form = new IncomingForm({maxFileSize:1024*1024*10, maxFiles:1, allowEmptyFiles:false})
        try{
            const file = await new Promise<File>((resolve, reject)=>{
                form.parse(req, (err, fields, files) => {
                    if (!err)
                        if (!Array.isArray(files.file)) resolve(files.file)
                        else reject("Upload only one file")
                    reject(err)
                })
            })
            return await upload_file(res, file)
        }catch(err){
            if (err instanceof Error) {
                if (err.message.includes("options.maxFileSize"))
                    return res.status(400).json({status:"Upload a file not bigger than 10Mb"})
                return res.status(400).json({status:err.message})
            }     
            return res.status(400).json({status:"Bad request"})
        }
    }
    return res.status(405).json({status:"Invalid Method"})
}
