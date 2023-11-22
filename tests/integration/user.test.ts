import axios from 'axios'
import mongoose from 'mongoose'
import { connectDB, dropDB, dropCollections } from './helpers/setupDB'
import { startServer, stopServer } from '../../src/app'

// import '../../src/app'

beforeAll(async () => {
  await startServer()
  await connectDB()
})

afterAll(async () => {
  await dropCollections()
  await stopServer()
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

    it('should not create a new user with the same username', async () => {
      const response = await axios.post('http://localhost:3000/user', {
        username: 'testuser',
        password: 'testpassword'
      }).catch(err =>  {
        console.log(err.response.data)
        expect(err.response.status).toBe(409)
      })
    })

    it('should not create a new user when username is missing', async () => {
      const response = await axios.post('http://localhost:3000/user', {
        password: 'testpassword'
      }).catch(err =>  {
        console.log(err.response.data)
        expect(err.response.status).toBe(400)
      })
    })

    it('should not create a new user when password is missing', async () => {
      const response = await axios.post('http://localhost:3000/user', {
        username: 'testuser'
      }).catch(err =>  {
        console.log(err.response.data)
        expect(err.response.status).toBe(400)
      })
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

    it('should not login a user with the wrong password', async () => {
      const response = await axios.post('http://localhost:3000/user/login', {
        username: 'testuser',
        password: 'wrongpassword'
      }).catch(err =>  {
        console.log(err.response.data)
        expect(err.response.status).toBe(401)
      })
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

    it('should not get a user without a token', async () => {
      const response = await axios.get('http://localhost:3000/user').catch(err =>  {
        console.log(err.response.data)
        expect(err.response.status).toBe(401)
      })
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

    it('should not refresh a user with the wrong refresh token', async () => {
      const response = await axios.post('http://localhost:3000/user/refresh', {
        refresh_token: 'wrongtoken'
      }).catch(err =>  {
        console.log(err.response.data)
        expect(err.response.status).toBe(401)
      })
    })

    it('should not refresh a user without a refresh token', async () => {
      const response = await axios.post('http://localhost:3000/user/refresh').catch(err =>  {
        console.log(err.response.data)
        expect(err.response.status).toBe(400)
      })
    })
  })
})
