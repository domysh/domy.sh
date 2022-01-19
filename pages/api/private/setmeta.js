import { DBCollection } from "../../../js/db"
import { getSession } from "next-auth/react"

import { validData } from "../../../js/utils"

export default async function handler(req, res) {
    const session = await getSession({ req })
    if (session == null)
        return res.status(401).json({status:"unauthorized"})

    if (req.method === 'POST') {
        const validate = validData(req.body, {
            site_name:"string",
            footer:"string",
            description:"string",
            name:"string"
        });
        if (validate.valid){
            await DBCollection("static", async (db) => {
                await db.updateOne({_id:"meta"},{$set:validate.data})
            })
            return res.status(200).json({status:"ok"})
        }
        return res.status(400).json({status:"Bad request"})
    }
    return res.status(405).json({status:"Invalid Method"})
}