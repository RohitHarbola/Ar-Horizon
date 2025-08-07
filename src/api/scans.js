import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      allowedMethods: ['POST'] 
    });
  }

  // Validate request body
  if (!req.body?.userAgent) {
    return res.status(400).json({
      error: 'Missing required fields',
      requiredFields: ['userAgent']
    });
  }

  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri, {
    serverApi: {
      version: '1',
      strict: true,
      deprecationErrors: true,
    },
    maxPoolSize: 10,
    socketTimeoutMS: 30000
  });

  try {
    await client.connect();
    const db = client.db('Ar-horizon');
    
    const result = await db.collection('scanevents').insertOne({
      userAgent: req.body.userAgent,
      ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      timestamp: new Date(),
      metadata: {
        referrer: req.headers.referer,
        origin: req.headers.origin
      }
    });

    return res.status(201).json({
      success: true,
      scanId: result.insertedId,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('MongoDB Error:', error);
    return res.status(500).json({
      error: 'Database operation failed',
      ...(process.env.NODE_ENV === 'development' && {
        details: error.message
      })
    });
  } finally {
    await client.close();
  }
}