const express = require('express');
const axios = require('axios');
const cors = require('cors');
const sdk = require('api')('@prodia/v1.3.0#75jxacplowzes24');
require('dotenv').config();

const app = express();
const port = 3001;
var visitors = 0;
app.use(cors());

sdk.auth(process.env.API_KEY);

function generateRandomNumber() {
  const min = 1000000;
  const max = 10000000;
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNumber;
}

app.get('/api/text2image', async (req, res) => {
  
  var url="";
  const prompt = req.query.prompt;
  const style = req.query.style;
  const width = +req.query.width;
  const height = +req.query.height;
  const model = req.query.model;
  const seed = generateRandomNumber();

  visitors++;
  console.log(visitors/6);

  if(style.length>0)await sdk.sdxlGenerate({
      prompt: prompt,
      style_preset: style,
      model: model,
      steps: 30,
      width: width,
      height: height,
      seed: seed
    })
      .then(({ data }) =>  url = ("https://images.prodia.xyz/" + data.job + ".png" ))
      .catch(err => console.error(err));
  else await sdk.sdxlGenerate({
    prompt: prompt,
    model: model,
    steps: 30,
    width: width,
    height: height,
    seed: seed
  })
    .then(({ data }) =>  url = ("https://images.prodia.xyz/" + data.job + ".png" ))
    .catch(err => console.error(err));    
 
  res.json(url)      

});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
