import path from 'node:path';
import multer from 'multer';

export const MAX_IMAGE_SIZE = 8 * 1024 * 1024;

const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
const allowedExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp']);

export class UploadError extends Error {
  statusCode = 400;
}

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_IMAGE_SIZE },
  fileFilter: (_req, file, cb) => {
    const mimeType = file.mimetype.toLowerCase();
    const extension = path.extname(file.originalname).toLowerCase();
    // Một số trình duyệt/ứng dụng gửi mimetype rỗng hoặc octet-stream: khi đó dựa vào đuôi file.
    const unknownType = !mimeType || mimeType === 'application/octet-stream';
    if (allowedMimeTypes.has(mimeType) || (unknownType && allowedExtensions.has(extension))) return cb(null, true);
    return cb(new UploadError('Chỉ chấp nhận ảnh định dạng JPG, PNG hoặc WEBP.'));
  },
});
