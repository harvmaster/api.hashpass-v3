import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

let mongo: MongoMemoryServer

export const connectDB = async () => {
  const mongoInstance = await MongoMemoryServer.create({
    
  });
  const uri = mongoInstance.getUri();
 
  await mongoose.connect(uri);

  mongo = mongoInstance
  return mongo
}

export const dropDB = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongo.stop();
}

export const dropCollections = async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
}

export default { connectDB, dropDB, dropCollections }