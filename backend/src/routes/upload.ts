import { Router, Request, Response } from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { verifyJWT } from '../middleware/auth.js';
import { put } from '@vercel/blob';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const router = Router();

// Ensure upload directories exist for local development fallback
const uploadDir = path.join(__dirname, '../../uploads');
const imagesDir = path.join(uploadDir, 'images');
const documentsDir = path.join(uploadDir, 'documents');

if (!process.env.VERCEL) {
  [uploadDir, imagesDir, documentsDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

// We use memory storage now so we can upload to Vercel Blob
const memoryStorage = multer.memoryStorage();

const imageUpload = multer({
  storage: memoryStorage,
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid image format'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

const documentUpload = multer({
  storage: memoryStorage,
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid document format'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

router.post('/image', verifyJWT, imageUpload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const ext = path.extname(req.file.originalname);
    const filename = `${uuidv4()}${ext}`;

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`images/${filename}`, req.file.buffer, {
        access: 'public',
      });
      res.json({ url: blob.url });
    } else {
      // Local fallback
      fs.writeFileSync(path.join(imagesDir, filename), req.file.buffer);
      res.json({ url: `/uploads/images/${filename}` });
    }
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

router.post('/document', verifyJWT, documentUpload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const ext = path.extname(req.file.originalname);
    const filename = `${uuidv4()}${ext}`;

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`documents/${filename}`, req.file.buffer, {
        access: 'public',
      });
      res.json({
        url: blob.url,
        originalName: req.file.originalname,
        fileId: filename
      });
    } else {
      // Local fallback
      fs.writeFileSync(path.join(documentsDir, filename), req.file.buffer);
      res.json({
        url: `/uploads/documents/${filename}`,
        originalName: req.file.originalname,
        fileId: filename
      });
    }
  } catch (error) {
    console.error('Document upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

export default router;
