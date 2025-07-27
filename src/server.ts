import mongoose from 'mongoose';
import dotenv from 'dotenv';

import app from './app';

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mydatabase';

if (!MONGO_URI) {
  console.error('❌ MONGO_URI is not defined in the environment');
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connection to MongoDB established');
    app.listen(PORT, () => {
      console.log('Server is up and running');
      console.log(`Access it at: http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log('Failed to connect to MongoDB:', error);
    process.exit(1);
  });
