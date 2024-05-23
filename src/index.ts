import fastifyCors from '@fastify/cors'
import fastify from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'

import { importFilesByUrl } from './routes/import-files-by-url'

const app = fastify({ logger: true }).withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(fastifyCors, { origin: ['http://localhost:3000'] })

app.register(importFilesByUrl)

app.listen({ port: 3333 })

export { app }
