const express = require('express');
const axios = require('axios');
const cors = require('cors');
const sdk = require('api')('@prodia/v1.3.0#75jxacplowzes24');
require('dotenv').config();

const app = express();
const port = 3001;

app.use(cors());

sdk.auth(process.env.API_KEY);


app.get('/api/text2image', async (req, res) => {
  
  var url="";
  const prompt = req.query.prompt;
  
  await sdk.sdxlGenerate({
      prompt: prompt,
      steps: 30,
      style_preset: "cinematic"
    })
      .then(({ data }) =>  url = ("https://images.prodia.xyz/" + data.job + ".png" ))
      .catch(err => console.error(err));
 
  res.json(url)      

});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
