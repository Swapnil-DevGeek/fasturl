import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
const options = { 
  useNewUrlParser: true,
}

let client
let clientPromise

if (!process.env.MONGODB_URI) {
  throw new Error('Add Mongo URI to .env.local')
}

if (process.env.NODE_ENV === 'development') { 
    //@ts-ignore
  if (!global._mongoClientPromise) {
    //@ts-ignore
    client = new MongoClient(uri, options)
    //@ts-ignore
    global._mongoClientPromise = client.connect()
  }
    //@ts-ignore 
  clientPromise = global._mongoClientPromise
} else {
    //@ts-ignore
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export default clientPromise
