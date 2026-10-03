import { app } from './app.js';
import { connectDb } from './config/db.js';
import { env } from './config/env.js';

app.listen(env.port, '0.0.0.0', () => {
  console.log(`Chạm Ý API listening on ${env.port}`);
  connectDb().catch((error) => {
    console.error('Database connection failed', error);
  });
});
