
import { NextApiRequest, NextApiResponse } from "next"
import { DB } from "../../../js/db"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const db = await DB()
        return res.status(200).json(await db.collection("static").findOne({_id:"meta"}))
    }
    return res.status(405).json({status:"Invalid Method"})
}
