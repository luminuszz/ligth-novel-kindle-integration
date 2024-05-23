import path from 'node:path'

import puppeteer from 'puppeteer'

import { env } from '../utils/env'
import type { FilesData } from './dto'

type Input = {
  urls: string[]
}

interface FilePaths {
  filesPaths: FilesData
}

const getPath = (filename: string) => path.resolve(env.TEMP_FILE_DIR, filename)

export async function scrapingLightNovelByUrl({
  urls,
}: Input): Promise<FilePaths> {
  const filesPaths: Array<{ filename: string; filePath: string }> = []

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  for (const url of urls) {
    const page = await browser.newPage()

    await page.goto(url, {
      waitUntil: 'networkidle2',
    })

    const divSelector = '#readerarea'

    const readContent = await page.$eval(divSelector, (el) => el.innerHTML)

    const title = await page.$eval('.entry-title', (el) => el.innerHTML)

    await page.setContent(readContent, { waitUntil: 'networkidle2' })

    const pdfStream = await page.pdf({
      format: 'A4',
    })

    await page.close()

    const parsedTitle = title.match(/(Mushoku Tensei|Vol\. \d+|Cap\. \d+)/g)

    const fileName = parsedTitle
      ? parsedTitle
          .join('-')
          .normalize('NFD')
          .replaceAll(' ', '-')
          .replaceAll('.', '')
          .concat('.pdf')
      : `file-${Date.now()}`

    const path = getPath(fileName)

    const file = Bun.file(path)

    await Bun.write(file, pdfStream)

    filesPaths.push({ filename: fileName, filePath: path })
  }

  await browser.close()

  return {
    filesPaths,
  }
}
