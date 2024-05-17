import { resend } from '../lib/resend-mail-provider';
import { env } from '../utils/env';
import type { FilesData } from './dto';

interface SendEmailWithPdfsInput {
  filesPaths: FilesData;
}

export async function sendEmailWithPdfs({
  filesPaths,
}: SendEmailWithPdfsInput) {
  const { error } = await resend.emails.send({
    to: env.KINDLE_EMAIL,
    subject: 'Convert',
    from: env.RESENT_FROM_EMAIL,
    attachments: filesPaths.map((file) => ({
      filename: file.filename,
      content: Buffer.from(file.filePath),
    })),
    text: 'Convert to Kindle format.',
  });

  if (error) {
    throw new Error('Error sending email: ' + error.message);
  }
}
