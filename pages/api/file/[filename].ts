import { DB } from "../../../js/db"
import { NextApiRequest, NextApiResponse } from "next"
import { Binary } from "mongodb"
import { filename_simplify } from "../../../js/utils"
import { promises as fs } from "fs"

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    const db = await DB()
    if (req.method === 'GET') {
        const { filename } = req.query
        let result = await db.collection("files").findOne({_id:filename},{projection:{_id:1,filename:1}})
        let file_content = null;
        console.log("File richiesto: "+result)
        if (result){
            try {
                file_content = await fs.readFile('/tmp/'+result._id);
            } catch (err) {
                result = await db.collection("files").findOne({_id:filename})
                if (!result) return res.status(404).json({status:"File not found!"})
                file_content = (result.content as Binary).buffer
                console.log("Scrivo sto file")
                await fs.writeFile("/tmp/"+result._id, file_content)
            }
            const fn = filename_simplify(result.filename?result.filename:filename)
            res.setHeader('Content-Disposition', 'attachment; filename='+fn);
            return res.send(file_content)
        }
        return res.status(404).json({status:"File not found!"})
    }
    return res.status(405).json({status:"Invalid Method"})
}