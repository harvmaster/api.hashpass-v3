import axios from 'axios'
import mongoose from 'mongoose'
import { connectDB, dropDB, dropCollections } from './helpers/setupDB'
import { MongoMemoryServer } from 'mongodb-memory-server'
// import { connect } from './Server'
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

describe('Service', () => {
  describe('POST /service', () => {
    it('should create a new service', async () => {
      const response = await axios.post('http://localhost:3000/service', {
        name: 'testservice',
        logo: 'https://testservice.com/logo.png',
        notes: ['testnote1', 'testnote2'],
        algorithm: 'hp3',
      }, {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      })
      console.log(response.data)
      expect(response.status).toBe(201)
    })

    it('should not create a new service when name is missing', async () => {
      expect.assertions(1)
      const response = await axios.post('http://localhost:3000/service', {
        logo: 'https://testservice.com/logo.png',
        notes: ['testnote1', 'testnote2'],
        algorithm: 'hp3',
      }, {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }).catch(err =>  {
        console.log(err.response.data)
        expect(err.response.status).toBe(400)
      })
    })

    it('should not create a new service when algorithm is missing', async () => {
      expect.assertions(1)
      const response = await axios.post('http://localhost:3000/service', {
        name: 'testservice3',
        logo: 'https://testservice.com/logo.png',
        notes: ['testnote1', 'testnote2'],
      }, {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }).catch(err =>  {
        console.log(err.response.data)
        expect(err.response.status).toBe(400)
      })
    })

    it('should not create a new service when access token is missing', async () => {
      const response = await axios.post('http://localhost:3000/service', {
        name: 'testservice4',
        logo: 'https://testservice.com/logo.png',
        notes: ['testnote1', 'testnote2'],
        algorithm: 'hp3',
      }).catch(err =>  {
        console.log(err.response.data)
        expect(err.response.status).toBe(401)
      })
    })

    it('should not create a new service when access token is invalid', async () => {
      const response = await axios.post('http://localhost:3000/service', {
        name: 'testservice5',
        logo: 'https://testservice.com/logo.png',
        notes: ['testnote1', 'testnote2'],
        algorithm: 'hp3',
      }, {
        headers: {
          Authorization: `Bearer invalidtoken`
        }
      }).catch(err =>  {
        console.log(err.response.data)
        expect(err.response.status).toBe(400)
      })
    })
  })
})