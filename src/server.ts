import fastify from 'fastify'
//import da conexao com o banco
import { knex } from './database'
const app = fastify()

app.get('/', async () => {
  const tables = await knex('sqlite_schema').select('*')
  return tables
}).listen({
  port:3333
}).then(() => {
  console.log('Server is running on port 3333')
}).catch((err) => {
  console.error('Error starting server:', err)
})