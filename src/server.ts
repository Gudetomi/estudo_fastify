import 'dotenv/config'
import fastify from 'fastify'
//import da conexao com o banco
import { randomUUID } from 'node:crypto'
import { knex } from './database'
const app = fastify()

app.get('/', async () => {
  const transaction = await knex('transactions').insert({
    id:randomUUID(),
    title: 'Transação de teste',
    amount: 100,
  }).returning('*')
  return transaction
}).listen({
  port:3333
}).then(() => {
  console.log('Server is running on port 3333')
}).catch((err) => {
  console.error('Error starting server:', err)
})