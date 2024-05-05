import { Request, Response } from 'express'
import fs from 'fs'
import path from 'path'
import { myDataSource } from '../utils'
import { FileRequest } from '../interfaces'
import { File } from '../entities/file.entity'

export async function fileUpload(req: Request, res: Response) {
  const file = req.file as unknown as Omit<FileRequest, 'createdAt'>

  const isExist = await myDataSource.getRepository(File).findOne({ where: { originalname: file.originalname } })

  if (isExist) {
    return res.status(409).json({ message: 'File already exists' })
  }

  await myDataSource.getRepository(File).save({ ...file })

  return res.status(201).json({ message: 'File uploaded', status: 'Created' })
}

export async function fileList(req: Request, res: Response) {
  const page = parseInt(req.query.page as string) || 1
  const pageSize = parseInt(req.query.pageSize as string) || 10

  const skip = (page - 1) * pageSize

  console.log(page, pageSize)

  const [result, total] = await myDataSource.getRepository(File).findAndCount({
    skip,
    take: pageSize,
  })

  return res.status(200).json({ data: result, total: total, status: 'ok' })
}

export async function fileDelete(req: Request, res: Response) {
  const fileId = req.params.id as string

  const file = await myDataSource.getRepository(File).findOne({ where: { id: fileId } })

  if (!file) {
    return res.status(404).json({ message: 'File not found' })
  }

  const filePath = path.join('./', file.path)

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'File not found localy' })
  }

  fs.unlinkSync(filePath)
  await myDataSource.getRepository(File).delete({ id: fileId })

  return res.status(200).json({ message: 'File deleted', status: 'ok' })
}

export async function fileRead(req: Request, res: Response) {
  const fileId = req.params.id as string

  const file = await myDataSource.getRepository(File).findOne({ where: { id: fileId } })

  if (!file) {
    return res.status(404).json({ message: 'File not found' })
  }

  return res.status(200).json({ data: file, status: 'ok' })
}

export async function fileDownload(req: Request, res: Response) {
  const fileId = req.params.id as string

  const file = await myDataSource.getRepository(File).findOne({ where: { id: fileId } })

  if (!file) {
    return res.status(404).json({ message: 'File not found' })
  }

  const filePath = path.join('./', file.path)

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'File not found localy' })
  }

  res.setHeader('Content-Type', 'application/octet-stream')
  res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`)

  res.download(filePath, file.filename, (err) => {
    if (err) {
      return res.status(404).json({ message: 'File not found' })
    }
  })
}

export async function fileUpdate(req: Request, res: Response) {
  const fileId = req.params.id as string
  const data = req.file as unknown as Omit<FileRequest, 'createdAt'>

  const file = await myDataSource.getRepository(File).findOne({ where: { id: fileId } })

  if (!file) {
    return res.status(404).json({ message: 'File not found' })
  }

  const filePath = path.join('./', file.path)

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
  }

  await myDataSource.getRepository(File).update(fileId, {
    originalname: data.originalname,
    encoding: data.encoding,
    mimetype: data.mimetype,
    destination: data.destination,
    filename: data.filename,
    path: data.path,
    size: data.size,
    uploadedAt: new Date(),
  })

  return res.status(201).json({ message: 'File updated' })
}
