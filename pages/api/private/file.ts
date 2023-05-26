import { DB } from "../../../js/db"
import { NextApiRequest, NextApiResponse } from "next"
import { validData } from "../../../js/utils";
import { promises as fs } from "fs"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    const db = await DB()
    const session = await getServerSession(req, res, authOptions)
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
                try {
                    await fs.unlink('/tmp/'+validate.data._id);
                } catch (error) {}
                return res.status(200).json({status: "ok"})
            }catch(err){
                return res.status(400).json({ status: "Filename does not exists!" })
            }
        }
        return res.status(400).json({status:"Bad request"})
    } else if (req.method === 'POST') {
        const validate = validData(req.body, { _id:"required|string" })
        if (validate.valid){
            try{
                return res.status(200).json((await db.collection("files").find({_id: validate.data._id}).project({content: false}).toArray())[0])
            }catch(err){
                return res.status(400).json({ status: "Filename does not exists!" })
            }
        }
        return res.status(400).json({status:"Bad request"})
    }
    return res.status(405).json({status:"Invalid Method"})
}
