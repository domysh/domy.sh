import { DBCollection } from "../../../../js/db"
import { tojsonlike } from "../../../../js/utils"

export default async function handler(req, res) {
    if (req.method === 'GET') {
        return res.status(200).json(await DBCollection("posts", async (db) => {
            return tojsonlike(await db.find({}).toArray())
        }))
    }
    return res.status(405).json({status:"Invalid Method"})
}