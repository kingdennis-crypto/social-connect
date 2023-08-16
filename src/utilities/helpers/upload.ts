import multer, { StorageEngine } from 'multer'

const storage: StorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(req.headers, file)

    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  },
})

const upload = multer({ storage: storage })

export default upload
