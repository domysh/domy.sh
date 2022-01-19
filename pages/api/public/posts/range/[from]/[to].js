import { DBCollection } from "../../../../../../js/db"
import { tojsonlike } from "../../../../../../js/utils"

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { from, to } = req.query
        const params = { from: Math.abs(parseInt(from)), to: Math.abs(parseInt(to)) }

        if (from > to) [params.from, params.to] = [params.to, params.from]
        return res.status(200).json(await DBCollection("posts", async (db) => {
            return tojsonlike(await db.find({}).skip(params.from).limit(params.to-params.from).toArray())
        }))
    }
    return res.status(405).json({status:"Invalid Method"})
}