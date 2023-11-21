import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

export const connectDB = async () => {
  const mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
 
  await mongoose.connect(uri);

  return mongo
}

export const dropDB = async (mongo: MongoMemoryServer) => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongo.stop();
}

export const dropCollections = async (mongo: MongoMemoryServer) => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
}

export default { connectDB, dropDB, dropCollections }