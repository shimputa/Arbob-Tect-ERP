import * as dotenv from 'dotenv';
dotenv.config(); // Load environment variables
import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT;

// Connect to the PostgreSQL Database
connectDB()
  .then(() => {
    // Start the server after DB connection is successful
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    // Handle Unhandled Promise Rejections
    process.on('unhandledRejection', (err) => {
      console.log(`Error: ${err.message}`);
      console.log('Shutting down the server due to Unhandled Promise Rejection');

      server.close(() => {
        process.exit(1);
      });
    });
  })
  .catch((err) => {
    console.log('PostgreSQL connection failed!', err);
  });
