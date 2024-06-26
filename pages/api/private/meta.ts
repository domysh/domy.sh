import { DB, DocumentWithStingId } from "../../../js/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import { refresh_pages, validData } from "../../../js/utils"
import { NextApiRequest, NextApiResponse } from "next"


export default async function handler(req: NextApiRequest, res: NextApiResponse){
    const db = await DB()
    const session = await getServerSession(req, res, authOptions)
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
        });
        if (validate.valid){
            await db.collection<DocumentWithStingId>("static").updateOne({_id:"meta"},{$set:validate.data})
            await refresh_pages(res, db)
            return res.status(200).json({status:"ok"})
        }
        return res.status(400).json({status:"Bad request"})
    }
    return res.status(405).json({status:"Invalid Method"})
}
