import { Binary, Db } from "mongodb"
import { GetServerSidePropsContext, GetStaticPaths, GetStaticPropsContext, PreviewData } from "next"
import { ParsedUrlQuery } from "querystring"
import { Category, LinkObject, MetaInfo, Page, PageInfo, PublicInfo } from "../modules/interfaces"
import { globalRevalidationTime, tojsonlike } from "./utils"
import fs from 'fs';
import database from "./mongodb"

import * as path from "path"

export const download_favicon = async (db:Db) => {
    const meta = await db.collection("static").findOne({_id:"meta"}) as unknown as MetaInfo
    if (meta && meta.favicon_img){
        const favicon = await db.collection("files").findOne({_id:meta.favicon_img})
        if (favicon){
            const favicon_img = (favicon.content as Binary).buffer
            await new Promise((resolve, reject)=>{fs.writeFile(
                path.join(process.cwd(),"public/favicon.ico"), favicon_img, (err)=>{
                if (err) reject(err)
                else resolve(null)
            })})
        }
    }else{
        await new Promise((resolve, reject)=>{fs.copyFile(
            path.join(process.cwd(),"public/default-favicon.ico"),
            path.join(process.cwd(),"public/favicon.ico"), (err)=>{
            if (err) reject(err)
            else resolve(null)
        })})
    }
}

export const DB:()=>Promise<Db> = async () => await database()

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

export function ssprops(fn?:serverStaticPropsFunc, revalidate:number|null = globalRevalidationTime) {
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