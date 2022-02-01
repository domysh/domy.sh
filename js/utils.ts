import { ObjectId } from "mongodb";
import Validator from "validatorjs"

function isDict(v:any) {
    return typeof v==='object' && v!==null && !(v instanceof Array) && !(v instanceof Date);
}

const tojsonserializzable_element = (data:any):any => {
    if (data instanceof Date){
        return data.toISOString()
    }else if(data instanceof ObjectId){
        return data.toString()
    }else if(data instanceof Object){
        return tojsonlike(data)
    }else if(data instanceof Array){
        return tojsonlike(data)
    }else{
        return data
    }
}

export const tojsonlike = (data:any) => {
    
    if (isDict(data)){
        let res:{[key:string]:string} = {}
        for (const key of Object.keys(data)){
            res[key] = tojsonserializzable_element(data[key]);
        }
        return res
    }else if (data instanceof Array){
        return data.map( (o) => tojsonserializzable_element(o) )
    }else{
        return tojsonserializzable_element(data)
    }
}

export const jsonextract = (data:{[key:string]:string}, params:string[]) => {
    let res:{[key:string]:string} = {}
    params.map( (k) => {
        if (data[k] != null)
            res[k] = data[k]
    })
    return res
}


export const validData = (data:any,rules:{[key:string]:string}) => {
    try{
        data = jsonextract(data, Object.keys(rules))
        const valid = new Validator(data, rules);
        valid.passes()
        return {data,valid:valid.passes()}
    }catch(err){
        return {data:{},valid:false}
    }
}

export const filename_simplify = (filename:string) => {
    const check = new RegExp(/^[A-Za-z0-9_\-\.]$/);
    filename = filename.replace(/[ \)\(\[\]\{\}=:,;!"'|&]/,"_")
    return filename.split("").map( (c) => {
        if (check.test(c)) return c
        else return ""
    }).join("")
}

export const globalRevalidationTime = process.env.REVALIDATE?parseInt(process.env.REVALIDATE):10