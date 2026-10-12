import type { ErrorRequestHandler } from 'express';
import multer from 'multer';
import { MAX_IMAGE_SIZE } from './upload.middleware.js';

const uploadFieldLabels: Record<string, string> = {
  paymentProofImage: 'Ảnh chuyển khoản',
  previewImage: 'Ảnh preview',
  image: 'Ảnh sản phẩm',
};

function uploadErrorMessage(error: multer.MulterError) {
  const label = uploadFieldLabels[error.field || ''] || 'Ảnh';
  if (error.code === 'LIMIT_FILE_SIZE') return `${label} quá lớn (tối đa ${MAX_IMAGE_SIZE / 1024 / 1024}MB). Vui lòng chọn ảnh nhỏ hơn.`;
  if (error.code === 'LIMIT_UNEXPECTED_FILE') return 'Tệp tải lên không hợp lệ.';
  return 'Không thể tải ảnh lên. Vui lòng thử lại.';
}

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({ success: false, message: uploadErrorMessage(error) });
  }
  const status = error?.statusCode || 500;
  if (status >= 500) console.error(error);
  res.status(status).json({ success: false, message: status === 500 ? 'Internal server error' : error.message });
};
