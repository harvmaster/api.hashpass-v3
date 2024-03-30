import axios from 'axios'
import mongoose from 'mongoose'
import { connectDB, dropDB, dropCollections } from './helpers/setupDB'
import { MongoMemoryServer } from 'mongodb-memory-server'
// import { connect } from './Server'
import { startServer, stopServer } from '../../src/app'

const DEBUG = false
const log = (...args: any[]) => {
  if (DEBUG) {
    console.log(...args)
  }
}

let mongo: MongoMemoryServer
let access_token: string

type Service = {
  id: string
  name: string
  logo: string
  notes: string[]
  encoding: string
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
        notes: {
          username: 'testusername',
          email: 'testemail',
          other: 'testother'
        },
        encoding: 'hp3',
      }, {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      })
      log(response.data)
      expect(response.status).toBe(201)
    })

    it('should not create a new service when name is missing', async () => {
      expect.assertions(1)
      const response = await axios.post('http://localhost:3000/service', {
        logo: 'https://testservice.com/logo.png',
        notes: {
          username: 'testusername',
          email: 'testemail',
          other: 'testother'
        },
        encoding: 'hp3',
      }, {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }).catch(err =>  {
        log(err.response.data)
        expect(err.response.status).toBe(400)
      })
    })

    it('should not create a new service when encoding is missing', async () => {
      expect.assertions(1)
      const response = await axios.post('http://localhost:3000/service', {
        name: 'testservice3',
        logo: 'https://testservice.com/logo.png',
        notes: {
          username: 'testusername',
          email: 'testemail',
          other: 'testother'
        },
      }, {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }).catch(err =>  {
        log(err.response.data)
        expect(err.response.status).toBe(400)
      })
    })

    it('should not create a new service when access token is missing', async () => {
      const response = await axios.post('http://localhost:3000/service', {
        name: 'testservice4',
        logo: 'https://testservice.com/logo.png',
        notes: {
          username: 'testusername',
          email: 'testemail',
          other: 'testother'
        },
        encoding: 'hp3',
      }).catch(err =>  {
        log(err.response.data)
        expect(err.response.status).toBe(401)
      })
    })

    it('should not create a new service when access token is invalid', async () => {
      const response = await axios.post('http://localhost:3000/service', {
        name: 'testservice5',
        logo: 'https://testservice.com/logo.png',
        notes: {
          username: 'testusername',
          email: 'testemail',
          other: 'testother'
        
        },
        encoding: 'hp3',
      }, {
        headers: {
          Authorization: `Bearer invalidtoken`
        }
      }).catch(err =>  {
        log(err.response.data)
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
      log(response.data)
      expect(response.status).toBe(200)
      expect(response.data.services.length).toBe(1)
    })

    it('should not get a list of services when access token is missing', async () => {
      expect.assertions(1)
      const response = await axios.get('http://localhost:3000/service').catch(err =>  {
        log(err.response.data)
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
        log(err.response.data)
        expect(err.response.status).toBe(400)
      })
    })
  })

  describe('DELETE /service', () => {
    it('should delete a service', async () => {
      expect.assertions(1)
      const services = await axios.post<{ service: Service }>('http://localhost:3000/service', {
        name: 'testservice2',
        logo: 'https://testservice.com/logo.png',
        notes: {
          username: 'testusername',
          email: 'testemail',
          other: 'testother'
        },
        encoding: 'hp3',
      }, {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }).catch(err =>  {
        log(err.response.data)
      })

      if (!services) {
        return
      }

      log(services.data)

      const response = await axios.delete('http://localhost:3000/service', {
        data: {
          name: services?.data?.service?.name
        },
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }).catch(err =>  {
        log(err.response.data)
        // expect(err.response.status).toBe(400)
      })

      if (!response) {
        return
      }

      log(response.data)
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
        log(err.response.data)
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
        log(err.response.data)
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
        log(err.response.data)
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
        log(err.response.data)
        expect(err.response.status).toBe(400)
      })
    })
  })

  describe('PUT /service', () => {
    it('should update a service', async () => {
      expect.assertions(2)
      const services = await axios.post<{ service: Service }>('http://localhost:3000/service', {
        name: 'testservice2',
        logo: 'https://testservice.com/logo.png',
        notes: {
          username: 'testusername',
          email: 'testemail',
          other: 'testother'
        },
        encoding: 'hp3',
      }, {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }).catch(err =>  {
        log(err.response.data)
      })

      if (!services) {
        return
      }

      log(services.data)

      const response = await axios.put('http://localhost:3000/service', {
        name: 'testservice2',
        logo: 'https://testservice.com/logo.png',
        notes: {
          username: 'updatedUsername',
          email: 'emailTest',
          other: ''
        },
        encoding: 'hp3',
      }, {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }).catch(err =>  {
        log(err.response.data)
      })

      if (!response) {
        return
      }

      log(response.data)
      expect(response.status).toBe(200)
      expect(response.data.service.notes.username).toBe('updatedUsername')
    })

    it('should not update a service when name is invalid', async () => {
      expect.assertions(1)
      const response = await axios.put('http://localhost:3000/service', {
        id: '5e9d5e8d7c6f6a1f4c6b9c3e',
        name: 'invalidName',
        logo: 'https://testservice.com/logo.png',
        notes: {
          username: 'testUser',
          email: 'testemail',
          other: 'testOther'
        },
        encoding: 'hp3',
      }, {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }).catch(err =>  {
        log(err.response.data)
        expect(err.response.status).toBe(400)
      })
    })

    it('should not update a service when name is missing', async () => {
      expect.assertions(1)
      const response = await axios.put('http://localhost:3000/service', {
        id: '5e9d5e8d7c6f6a1f4c6b9c3e',
        logo: 'https://testservice.com/logo.png',
        notes: {
          username: 'testUser',
          email: 'testemail',
          other: 'testOther'
        },
        encoding: 'hp3',
      }, {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }).catch(err =>  {
        log(err.response.data)
        expect(err.response.status).toBe(400)
      })
    })
  })
})