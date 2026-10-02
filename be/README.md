# Chạm Ý backend

## Local

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env`. `MONGODB_URI` and `JWT_SECRET` are required for production. If Cloudinary is not configured, the API accepts an existing image URL but does not persist local uploads.

Generate the admin hash locally without putting the password in source:

```bash
node -e "const bcrypt=require('bcryptjs'); bcrypt.hash(process.argv[1],12).then(console.log)" "your-admin-password"
```

Set the printed value as `ADMIN_PASSWORD_HASH` in Render.
