import { DBCollection } from "../../../../js/db"
import { tojsonlike } from "../../../../js/utils"

export default async function handler(req, res) {
    if (req.method === 'GET') {
        res.status(200).json(await DBCollection("pages", async (db) => {
            return tojsonlike(await db.find({}).toArray())
        }))
    }
    res.status(404)
}