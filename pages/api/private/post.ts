import { DB } from "../../../js/db"
import { getSession } from "next-auth/react"

import { validData } from "../../../js/utils"
import { NextApiRequest, NextApiResponse } from "next"
import { ObjectId } from "mongodb"

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const db = await DB()
    const session = await getSession({ req })
    if (session == null)
        return res.status(401).json({status:"unauthorized"})

    if (req.method === 'POST') {
        const validate = validData(req.body, {
            _id:"string",
            title:"required|string",
            description:"present|string",
            category:"present|string",
            star:"required|boolean",
            date:"required|string",
            end_date:"required|string"
        });
        if (validate.valid){
            let request = validate.data
            try{
                request.date = new Date(request.date)
                request.end_date = new Date(request.end_date)
            }catch(err){
                return res.status(400).json({status:"Invalid Date format!"})
            }

            if (request.title === ""){
                return res.status(400).json({status:"A title is required!"})
            }

            if (request._id == null){
                await db.collection("posts").insertOne(request)
                return res.status(200).json({status:"ok"})
            }else{
                try{
                    request._id = new ObjectId(request._id)
                }catch(err){
                    return res.status(400).json({status:"Invalid Post ID"})
                }
                try{
                    await db.collection("posts").updateOne({_id:request._id},{$set:request})
                }catch(err){
                    return res.status(400).json({status:"The post to edit does not exists"})
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
                return res.status(400).json({status:"Invalid Post ID"})
            }
            await db.collection("posts").deleteOne(request)
            return res.status(200).json({status:"ok"})
        }
        return res.status(400).json({status:"Bad request"})
    }
    return res.status(405).json({status:"Invalid Method"})
}