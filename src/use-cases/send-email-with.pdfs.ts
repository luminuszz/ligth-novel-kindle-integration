import * as fs from 'node:fs/promises'

import { resend } from '../lib/resend-mail-provider'
import { env } from '../utils/env'
import type { FilesData } from './dto'

interface SendEmailWithPdfsInput {
  filesPaths: FilesData
}

interface MailAttachment {
  content: Buffer
  filename: string
}

export async function sendEmailWithPdfs({
  filesPaths,
}: SendEmailWithPdfsInput) {
  const pdfFiles: MailAttachment[] = []

  for (const file of filesPaths) {
    const currentFile = Bun.file(file.filePath)

    const existsFile = await currentFile.exists()

    if (!existsFile) {
      throw new Error(`File ${file.filePath} not found`)
    }

    console.log(
      `Reading file ${file.filename} with sise ${(currentFile.size / 1024 / 1024).toFixed(4) + 'MB'}`,
    )

    pdfFiles.push({
      filename: file.filename,
      content: Buffer.from(await currentFile.arrayBuffer()),
    })
  }

  const { error } = await resend.emails.send({
    to: env.KINDLE_EMAIL,
    subject: 'Convert',
    from: env.RESENT_FROM_EMAIL,
    attachments: pdfFiles,
    text: 'Convert to Kindle format.',
  })

  if (error) {
    throw new Error('Error sending email: ' + error.message)
  }
}
