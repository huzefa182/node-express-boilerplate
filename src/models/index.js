import mongoose from 'mongoose';
import config from '../config';

const connectDB = async () => {
  try {
    const db = await mongoose.connect(config.database.mongo.url, {
      user: config.database.mongo.user,
      pass: config.database.mongo.password,
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true
    });
  
    return db;
  }
  catch(error) {
    throw new Error(error);
  }
}

export {
  connectDB
}
