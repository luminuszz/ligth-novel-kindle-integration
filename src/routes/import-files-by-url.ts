import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { scrapingLightNovelByUrl } from '../use-cases/scrapping-ligth-novel-by-url';
import { sendEmailWithPdfs } from '../use-cases/send-email-with.pdfs';

export async function importFilesByUrl(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/files/import',
    {
      schema: {
        body: z.object({
          urls: z.array(z.string().url()),
        }),
      },
    },
    async (req, reply) => {
      try {
        const { urls } = req.body;

        const filePaths = await scrapingLightNovelByUrl({ urls });

        await sendEmailWithPdfs(filePaths);

        reply.code(201);
      } catch (e) {
        console.error(e);

        return reply.code(500).send({ error: e });
      }
    },
  );
}
