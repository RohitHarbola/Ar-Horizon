import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      allowedMethods: ['GET'] 
    });
  }

  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 30000
  });

  try {
    await client.connect();
    const db = client.db('Ar-horizon');
    
    const [totalScans, uniqueIPs, recentScans] = await Promise.all([
      db.collection('scanevents').countDocuments(),
      db.collection('scanevents').distinct('ipAddress'),
      db.collection('scanevents')
        .find()
        .sort({ timestamp: -1 })
        .limit(10)
        .toArray()
    ]);

    // Calculate average time between scans (example metric)
    let avgTimeBetweenScans = 0;
    if (recentScans.length > 1) {
      const timeDiffs = [];
      for (let i = 1; i < recentScans.length; i++) {
        timeDiffs.push(recentScans[i-1].timestamp - recentScans[i].timestamp);
      }
      avgTimeBetweenScans = timeDiffs.reduce((a,b) => a + b, 0) / timeDiffs.length;
    }

    return res.status(200).json({
      totalScans,
      uniqueUsers: uniqueIPs.length,
      averageTimeBetweenScans: avgTimeBetweenScans > 0 
        ? `${(avgTimeBetweenScans/1000).toFixed(2)}s` 
        : 'N/A',
      lastUpdated: new Date()
    });
  } catch (error) {
    console.error('MongoDB Error:', error);
    return res.status(500).json({
      error: 'Failed to fetch analytics',
      ...(process.env.NODE_ENV === 'development' && {
        details: error.message
      })
    });
  } finally {
    await client.close();
  }
}