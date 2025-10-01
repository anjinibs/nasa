import { connectToDatabase } from '../../../lib/mongodb';

export async function GET() {
  try {
    const client = await connectToDatabase();
    const db = client.db('test');
    const collection = db.collection('publications');

    const publications = await collection.find({}).sort({ createdAt: -1 }).toArray();

    return new Response(
      JSON.stringify({ error: 'false', research: publications }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'true', message: error.message }),
      { status: 500 }
    );
  }
}
