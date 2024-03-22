import axios from 'axios'
import mongoose from 'mongoose'
import { connectDB, dropDB, dropCollections } from './helpers/setupDB'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { startServer, stopServer } from '../../src/app'

let mongo: MongoMemoryServer
let access_token: string

const DEBUG = false
const log = (...args: any[]) => {
  if (DEBUG) {
    console.log(...args)
  }
}

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

      log(data)
      expect(data).toBeDefined()
    })

    it('should return an error when domain is missing', async () => {
      const { data } = await axios.get('http://localhost:3000/logo/domain',
      {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }).catch(err => {
        log(err.response.data)
        expect(err.response.status).toBe(400)
        return err.response
      })
      expect(data).toStrictEqual({"error": "Domain is required"})
    })

    it('should return an error when access_token is missing', async () => {
      const { data } = await axios.get('http://localhost:3000/logo/domain?domain=github.com').catch(err => {
        log(err.response.data)
        expect(err.response.status).toBe(401)
        return err.response
      })
      expect(data).toBe("Unauthorized")
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

      log(data)
      expect(data).toBeDefined()
    })
  })
})
