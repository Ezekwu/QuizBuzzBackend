import app from './app.js';
import connectDB from './data/db.js';
import dotenv from 'dotenv';

dotenv.config();

// Connect to Database
connectDB();

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
