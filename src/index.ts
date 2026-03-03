import app from './app.js';
import connectDB from '@services/db.js';
import dotenv from 'dotenv';

dotenv.config();

connectDB();

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
