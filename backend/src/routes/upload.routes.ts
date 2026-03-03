import { Router } from "express"
import multer from "multer"
import cloudinary from "../config/cloudinary"
import { Readable } from "stream"

const router = Router()

const storage = multer.memoryStorage()
const upload = multer({ storage })

router.post("/upload-avatar", upload.single("avatar"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Arquivo não enviado" })
    }

    const streamUpload = (buffer: Buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "avatars" },
          (error, result) => {
            if (result) resolve(result)
            else reject(error)
          }
        )

        const readable = new Readable()
        readable.push(buffer)
        readable.push(null)
        readable.pipe(stream)
      })
    }

    const result: any = await streamUpload(req.file.buffer)

    return res.json({ url: result.secure_url })

  } catch {
    return res.status(500).json({ message: "Erro no upload" })
  }
})

export default router