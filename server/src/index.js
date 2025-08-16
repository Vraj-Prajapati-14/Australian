const dotenv = require('dotenv');
dotenv.config();

const app = require('./server');
const { connectToDatabase } = require('./lib/db');
const { seedAll } = require('./seed/admin');

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await connectToDatabase(process.env.MONGO_URI);
    await seedAll();
    app.listen(PORT, () => {
      console.log(`API listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();

