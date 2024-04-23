import { Db } from "mongodb"
import { GetServerSidePropsContext, GetStaticPaths, GetStaticPropsContext, PreviewData } from "next"
import { ParsedUrlQuery } from "querystring"
import { Category, LinkObject, MetaInfo, Page, PageInfo, PublicInfo } from "../modules/interfaces"
import { tojsonlike } from "./utils"
import database from "./mongodb"

export type DocumentWithStingId = Omit<Document, "_id"> & { _id: string }

export const DB:()=>Promise<Db> = async () => await database()

export const getPublicInfo = async ():Promise<PublicInfo> => {
    const db = await DB()
    let meta:MetaInfo = (await db.collection<DocumentWithStingId>("static").findOne({"_id":"meta"})) as unknown as MetaInfo

    let links:LinkObject[] = tojsonlike(await db.collection("links")
            .find({}).sort({"_id":1}).toArray()) as LinkObject[]

    let pages:PageInfo[] = []

    let categories = await db.collection("categories")
                .find({}).sort({"_id":1}).toArray() as unknown as Category[]
                
    categories.map((obj)=>{ pages.push({path:"/c/"+obj._id,name:obj.name,highlighted:obj.highlighted}) })

    let page_static = await db.collection("pages")
                .find({}).sort({"_id":1}).project({"_id":true,name:true,highlighted:true}).toArray() as unknown as Page[]
    
    page_static.map((obj) => pages.push({path:"/"+obj._id,name:obj.name,highlighted:obj.highlighted}))

    const publicurl = process.env.NEXTAUTH_URL?process.env.NEXTAUTH_URL:""

    return { meta, links, pages, categories, publicurl }
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

export function ssprops(fn?:serverStaticPropsFunc) {
    return async function(context:GetStaticPropsContext) {
        let result:any = {}
        if (fn != null)
            result = await fn(context)
        if (result.notfound != null) return { notFound:true }
        if (result.redirect != null) return { redirect:result.redirect }
        result.infos = await getPublicInfo()
        return {props:result}
    }
}


export const sspaths:GetStaticPaths = () => {return {paths: [],fallback: "blocking"};}
