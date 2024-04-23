import { NextApiRequest, NextApiResponse } from "next"
import { DB, DocumentWithStingId } from "../../../../js/db"
import { tojsonlike } from "../../../../js/utils"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const db = await DB()
    if (req.method === 'GET') {
        const { id } = req.query
        return res.status(200).json(tojsonlike(
            await db.collection<DocumentWithStingId>("categories").findOne({_id:id})
        ))
    }
    return res.status(405).json({status:"Invalid Method"})
}