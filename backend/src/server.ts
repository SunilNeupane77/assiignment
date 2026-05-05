import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/database.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    const gracefulShutdown = (signal: string) => {
      console.log(`\n${signal} received. Closing server gracefully...`);
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });

      setTimeout(() => {
        console.error('Forcing shutdown...');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
