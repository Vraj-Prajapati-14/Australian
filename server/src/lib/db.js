const mongoose = require('mongoose');

let isConnected = false;

function attachConnectionLogs() {
  const conn = mongoose.connection;
  if (conn.__logsAttached) return;
  conn.__logsAttached = true;
  conn.on('connected', () => {
    const name = conn.name || 'default';
    console.log(`MongoDB connected (${name})`);
  });
  conn.on('error', (err) => {
    console.error('MongoDB connection error:', err.message);
  });
  conn.on('disconnected', () => {
    console.warn('MongoDB disconnected');
  });
}

async function connectToDatabase(mongoUri) {
  if (isConnected) return mongoose.connection;
  if (!mongoUri) throw new Error('MONGO_URI missing');
  mongoose.set('strictQuery', true);
  attachConnectionLogs();
  await mongoose.connect(mongoUri);
  isConnected = true;
  return mongoose.connection;
}

module.exports = { connectToDatabase };

