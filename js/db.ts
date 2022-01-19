import { Collection, Db, MongoClient } from "mongodb"
import { GetServerSidePropsContext, PreviewData } from "next"
import { ParsedUrlQuery } from "querystring"
import { Category, LinkObject, MetaInfo, Page, PageInfo, PublicInfo } from "../modules/interfaces"

export const DB = async (operations:(db:Db)=>any) => {
    const conn = new MongoClient(process.env.MONGO as string)
    conn.connect()
    let result:any = await operations(conn.db())
    conn.close()
    return result
}

export const DBCollection = async (collection:string,operations:(db:Collection)=>any) => {
    return await DB( async (db) => {
        return await operations(db.collection(collection))
    })
}


export const getPublicInfo = async (db:Db):Promise<PublicInfo> => {
    let meta:MetaInfo = (await db.collection("static")
                            .findOne({_id:"meta"})) as unknown as MetaInfo

    let links:LinkObject[] = (await db.collection("links")
            .find({}).project({_id:false}).toArray()) as LinkObject[]

    let pages:PageInfo[] = []

    let categories = await db.collection("categories")
                .find({}).toArray() as unknown as Category[]
                
    categories.map((obj)=>{ pages.push({path:"/c/"+obj._id,name:obj.name,highlighted:obj.highlighted}) })

    let page_static = await db.collection("pages")
                .find({}).project({_id:true,name:true,highlighted:true}).toArray() as unknown as Page[]
    
    page_static.map((obj) => pages.push({path:"/"+obj._id,name:obj.name,highlighted:obj.highlighted}))

    return { meta, links, pages, categories }
} 

export type serverSitePropsFuncWithDB
                 = (db:Db,context:GetServerSidePropsContext<ParsedUrlQuery, PreviewData>) => Promise<{ [key: string]: any; }>

                 /*
let secret_cache:any = null

export const genSecret = () => randomBytes(48).toString("hex");

export const getSecret = async (name:string) => {
    return await DBCollection("static",async (collection) => {
        if (secret_cache == null){
            let res = await collection.findOne({_id:"secrets"})
            if (res == null){
                secret_cache = {_id:"secrets"}
                await collection.insertOne(secret_cache)
            }else{
                secret_cache = res
            }
        }
        if(secret_cache[name] == null){
            secret_cache[name] = genSecret()
            await collection.updateOne({_id:"secrets"},{"$set":{[name]: secret_cache[name]}})
        }
        return secret_cache[name]
    })
}
*/
export function sprops(fn?:serverSitePropsFuncWithDB) {
    return async function(context:GetServerSidePropsContext) {
        return await DB(async (db) => {
            let result:any = {}
            if (fn != null)
                result = await fn(db,context)
            if (result.notfound != null) return { notFound:true }
            if (result.redirect != null) return { redirect:result.redirect }
            
            result.infos = await getPublicInfo(db)
            return {props:result}
        })
    }
}

export function sauth(fn?:serverSitePropsFuncWithDB) {
    return async function(context:GetServerSidePropsContext) {
        return await DB(async (db) => {
            let result:any = {}
            if (fn != null)
                result = await fn(db,context)
            if (result.notfound != null) return { notFound:true }
            if (result.redirect != null) return { redirect:result.redirect }
            
            result.infos = await getPublicInfo(db)
            return {props:result}
        })
    }
}