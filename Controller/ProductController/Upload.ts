// Controller/ProductController/Upload.js
import express from 'express'
import multer from 'multer'
import path from 'path'

const fileRouter = express.Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
})

const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
       
        cb(null, true)
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
})

fileRouter.post('/upload-file', upload.single('file'), (req, res) => {
    try {
       

        if (!req.file) {
           res.status(400).json({ error: 'Please select a file to upload' })
        return;
          }

        res.status(200).json({
            message: 'File uploaded successfully',
            file: {
                filename: req.file.filename,
                path: req.file.path
            }
        })
    } catch (error) {
        console.error('Upload error:', error)
        res.status(500).json({ error: 'File upload failed' })
    }
})

export default fileRouter