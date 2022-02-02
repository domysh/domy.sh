import { DB, download_favicon } from "../../../js/db"
import { getSession } from "next-auth/react"

import { validData } from "../../../js/utils"
import { NextApiRequest, NextApiResponse } from "next"

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const db = await DB()
    const session = await getSession({ req })
    if (session == null)
        return res.status(401).json({status:"unauthorized"})

    if (req.method === 'POST') {
        const validate = validData(req.body, {
            site_name:"string",
            footer:"string",
            description:"string",
            name:"string",
            header_img:"string",
            profile_img:"string",
            favicon_img:"string"
        });
        if (validate.valid){
            await db.collection("static").updateOne({_id:"meta"},{$set:validate.data})
            await download_favicon(db)
            return res.status(200).json({status:"ok"})
        }
        return res.status(400).json({status:"Bad request"})
    }
    return res.status(405).json({status:"Invalid Method"})
}