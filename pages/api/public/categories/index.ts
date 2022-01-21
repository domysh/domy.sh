import { NextApiRequest, NextApiResponse } from "next"
import { DB } from "../../../../js/db"
import { tojsonlike } from "../../../../js/utils"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const db = await DB()
        return res.status(200).json(
            tojsonlike(await db.collection("categories").find({}).toArray())
        )
    }
    return res.status(405).json({status:"Invalid Method"})
}