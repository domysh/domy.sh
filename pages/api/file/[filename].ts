import { DB, DocumentWithStingId } from "../../../js/db"
import { NextApiRequest, NextApiResponse } from "next"
import { Binary } from "mongodb"
import { filename_simplify } from "../../../js/utils"
import { promises as fs } from "fs"
import { FileContent, FileInfo } from "../../../modules/interfaces"

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    const db = await DB()
    if (req.method === 'GET') {
        const { filename } = req.query
        let result = (await db.collection<DocumentWithStingId>("files").findOne({_id:filename},{projection:{_id:1,filename:1}})) as unknown as FileInfo
        let file_content = null;
        const fn = filename_simplify(result.filename??filename)
        if (result){
            try {
                file_content = await fs.readFile('/tmp/'+result._id);
            } catch (err) {
                let query_result = (await db.collection<DocumentWithStingId>("files").findOne({_id:filename})) as unknown as FileContent
                if (!query_result) return res.status(404).json({status:"File not found!"})
                file_content = (query_result.content as Binary).buffer
                await fs.writeFile("/tmp/"+query_result._id, file_content)
            }
            res.setHeader('Content-Disposition', 'attachment; filename='+fn);
            return res.send(file_content)
        }
        return res.status(404).json({status:"File not found!"})
    }
    return res.status(405).json({status:"Invalid Method"})
}