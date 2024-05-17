import { z } from 'zod';

export const envSchema = z.object({
  TEMP_FILE_DIR: z.string(),
  KINDLE_EMAIL: z.string(),
  RESEND_API_SECRET_KEY: z.string(),
  RESENT_FROM_EMAIL: z.string(),
});

export type Env = z.infer<typeof envSchema>;

export const env = envSchema.parse(process.env);
