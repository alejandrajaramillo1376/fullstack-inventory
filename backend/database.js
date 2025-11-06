const mongoose = require('mongoose');

module.exports = async function connectDB() {
  const url = process.env.MONGO_URI;
  if (!url) throw new Error('MONGO_URI no definido en .env');
  await mongoose.connect(url);
  console.log('MongoDB connected');
};