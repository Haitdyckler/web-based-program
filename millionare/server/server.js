const express = require('express');
const path = require('path');
const cors = require('cors');
const questionsRouter = require('./routes/questions');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Web routes
app.get('/', (req, res) => {
  res.render('start');
});

app.get('/game', (req, res) => {
  res.render('game');
});

// API routes
app.use('/api/questions', questionsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
