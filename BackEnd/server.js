const express = require('express');
const axios = require('axios');
const cors = require('cors');
const sdk = require('api')('@prodia/v1.3.0#75jxacplowzes24');
require('dotenv').config();

const app = express();
const port = 3001;

app.use(cors());

sdk.auth(process.env.API_KEY);

async function checkUrlStatus(url) {

  var response = {data:{status:""}};

  try {
    response = await axios.get(url, { timeout: 4000 });
    return response.data.status;
  } catch (error) {
    if (error.response) {
      return response.data.status;
    } else if (error.request) {
      return response.data.status;
    } else {
      return response.data.status;
    }
  }
  return response;
}


app.get('/api/text2image', async (req, res) => {
  
  var url="";
  var abort = false;
  const prompt = req.query.prompt;
  const style = req.query.style;
  const width = +req.query.width;
  const height = +req.query.height;

  const detectURL = process.env.APP_DETECT + prompt;   

  const response = await checkUrlStatus(detectURL); 
    
  if(response===404)abort=true;
  
  if(style.length>0 && !abort)await sdk.sdxlGenerate({
      prompt: prompt,
      style_preset: style,
      model:"juggernautXL_v45.safetensors [e75f5471]",
      steps: 30,
      width: width,
      height: height
    })
      .then(({ data }) =>  url = ("https://images.prodia.xyz/" + data.job + ".png" ))
      .catch(err => console.error(err));
  else if(!abort) await sdk.sdxlGenerate({
    prompt: prompt,
    model:"juggernautXL_v45.safetensors [e75f5471]",
    steps: 30,
    width: width,
    height: height
  })
    .then(({ data }) =>  url = ("https://images.prodia.xyz/" + data.job + ".png" ))
    .catch(err => console.error(err));    
 
  res.json(url)      

});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
