const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/farmdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const port = 5000;
app.listen(port, () => console.log(`Farm API running on port ${port}`));

