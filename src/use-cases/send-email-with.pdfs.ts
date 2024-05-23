import { resend } from '../lib/resend-mail-provider'
import { env } from '../utils/env'
import type { FilesData } from './dto'

interface SendEmailWithPdfsInput {
  filesPaths: FilesData
}

export async function sendEmailWithPdfs({
  filesPaths,
}: SendEmailWithPdfsInput) {
  const pdfFiles = filesPaths.map((file) => ({
    filename: file.filename,
    content: Buffer.from(file.filePath),
  }))

  const { error, data } = await resend.emails.send({
    to: env.KINDLE_EMAIL,
    subject: 'Convert',
    from: env.RESENT_FROM_EMAIL,
    attachments: pdfFiles,
    text: 'Convert to Kindle format.',
  })

  if (error) {
    throw new Error('Error sending email: ' + error.message)
  }

  if (data) {
    const email = await resend.emails.get(data.id)

    const isDelivered = email.data?.last_event === 'delivered'

    if (!isDelivered) {
      throw new Error('Error sending email: Email not delivered')
    }
  }
}
