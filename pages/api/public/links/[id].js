import { ObjectId } from "mongodb"
import { DBCollection } from "../../../../js/db"
import { tojsonlike } from "../../../../js/utils"

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { id } = req.query
        res.status(200).json(await DBCollection("links", async (db) => {
            return tojsonlike(await db.findOne({_id:ObjectId(id)}))
        }))
    }
    res.status(404)
}