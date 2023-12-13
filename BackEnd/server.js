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
  const style = req.query.style;
  
  await sdk.sdxlGenerate({
      model:"dynavisionXL_0411.safetensors [c39cc051]",
      prompt: prompt,
      steps: 30, 
      cfg_scale: 10,
      style_preset: style
    })
      .then(({ data }) =>  url = ("https://images.prodia.xyz/" + data.job + ".png" ))
      .catch(err => console.error(err));
 
  res.json(url)      

});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
