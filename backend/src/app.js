const express = require('express');
const cors = require('cors');

const app = express();

const authRoutes = require('./routes/authRoutes');
const protect = require('./middleware/authMiddleware');
const reviewRoutes = require('./routes/reviewRoutes');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/auth', authRoutes);
app.get('/api/protected', protect, (req, res) => {
  res.json({
    message: "Protected route",
    user: req.user
  });
});
app.use('/api/reviews', reviewRoutes);

module.exports = app;