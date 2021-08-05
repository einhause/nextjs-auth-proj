import {MongoClient} from 'mongodb'

export async function connectDB() {
   const client = MongoClient.connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@${process.env.MONGODB_CLUSTERNAME}.hvsnw.mongodb.net/${process.env.MONGODB_DBNAME}?retryWrites=true&w=majority`)
   return client
}