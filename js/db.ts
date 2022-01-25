import { MongoClient } from "mongodb"
import { GetServerSidePropsContext, GetStaticPaths, GetStaticPropsContext, GetStaticPropsResult, PreviewData } from "next"
import { ParsedUrlQuery } from "querystring"
import { Category, LinkObject, MetaInfo, Page, PageInfo, PublicInfo } from "../modules/interfaces"
import { tojsonlike } from "./utils"

export const DBpromise = (async () => {
    const conn = new MongoClient(process.env.MONGO as string)
    
    const db = (await conn.connect()).db()
    await db.collection("static").findOneAndUpdate(
        {_id:"meta"},
        {$setOnInsert:{
            name:"",
            description:"",
            site_name:"",
            footer:""
        }},
        {upsert:true}
    )

    await db.collection("posts").createIndex({ category:1 })
    await db.collection("posts").createIndex({ star:1 })
    await db.collection("posts").createIndex({ end_date:1 })

    await db.collection("pages").createIndex({ highlighted:1 })

    await db.collection("categories").createIndex({ highlighted:1 })

    return db
})()

export const DB = async () => await DBpromise

export const getPublicInfo = async ():Promise<PublicInfo> => {
    const db = await DB()
    let meta:MetaInfo = (await db.collection("static")
                    .findOne({_id:"meta"})) as unknown as MetaInfo

    let links:LinkObject[] = tojsonlike(await db.collection("links")
            .find({}).toArray()) as LinkObject[]

    let pages:PageInfo[] = []

    let categories = await db.collection("categories")
                .find({}).toArray() as unknown as Category[]
                
    categories.map((obj)=>{ pages.push({path:"/c/"+obj._id,name:obj.name,highlighted:obj.highlighted}) })

    let page_static = await db.collection("pages")
                .find({}).project({_id:true,name:true,highlighted:true}).toArray() as unknown as Page[]
    
    page_static.map((obj) => pages.push({path:"/"+obj._id,name:obj.name,highlighted:obj.highlighted}))

    return { meta, links, pages, categories }
} 

export type serverSitePropsFunc
                 = (context:GetServerSidePropsContext<ParsedUrlQuery, PreviewData>) => Promise<{ [key: string]: any; }>


export function sprops(fn?:serverSitePropsFunc) {
    return async function(context:GetServerSidePropsContext) {
        let result:any = {}
        if (fn != null)
            result = await fn(context)
        if (result.notfound != null) return { notFound:true }
        if (result.redirect != null) return { redirect:result.redirect }
        result.infos = await getPublicInfo()
        return {props:result}
    }
}

export type serverStaticPropsFunc
                 = (context:GetStaticPropsContext) => Promise<{[key:string]:any}>

export function ssprops(fn?:serverStaticPropsFunc, revalidate?:number) {
    return async function(context:GetStaticPropsContext) {
        let result:any = {}
        if (fn != null)
            result = await fn(context)
        if (result.notfound != null) return { notFound:true, revalidate }
        if (result.redirect != null) return { redirect:result.redirect, revalidate }
        result.infos = await getPublicInfo()
        return {props:result, revalidate}
    }
}


export const sspaths:GetStaticPaths = () => {return {paths: [],fallback: "blocking"};}