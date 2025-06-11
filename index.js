// backend/index.js
require('dotenv').config();        // <--- MUST load .env first
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { initDB } = require('./db');

const app = express();
app.use(cors());
app.use(bodyParser.json());

initDB()
  .then(() => {
    // Mount the updated auth + account routers
    const { router: authRouter } = require('./routes/auth');
    app.use('/api/auth', authRouter);

    const accountRouter = require('./routes/account');
    app.use('/api/account', accountRouter);

    // Health check
    app.get('/', (req, res) => {
      res.json({ message: 'Bank backend is running.' });
    });

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('DB init failed:', err);
    process.exit(1);
  });
