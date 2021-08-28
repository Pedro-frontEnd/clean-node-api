const request = require('supertest')
const app = require('../config/app')
const bcrypt = require('bcrypt')
const MongoHelper = require('../../infra/helpers/mongo-helper')

describe('Login Routes', () => {
  let userModel

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    userModel = MongoHelper.getCollection('users')
  })

  beforeEach(async () => {
    await userModel.deleteMany()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('Should return 200 when valid credentials are provided', async () => {
    await userModel.insertOne({
      email: 'any_email@email.com',
      password: await bcrypt.hash('hashed_password', 8)
    })
    await request(app)
      .post('/api/login')
      .send({
        email: 'any_email@email.com',
        password: 'hashed_password'
      })
      .expect(200)
  })
})
