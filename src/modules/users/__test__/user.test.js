// import necessary modules and files
const request = require('supertest');
const app = require('../../../app');
const url = '/api/v1/users/login';

// test suite for the login API
describe('Login API', () => {
  // test case for successful login
  it('should return a 200 response and a token for valid credentials', async () => {
    const response = await request(app)
      .post(url)
      .send({
        email: 'rama@gmail.com',
        password: '123test'
      });
    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  // test case for unsuccessful login with invalid credentials
  it('should return a 401 response for invalid credentials', async () => {
    const response = await request(app)
      .post(url)
      .send({
        email: 'test@test.com',
        password: 'invalidpassword'
      });
      // console.log(response,"testudsfg")
    expect(response.status).toBe(401);
  });
  
  // test case for missing email field
  it('should return a 400 response for missing email field', async () => {
    const response = await request(app)
      .post(url)
      .send({
        password: 'password123'
      });
    expect(response.status).toBe(401);
  });

  // test case for missing password field
  it('should return a 400 response for missing password field', async () => {
    const response = await request(app)
      .post(url)
      .send({
        email: 'test@test.com'
      });
    expect(response.status).toBe(401);
  });
});
