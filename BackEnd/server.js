const express = require('express');
const axios = require('axios');
const cors = require('cors');
const sdk = require('api')('@prodia/v1.3.0#75jxacplowzes24');
import fetch from ('node-fetch');
require('dotenv').config();

const app = express();
const port = 3001;

app.use(cors());

async function translateText(text, targetLanguage) {
  const apiUrl = 'https://libretranslate.com/translate';

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        target: targetLanguage,
      }),
    });

    if (!response.ok) {
      throw new Error(`Translation request failed with status ${response.status}`);
    }

    const result = await response.json();
    return result.translatedText;
  } catch (error) {
    console.error('Error translating text:', error.message);
    return text;
  }
}

sdk.auth(process.env.API_KEY);

app.get('/api/text2image', async (req, res) => {
  
  var url="";
  var prompt = req.query.prompt;
  const style = req.query.style;
  const targetLanguage = 'en';  
  
  prompt = translateText(prompt, targetLanguage);

  if(style.length>0)await sdk.sdxlGenerate({
      prompt: prompt,
      style_preset: style,
      model:"juggernautXL_v45.safetensors [e75f5471]"
    })
      .then(({ data }) =>  url = ("https://images.prodia.xyz/" + data.job + ".png" ))
      .catch(err => console.error(err));
  else await sdk.sdxlGenerate({
    prompt: prompt,
    model:"juggernautXL_v45.safetensors [e75f5471]"
  })
    .then(({ data }) =>  url = ("https://images.prodia.xyz/" + data.job + ".png" ))
    .catch(err => console.error(err));    
 
  res.json(url)      

});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
