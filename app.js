const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = 3000;

const logger = require('./middleware/logger');
app.use(logger);

// Route to force an error for testing
app.get('/crash', (req, res) => {
  throw new Error('Simulated crash');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.use(express.json());
app.use(express.static('public'));

app.use((req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.API_KEY) {
    return res.status(403).json({ message: 'Forbidden: Invalid API Key' });
  }
  next();
});

const bookRoutes = require('./routes/books');
app.use('/api/books', bookRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
