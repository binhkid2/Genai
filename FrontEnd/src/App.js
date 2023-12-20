import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Filter from 'bad-words';
import Spinner from "./Spinner-1s.svg";

var abort = false;
var DetectLanguage = require('detectlanguage');
var detectlanguage = new DetectLanguage("9d8788a1ea7c0812f593cbe576ee6b22");
const filter = new Filter({ placeHolder: ' '});
filter.addWords('naked','nude',"hot");

function App() {

  const [data, setData] = useState(null);
  const [input, setInput] = useState(null);
  const [prompt, setPrompt] = useState("Enter a prompt");
  const [images, setImages] = useState([]);
  const [isDisabled, setButton] = useState(false);  
  const [viewObj, setObj] = useState("");
  const [bodyStyle, setStyle] = useState({});
  const [imgStyle, setImgStyle] = useState({});
  const [presetStyle, setPresetStyle] = useState("");
  const [resultion, setReslution] = useState([1024,1024]);
  const [model, setModel] = useState("sd_xl_base_1.0.safetensors [be9edd61]");

  const translateText = async () => {

    var result;
    axios.post(`https://libretranslate.de/detect`, {
      q: prompt
  })
  .then(async (response) => {
      result=response.data[0].language;
      try {
        let data = {
          q : prompt,
          source: result,
          target: "en"
      }
      axios.post(`https://libretranslate.de/translate`, data)
      .then((response) => {
          const filteredText = filter.clean(response.data.translatedText);
          fetchData(filteredText);
      })
      } catch (error) {
        console.error('Translation error:', error);
      }
  })
  };

  function disableButton(){

    setButton(true);
  }

  function enableButton(){

    setButton(false);
  }

  function handleChange(event){

    setInput(event.target.value);
    setPrompt(event.target.value);

  }

  function hanldePresetStyle(event){

    setPresetStyle(event.target.value);
  }

  function handleReslution(event){

    const dimensions=event.target.value
    var width="";
    var height="";
    var detected = false;
    for(let i=0;i<dimensions.length;i++){

      if(dimensions[i]===','){detected=true; continue;}

      if(!detected)width+=dimensions[i]; 
      else height+=dimensions[i];

    }
    setReslution([width,height])  
  }

  function handleModel(event){

    setModel(event.target.value);
  }

  async function handleClick(event){    
    disableButton();
    setObj("");
    setImgStyle({});
    event.preventDefault();
    setData(Spinner);
    setImages([Spinner,Spinner,Spinner,Spinner,Spinner,Spinner]);
    translateText();
  }

  const fetchData = async (adaptedPrompt) => {

    const url = process.env.REACT_APP_URL + adaptedPrompt + "&style=" + presetStyle + "&width=" + resultion[0] + "&height=" + resultion[1] + "&model=" + model ;
    const imgs = [Spinner,Spinner,Spinner,Spinner,Spinner,Spinner];
    const imgsProdia = [Spinner,Spinner,Spinner,Spinner,Spinner,Spinner];
    let limitCounter = 0;
    for(let i=0;i<6;i++){
      
        if(abort)break;

        const response = await fetch(url,{
        });
        const result = await response.json();
        imgsProdia[i]=result;
      }
        
      let ready = false;

        while(!ready && !abort){

          if(limitCounter>=80)break;

          ready=true;

          for(let i=0;i<6;i++){

            if(abort)break;

            limitCounter++;

            const imgResponse = await fetch(imgsProdia[i],{});

            if(imgResponse.status===200){
            imgs[i]=imgsProdia[i];
            setImages(imgs);
            setImgStyle({cursor:"zoom-in"}) 
          } else {ready=false;
           
            if(limitCounter>=40 && !abort){
              const response = await fetch(url,{
                
          });
          const result = await response.json();
          imgsProdia[i]=result;
        }
        if(limitCounter>=70 && !abort){delete imgs[i]; setImages(imgs);}

  }}}

  if(abort){

    for(let i=0;i<6;i++){
      if(imgs[i]===Spinner)delete imgs[i];
    }
    setImages(imgs);
  }

  enableButton();
  abort = false;
  };

  function closeView(){

    setStyle({});
    setObj("");
  }

  function view(url){

    if(viewObj==""){
    setStyle({filter: "blur(8px)"});  
    setObj(<element onClick={() => closeView()} ><img className='view' src={url}></img></element>);
    
  }
    else {setStyle({}); setObj("");}

  }

  function cancelFetching(event){

    event.preventDefault();
    abort=true;
  }  
 
  return (
    <div onClick={() => viewObj!="" && closeView()} className="app">
    <link href="https://fonts.cdnfonts.com/css/crazy-robot" rel="stylesheet"></link>
     <main style={bodyStyle}>
     <h1>Genai</h1>
      <form>
      <div className='inputs'>
      <input onChange={handleChange} placeholder='Type Description' value={input}></input>
      <button onClick={handleClick} type='submit' disabled={isDisabled}>generate</button>
      </div>

      <div className='preset'>

      <select onChange={hanldePresetStyle} value={presetStyle}>

        <option value="">default</option>

        <option value="3d-model">3d-model</option>
        <option value="analog-film">analog-film</option>
        <option value="anime">anime</option>
        <option value="cinematic">cinematic</option>

        <option value="comic-book">comic-book</option>
        <option value="digital-art">digital-art</option>
        <option value="enhance">enhance</option>
        <option value="fantasy-art">fantasy-art</option>

        <option value="isometric">isometric</option>
        <option value="line-art">line-art</option>
        <option value="low-poly">low-poly</option>
        <option value="neon-punk">neon-punk</option>

        <option value="origami">origami</option>
        <option value="photographic">photographic</option>
        <option value="pixel-art">pixel-art</option>
        <option value="texture">texture</option>

        <option value="craft-clay">craft-clay</option>

      </select>

      <select onChange={handleReslution} value={resultion}>

        <option value={[1024,1024]}>1024x1024</option>
        <option value={[1152,896]}>1152x896</option>
        <option value={[1216,832]}>1216x832</option>
        <option value={[1344,768]}>1344x768</option>
        <option value={[1536,640]}>1536x640</option>
        <option value={[640,1536]}>640x1536</option>
        <option value={[768,1344]}>768x1344</option>
        <option value={[832,1216]}>832x1216</option>
      
      </select>
      
      <select onChange={handleModel} value={model}>

        <option value="sd_xl_base_1.0.safetensors [be9edd61]">sdxl_base</option>
        <option value="dreamshaperXL10_alpha2.safetensors [c8afe2ef]">dreamshaperXL</option>
        <option value="dynavisionXL_0411.safetensors [c39cc051]">dynavisionXL</option>
        <option value="juggernautXL_v45.safetensors [e75f5471]">juggernautXL</option>
        <option value="realismEngineSDXL_v10.safetensors [af771c3f]">realismEngineSDXL</option>

      </select>


      {isDisabled && <button className='cancel' onClick={cancelFetching}>cancel</button> }

      </div>
      </form>
      
    <div className='imgs'>
    {images.map(e=>{

      return <element style={imgStyle} onClick={ () => e!=Spinner && view(e)}><img src={e}></img></element>
      
    })}

    </div>
    </main>
    {viewObj}
    </div>
  );
}

export default App;
