import { DB } from "../../../js/db"
import { getSession } from "next-auth/react"
import { validData } from "../../../js/utils"
import { NextApiRequest, NextApiResponse } from "next"
import { ObjectId } from "mongodb"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const db = await DB()
    const session = await getSession({ req })
    if (session == null)
        return res.status(401).json({status:"unauthorized"})

    if (req.method === 'POST') {
        const validate = validData(req.body, {
            _id:"string",
            name:"required|string",
            color:"required|string",
            icon:"required|string",
            url:"required|string"
        });
        if (validate.valid){
            let request = validate.data

            if (request._id == null){
                await db.collection("links").insertOne(request)
                return res.status(200).json({status:"ok"})
            }else{
                try{
                    request._id = new ObjectId(request._id)
                }catch(err){
                    return res.status(400).json({status:"Invalid Link ID"})
                }
                try{
                    await db.collection("links").updateOne({_id:request._id},{$set:request})
                }catch(err){
                    return res.status(400).json({status:"The link to edit does not exists"})
                }
                return res.status(200).json({status:"ok"})
            }
        }
        return res.status(400).json({status:"Bad request"})
    }else if (req.method === 'DELETE'){
        const validate = validData(req.body, {
            _id:"required|string",
        });
        if (validate.valid){
            let request = validate.data
            try{
                request._id = new ObjectId(request._id)
            }catch(err){
                return res.status(400).json({status:"Invalid Link ID"})
            }
            await db.collection("links").deleteOne(request)
            return res.status(200).json({status:"ok"})
        }
        return res.status(400).json({status:"Bad request"})
    }
    return res.status(405).json({status:"Invalid Method"})
}