import { MongoClient } from 'mongodb';
import { download_favicon } from './db';


/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentiatlly
 * during API Route usage.
 * https://github.com/vercel/next.js/pull/17666
 */
global.mongo = global.mongo || {};

async function createIndexes(db) {
    await Promise.all([
        db.collection("static").findOneAndUpdate(
            {_id:"meta"},
            {$setOnInsert:{
                name:"",
                description:"",
                site_name:"",
                footer:""
            }},
            {upsert:true}
        ),
        db.collection("posts").createIndexes([
            { key: { category: 1 } },
            { key: { star: 1 } },
            { key: { end_date: 1 } }
        ]),
        db.collection("pages").createIndex({ highlighted:1 }),
        db.collection("categories").createIndex({ highlighted:1 }),
        //download_favicon(db)
    ]);
    global.mongo.indexesCreated = true;
}

export async function getMongoClient() {
  if (!global.mongo.client) {
    global.mongo.client = new MongoClient(process.env.MONGO);
  }
  // It is okay to call connect() even if it is connected
  // using node-mongodb-native v4 (it will be no-op)
  // See: https://github.com/mongodb/node-mongodb-native/blob/4.0/docs/CHANGES_4.0.0.md
  await global.mongo.client.connect();
  return global.mongo.client;
}

export default async function database() {
  if (!global.mongo.client) {
    global.mongo.client = new MongoClient(process.env.MONGO);
  }
  const dbClient = await getMongoClient();
  const db = dbClient.db(); // this use the database specified in the MONGODB_URI (after the "/")
  if (!global.mongo.indexesCreated) await createIndexes(db);
  return db;
}