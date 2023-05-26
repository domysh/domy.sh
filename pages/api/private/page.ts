import { DB } from "../../../js/db"
import { refresh_pages, validData } from "../../../js/utils"
import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    const db = await DB()
    const session = await getServerSession(req, res, authOptions)
    if (session == null)
        return res.status(401).json({status:"unauthorized"})
    if (req.method === 'POST') {
        const validate = validData(req.body, {
            _id:"present|string",
            name:"required|string",
            description:"present|string",
            content:"present|string",
            highlighted:"required|boolean",
            create:"required|boolean",
        });
        if (validate.valid){
            let request = validate.data

            if (request.name === ""){
                return res.status(400).json({status:"A title is required!"})
            }

            if (request._id === ""){
                request.highlighted = false
            }
            const create = request.create
            delete request.create
            if (create){
                if(!new RegExp(/^[A-Za-z0-9_-]*$/).test(request._id)){
                    return res.status(400).json({status:"Invalid link!"})
                }
                try{
                    await db.collection("pages").insertOne(request)
                }catch(err){
                    return res.status(400).json({status:"The page already exists with this link"})
                }
                await refresh_pages(res, db)
                return res.status(200).json({status:"ok"})
            }else{
                try{
                    await db.collection("pages").updateOne({_id:request._id},{$set:request})
                }catch(err){
                    return res.status(400).json({status:"The page to edit does not exists"})
                }
                await refresh_pages(res, db)
                return res.status(200).json({status:"ok"})
            }
            
        }
        return res.status(400).json({status:"Bad request"})
    }else if (req.method === 'DELETE'){
        const validate = validData(req.body, {
            _id:"required|string",
        });
        if (validate.valid){
            await db.collection("pages").deleteOne(validate.data)
            await refresh_pages(res, db, `/${validate.data._id}`)
            return res.status(200).json({status:"ok"})
        }
        return res.status(400).json({status:"Bad request"})
    }
    return res.status(405).json({status:"Invalid Method"})
}
