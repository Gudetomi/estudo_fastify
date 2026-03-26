import { execSync } from "node:child_process";
import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { app } from "../src/app";


describe('Transações', () => {
  beforeAll(async () => {
    await app.ready()
  });
  
  afterAll(async () => {  
    await app.close()
  });

  beforeEach(async () => {
    execSync('npm run knex -- migrate:rollback --all');
    execSync('npm run knex -- migrate:latest');
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

  it('Usuário lista uma transação específica', async () => {
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

    const transactionId = listTransactionsResponse.body.transactions[0].id;

    const getTransactionResponse = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookies);
    expect(getTransactionResponse.statusCode).toEqual(200);
    expect(getTransactionResponse.body.transaction).toEqual(
      expect.objectContaining({
        title: 'Freelance de website',
        amount: 5000,
      })
    );
  })

  it('Usuário solicita o resumo das transações', async () => {
    const createTransactionResponse = await request(app.server)
    .post('/transactions')
    .send({
    title: 'Freelance de website',
    amount: 5000,
    type: 'credit'
  });

  const cookies = createTransactionResponse.get('Set-Cookie');

  await request(app.server)
    .post('/transactions')
    .set('Cookie', cookies)
    .send({
    title: 'Freelance de website',
    amount: 2000,
    type: 'debit'
  });

  const summaryResponse = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies);
    expect(summaryResponse.statusCode).toEqual(200);
    expect(summaryResponse.body.summary).toEqual({amount: 3000});
  })
});