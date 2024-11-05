const express = require('express');
const router = express.Router();
const questions = require('../models/questions.json');

router.get('/', (req, res) => {
  res.json(questions);
});

module.exports = router;