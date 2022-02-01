import { DB } from "../../../js/db"
import { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react";
import { validData } from "../../../js/utils";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const db = await DB()
    const session = await getSession({ req })
    if (session == null)
        return res.status(401).json({status:"unauthorized"})
    if (req.method === 'GET') {
        try{
            return res.status(200).json(
                await db.collection("files").find({}).project({content:false}).toArray()
            )
        }catch(err){}
        return res.status(400).json({status:"Bad request"})
    }else if (req.method === 'DELETE') {
        const validate = validData(req.body, { _id:"required|string" })
        if (validate.valid){
            try{
                await db.collection("files").deleteOne({
                    _id: validate.data._id
                } as any)
                return res.status(200).json({status: "ok"})
            }catch(err){
                return res.status(400).json({ status: "Filename does not exists!" })
            }
        }
        return res.status(400).json({status:"Bad request"})
    }
    return res.status(405).json({status:"Invalid Method"})
}
