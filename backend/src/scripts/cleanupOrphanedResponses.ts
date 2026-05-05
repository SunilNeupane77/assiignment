import mongoose from 'mongoose';
import { SurveyModel } from '../modules/survey/survey.model.js';
import { ResponseModel } from '../modules/response/response.model.js';
import dotenv from 'dotenv';

dotenv.config();

async function cleanupOrphanedResponses() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/survey-app');
    console.log('Connected to MongoDB');

    const surveyIds = await SurveyModel.find().distinct('_id');
    const result = await ResponseModel.deleteMany({ surveyId: { $nin: surveyIds } });
    
    console.log(`Deleted ${result.deletedCount} orphaned responses`);
    
    await mongoose.connection.close();
    console.log('Cleanup complete');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

cleanupOrphanedResponses();
