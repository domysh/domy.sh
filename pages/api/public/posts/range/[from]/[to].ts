import { NextApiRequest, NextApiResponse } from "next"
import { DB } from "../../../../../../js/db"
import { tojsonlike } from "../../../../../../js/utils"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const db = await DB()
        const { from, to } = req.query as {[key:string]:string}
        const params = { from: Math.abs(parseInt(from)), to: Math.abs(parseInt(to)) }

        if (from > to) [params.from, params.to] = [params.to, params.from]
        return res.status(200).json(
            tojsonlike(await db.collection("posts").find({}).skip(params.from).limit(params.to-params.from).toArray())
        )
    }
    return res.status(405).json({status:"Invalid Method"})
}