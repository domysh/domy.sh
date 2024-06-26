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
            _id:"required|string",
            name:"required|string",
            description:"present|string",
            color:"present|string",
            icon:"present|string",
            highlighted:"required|boolean",
            create:"required|boolean",
        });
        if (validate.valid){
            let request = validate.data

            if (request.name === ""){
                return res.status(400).json({status:"A name is required!"})
            }

            if (request._id === ""){
                return res.status(400).json({status:"A link is required!"})
            }
            const create = request.create
            delete request.create
            if (create){
                if(!new RegExp(/^[A-Za-z0-9_-]+$/).test(request._id)){
                    return res.status(400).json({status:"Invalid link!"})
                }
                try{
                    await db.collection("categories").insertOne(request)
                }catch(err){
                    return res.status(400).json({status:"This link of the category already exists!"})
                }
                await refresh_pages(res, db)
                return res.status(200).json({status:"ok"})
            }else{
                try{
                    await db.collection<DocumentWithStingId>("categories").updateOne({_id:request._id},{$set:request})
                }catch(err){
                    return res.status(400).json({status:"The category to edit does not exists"})
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
            await db.collection<DocumentWithStingId>("categories").deleteOne(validate.data)
            await refresh_pages(res, db, `/c/${validate.data._id}`)
            return res.status(200).json({status:"ok"})
        }
        return res.status(400).json({status:"Bad request"})
    }
    return res.status(405).json({status:"Invalid Method"})
}
