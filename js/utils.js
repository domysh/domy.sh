import { ObjectId } from "mongodb";
import Validator from "validatorjs"

function isDict(v) {
    return typeof v==='object' && v!==null && !(v instanceof Array) && !(v instanceof Date);
}

const tojsonserializzable_element = (data) => {
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

export const tojsonlike = (data) => {
    
    if (isDict(data)){
        let res = {}
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

export const jsonextract = (data, ...params) => {
    let res = {}
    params.map( (k) => {
        if (data[k] != null)
            res[k] = data[k]
    })
    return res
}


export const validData = (data,rules) => {
    data = jsonextract(data, ...Object.keys(rules))
    const valid = new Validator(data, {
        site_name:"string",
        footer:"string",
        description:"string",
        name:"string"
    });
    return {data,valid:valid.passes()}
}

export const globalRevalidationTime = !isNaN(parseInt(process.env.REVALIDATE))?parseInt(process.env.REVALIDATE):60