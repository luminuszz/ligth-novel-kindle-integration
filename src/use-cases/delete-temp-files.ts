import { unlink } from 'node:fs/promises'

import type { FilesData } from './dto'

interface DeleteTempFilesInput {
  filesPaths: FilesData
}

export async function deleteTempFiles({ filesPaths }: DeleteTempFilesInput) {
  for (const file of filesPaths) {
    const currentFile = Bun.file(file.filePath)

    const existsFile = await currentFile.exists()

    if (existsFile) {
      await unlink(file.filePath)
    } else {
      console.log(`File ${file.filePath} not found`)
    }
  }
}
