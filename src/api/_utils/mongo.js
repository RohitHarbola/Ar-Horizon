import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = 'Ar-horizon';

if (!MONGODB_URI) {
  throw new Error('Define MONGODB_URI environment variable');
}

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(MONGODB_URI, {
    serverApi: {
      version: '1',
      strict: true,
      deprecationErrors: true,
    },
    maxPoolSize: 50,
    socketTimeoutMS: 30000
  });

  try {
    await client.connect();
    const db = client.db(MONGODB_DB);
    
    cachedClient = client;
    cachedDb = db;

    return { client, db };
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    throw error;
  }
}