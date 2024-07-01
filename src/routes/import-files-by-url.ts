import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { deleteTempFiles } from '../use-cases/delete-temp-files'
import type { FilesData } from '../use-cases/dto.ts'
import { scrapingLightNovelByUrl } from '../use-cases/scrapping-ligth-novel-by-url'
import { sendEmailWithPdfs } from '../use-cases/send-email-with.pdfs'

const lightNovelUrlSchema = z
  .string()
  .url()
  .refine((url) => url.startsWith('https://tsundoku.com.br'))

export async function importFilesByUrl(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/files/import',
    {
      schema: {
        body: z.object({
          urls: z.array(lightNovelUrlSchema).min(1),
        }),
      },
    },
    async (req, reply) => {
      const filesHistory: FilesData = []

      try {
        const { urls } = req.body

        console.log('Buscando os arquivos nos links: ', JSON.stringify(urls))

        const { filesPaths } = await scrapingLightNovelByUrl({ urls })

        filesHistory.push(...filesPaths)

        console.log('Arquivos encontrados: ', JSON.stringify(filesPaths))

        console.log('Enviando os arquivos por email')

        await sendEmailWithPdfs({ filesPaths })

        console.log('sucesso')

        reply.code(201)
      } catch (e) {
        console.error(e)

        return reply.code(500).send({ error: e })
      } finally {
        console.log('Deletando arquivos temporários')
        await deleteTempFiles({ filesPaths: filesHistory })
      }
    },
  )
}
