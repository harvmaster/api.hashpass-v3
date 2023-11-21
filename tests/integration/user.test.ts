import axios from 'axios'
import mongoose from 'mongoose'
import { connectDB, dropDB, dropCollections } from './setupDB'
import '../../src/app'
import { MongoMemoryServer } from 'mongodb-memory-server'

let mongo: MongoMemoryServer

beforeAll(async () => {
  mongo = await connectDB()
})

afterAll(async () => {
  await dropCollections(mongo)
  await dropDB(mongo)
  await mongoose.disconnect()
})

describe('User', () => {
  describe('POST /user', () => {
    it('should create a new user', async () => {
      const response = await axios.post('http://localhost:3000/user', {
        username: 'testuser',
        password: 'testpassword'
      })
      console.log(response.data)
      expect(response.status).toBe(201)
    })
  })
  
  let access_token: string
  let refresh_token: string

  describe('POST /user/login', () => {
    it('should login a user', async () => {
      const response = await axios.post('http://localhost:3000/user/login', {
        username: 'testuser',
        password: 'testpassword'
      })
      console.log(response.data)
      access_token = response.data.access_token
      refresh_token = response.data.refresh_token.token

      expect(response.status).toBe(200)
    })
  })

  describe('GET /user', () => {
    it('should get a user', async () => {
      const response = await axios.get('http://localhost:3000/user', {
        headers: {
          'Authorization': `Bearer ${access_token}`
        }
      })
      console.log(response.data)
      expect(response.status).toBe(200)
    })
  })

  describe('POST /user/refresh', () => {
    it('should refresh a user', async () => {
      const response = await axios.post('http://localhost:3000/user/refresh', {
        refresh_token
      })
      console.log(response.data)
      access_token = response.data.access_token
      expect(response.status).toBe(200)
    })
  })


})
