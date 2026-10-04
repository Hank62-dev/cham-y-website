import 'dotenv/config';

export const env = {
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGODB_URI || '',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  adminFrontendUrl: process.env.ADMIN_FRONTEND_URL || 'http://localhost:5174',
  adminPasswordHash: process.env.ADMIN_PASSWORD_HASH || '',
  jwtSecret: process.env.JWT_SECRET || 'development-only-secret',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'development-only-refresh-secret',
  qrImageUrl: process.env.QR_IMAGE_URL || '',
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  },
};
