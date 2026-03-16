import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "../src/app";


describe('Transações', () => {
  beforeAll(async () => {
    await app.ready()
  });
  
  afterAll(async () => {  
    await app.close()
  });

  it('Usuário cria uma nova transação', async () => {
    const response = await request(app.server)
      .post('/transactions')
      .send({
      title: 'Freelance de website',
      amount: 5000,
      type: 'credit'
    });
    expect(response.statusCode).toEqual(201);
  });

  it('Usuário lista as transações', async () => {
    const createTransactionResponse = await request(app.server)
    .post('/transactions')
    .send({
    title: 'Freelance de website',
    amount: 5000,
    type: 'credit'
  });
  const cookies = createTransactionResponse.get('Set-Cookie');

  const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies);
    expect(listTransactionsResponse.statusCode).toEqual(200);
    expect(listTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: 'Freelance de website',
        amount: 5000,
      })
    ]);
  })
});