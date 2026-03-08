import request from "supertest";
import { afterAll, beforeAll, expect, test } from "vitest";
import { app } from "../src/app";

beforeAll(async () => {
  await app.ready()
});

afterAll(async () => {  
  await app.close()
});

test('Usuário cria uma nova transação', async () => {
  const response = await request(app.server)
    .post('/transactions')
    .send({
      title: 'Freelance de website',
      amount: 5000,
      type: 'credit'
    });

    expect(response.statusCode).toEqual(201);


});