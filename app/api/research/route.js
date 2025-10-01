import { connectToDatabase } from '../../../lib/mongodb';

export async function POST(request) {
  try {
    const body = await request.json();

   const client = await connectToDatabase(); // returns connected client
const db = client.db('test'); // now this works

    const collection = db.collection('publications');

    const existingResearch = await collection.findOne({ link: body.link });

    if (existingResearch) {
      return new Response(
        JSON.stringify({ error: 'true', message: 'Research link already exists.' }),
        { status: 400 }
      );
    }

    const result = await collection.insertOne({
      title: body.title,
      link: body.link,
      createdAt: new Date(),
    });

    // Fetch the inserted document using insertedId
    const newResearch = await collection.findOne({ _id: result.insertedId });

    return new Response(
      JSON.stringify({ error: 'false', message: 'Success', research: newResearch }),
      { status: 201 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'true', message: err.message }),
      { status: 500 }
    );
  }
}
