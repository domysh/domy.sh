require("dotenv").config()
const { MongoClient } = require("mongodb")

async function main(){

    const conn = new MongoClient(process.env.MONGO)
    conn.connect()
    const db = conn.db()

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

    conn.close()

}

main()