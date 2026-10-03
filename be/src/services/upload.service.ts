import type { Express } from 'express';
import cloudinary from '../config/cloudinary.js';
import { env } from '../config/env.js';

export async function uploadImage(file?: Express.Multer.File, fallbackUrl?: string, folder = 'cham-y/orders') {
  if (!file && fallbackUrl) return { url: fallbackUrl, publicId: null };
  if (!file) return null;
  if (!env.cloudinary.cloudName) throw new Error('Cloudinary is not configured');
  return new Promise<{ url: string; publicId: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
      if (error || !result) return reject(error || new Error('Image upload failed'));
      resolve({ url: result.secure_url, publicId: result.public_id });
    });
    stream.end(file.buffer);
  });
}
