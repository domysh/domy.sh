import { DB } from "../../../js/db"
import { NextApiRequest, NextApiResponse } from "next"
import { Binary } from "mongodb"
import { filename_simplify } from "../../../js/utils"

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const db = await DB()
    if (req.method === 'GET') {
        const { filename } = req.query
        const result = await db.collection("files").findOne({_id:filename})
        
        if (result){
            const fn = filename_simplify(result.filename?result.filename:filename)
            res.setHeader('Content-Disposition', 'attachment; filename='+fn);
            return res.send((result.content as Binary).buffer)
        }
        return res.status(404).json({status:"File not found!"})
    }
    return res.status(405).json({status:"Invalid Method"})
}