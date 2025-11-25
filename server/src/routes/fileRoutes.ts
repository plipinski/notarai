import { Router } from 'express';
import multer from 'multer';
import { deleteFile, listFiles, uploadFiles } from '../controllers/fileController';
import { requireAuth } from '../middlewares/authMiddleware';

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();
router.use(requireAuth);

router.post('/upload', upload.array('files'), uploadFiles);
router.get('/', listFiles);
router.delete('/:id', deleteFile);

export default router;
