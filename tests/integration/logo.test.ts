import axios from 'axios'
import mongoose from 'mongoose'
import { connectDB, dropDB, dropCollections } from './helpers/setupDB'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { startServer, stopServer } from '../../src/app'

let mongo: MongoMemoryServer
let access_token: string

const createUser = async () => {
  const { data } = await axios.post('http://localhost:3000/user', {
    username: 'testuser2',
    password: 'testpassword2'
  })

  access_token = data.access_token
}

beforeAll(async () => {
  await startServer()
    mongo = await connectDB()
  await createUser()
})

afterAll(async () => {
  await dropCollections()
  await stopServer()
  // await dropDB(mongo)
  // await mongoose.disconnect()
})

describe('Logo', () => {
  describe('GET /logo/domain', () => {
    it('should return a logo', async () => {
      const { data } = await axios.get('http://localhost:3000/logo/domain?domain=github.com', 
      {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      })

      expect(data).toBeDefined()
    })
  })

  describe('GET /logo/:name', () => {
    it('should return a logo', async () => {
      const { data } = await axios.get('http://localhost:3000/logo?domain=www.github.com',
      {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      })

      expect(data).toBeDefined()
    })
  })
})
