import axios from 'axios'
import mongoose from 'mongoose'
import { connectDB, dropDB, dropCollections } from './helpers/setupDB'
import { MongoMemoryServer } from 'mongodb-memory-server'
// import { connect } from './Server'
import { startServer, stopServer } from '../../src/app'

let mongo: MongoMemoryServer
let access_token: string

type Service = {
  id: string
  name: string
  logo: string
  notes: string[]
  algorithm: string
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

  describe('GET /service', () => {
    it('should get a list of services', async () => {
      const response = await axios.get('http://localhost:3000/service', {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      })
      console.log(response.data)
      expect(response.status).toBe(200)
      expect(response.data.services.length).toBe(1)
    })

    it('should not get a list of services when access token is missing', async () => {
      expect.assertions(1)
      const response = await axios.get('http://localhost:3000/service').catch(err =>  {
        console.log(err.response.data)
        expect(err.response.status).toBe(401)
      })
    })

    it('should not get a list of services when access token is invalid', async () => {
      expect.assertions(1)
      const response = await axios.get('http://localhost:3000/service', {
        headers: {
          Authorization: `Bearer invalidtoken`
        }
      }).catch(err =>  {
        console.log(err.response.data)
        expect(err.response.status).toBe(400)
      })
    })
  })

  describe('DELETE /service', () => {
    expect.assertions(1)
    it('should delete a service', async () => {
      const services = await axios.post<{ service: Service }>('http://localhost:3000/service', {
        name: 'testservice2',
        logo: 'https://testservice.com/logo.png',
        notes: ['testnote1', 'testnote2'],
        algorithm: 'hp3',
      }, {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }).catch(err =>  {
        console.log(err.response.data)
      })

      if (!services) {
        return
      }

      console.log(services.data)

      const response = await axios.delete('http://localhost:3000/service', {
        data: {
          id: services?.data?.service?.id
        },
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }).catch(err =>  {
        console.log(err.response.data)
        // expect(err.response.status).toBe(400)
      })

      if (!response) {
        return
      }

      console.log(response.data)
      expect(response.status).toBe(200)
    })

    it('should not delete a service when name is invalid', async () => {
      expect.assertions(1)
      const response = await axios.delete('http://localhost:3000/service', {
        data: {
          name: 'invalidName'
        },
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }).catch(err =>  {
        console.log(err.response.data)
        expect(err.response.status).toBe(400)
      })
    })

    it('should not delete a service when name is missing', async () => {
      expect.assertions(1)
      const response = await axios.delete('http://localhost:3000/service', {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }).catch(err =>  {
        console.log(err.response.data)
        expect(err.response.status).toBe(400)
      })
    })

    it('should not delete a service when access token is missing', async () => {
      expect.assertions(1)
      const response = await axios.delete('http://localhost:3000/service', {
        data: {
          id: '5e9d5e8d7c6f6a1f4c6b9c3e'
        }
      }).catch(err =>  {
        console.log(err.response.data)
        expect(err.response.status).toBe(401)
      })
    })

    it('should not delete a service when access token is invalid', async () => {
      expect.assertions(1)
      const response = await axios.delete('http://localhost:3000/service', {
        data: {
          id: '5e9d5e8d7c6f6a1f4c6b9c3e'
        },
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