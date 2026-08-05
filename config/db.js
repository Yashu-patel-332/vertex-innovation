const mongoose = require('mongoose');
module.exports = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vertex-web');
    console.log('MongoDB connected');
  }
  catch (error) {
    console.error(`Database connection failed: ${error.message}`);
    process.exit(1);
  }
};
