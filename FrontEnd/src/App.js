import './App.css';
import React, { useState, useEffect } from 'react';
import Spinner from "./Spinner-1s.svg";

function App() {

  const [data, setData] = useState(null);
  const [input, setInput] = useState(null);
  const [prompt, setPrompt] = useState(null);
  const [images, setImages] = useState([]);
  const [isDisabled, setButton] = useState(false);  
  const [viewObj, setObj] = useState("");
  const [bodyStyle, setStyle] = useState({});
  const [imgStyle, setImgStyle] = useState({});

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

  async function handleClick(event){
    disableButton();
    setObj("");
    setImgStyle({});
    event.preventDefault();
    setData(Spinner);
    setImages([Spinner,Spinner,Spinner,Spinner,Spinner,Spinner]);
    fetchData();
  }

  const fetchData = async () => {

    const url = process.env.REACT_APP_URL + prompt;
    const imgs = [Spinner,Spinner,Spinner,Spinner,Spinner,Spinner];
    const imgsProdia = [Spinner,Spinner,Spinner,Spinner,Spinner,Spinner];
    let limitCounter = 0;

    for(let i=0;i<6;i++){
      
        const response = await fetch(url,{
        });
        const result = await response.json();
        imgsProdia[i]=result;
      }
        
      let ready = false;

        while(!ready){

          if(limitCounter>=70)break;

          ready=true;

          for(let i=0;i<6;i++){

            limitCounter++;

            const imgResponse = await fetch(imgsProdia[i],{});

            if(imgResponse.status===200){
            imgs[i]=imgsProdia[i];
            setImages(imgs);
            setImgStyle({cursor:"zoom-in"}) 
          } else {ready=false;
          
            if(limitCounter>=50){
              const response = await fetch(url,{
          });
          if(limitCounter>=70){delete imgs[i]; setImages(imgs);}
          const result = await response.json();
          imgsProdia[i]=result;
  }}}}
    
  enableButton();
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

  return (
    <div onClick={() => viewObj!="" && closeView()} className="app">
    <link href="https://fonts.cdnfonts.com/css/crazy-robot" rel="stylesheet"></link>
     <main style={bodyStyle}>
     <h1>Genai</h1>
      <form>
      <input onChange={handleChange} placeholder='Type Description' value={input}></input>
      <button onClick={handleClick} type='submit' disabled={isDisabled}>generate</button></form>
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
