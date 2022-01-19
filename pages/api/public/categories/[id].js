import { DBCollection } from "../../../../js/db"
import { tojsonlike } from "../../../../js/utils"

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { id } = req.query
        return res.status(200).json(await DBCollection("categories", async (db) => {
            return tojsonlike(await db.findOne({_id:id}))
        }))
    }
    return res.status(405).json({status:"Invalid Method"})
}