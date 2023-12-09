const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3001;

app.use(cors());


app.get('/api/text2image', async (req, res) => {
  try {
    const prompt = req.query.prompt;
    const apiUrl = process.env.API_URL + prompt;
    const response = await axios.get(apiUrl);
    res.json(response.data.url);
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
