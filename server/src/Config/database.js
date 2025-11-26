

const mongoose = require('mongoose'); // Import the Mongoose library (ODM)
const logger = require('./logger');

require('dotenv').config(); // Loads environment variables from .env file 
 

const connectDb = async () => { // we use Asynchronous function because we use iside it the wait
                                //  because we should wait untill the connection is done

try{


    const conn = await mongoose.connect(process.env.MONGO_URI)

    // Silent connection - logs written to file only
    logger.debug('✅ MongoDB Connected successfully');
    logger.debug(`Database Host: ${conn.connection.host}`);
      
  } catch (error) {
    logger.error('❌ Database connection failed:', { error: error.message, stack: error.stack });
    process.exit(1);
  }
};




module.exports = connectDb;