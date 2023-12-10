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
    event.preventDefault();
    setData(Spinner);
    setImages([Spinner,Spinner,Spinner]);
    fetchData();
    
  }

  const fetchData = async () => {

    const url = process.env.REACT_APP_URL + prompt;
    const imgs =[Spinner,Spinner,Spinner];
    for(let i=0;i<3;i++){
    try {
      const response = await fetch(url,{
      });
      const result = await response.json();
      setData(result);
      imgs[i]=result;
      setImages(imgs);
    } catch (error) {
      console.error('Error fetching data:', error.message);
      setImages([]);
      break;
    }
  }
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
    <div className="app">
    <link href="https://fonts.cdnfonts.com/css/crazy-robot" rel="stylesheet"></link>
     <main style={bodyStyle}>
     <h1>Genai</h1>
      <form>
      <input onChange={handleChange} placeholder='Type Description' value={input}></input>
      <button onClick={handleClick} type='submit' disabled={isDisabled}>generate</button></form>
    <div className='imgs'>
    {images.map(e=>{

      return <element onClick={ () => e!=Spinner && view(e)}><img src={e}></img></element>
      
    })}

    </div>
    </main>
    {viewObj}
    </div>
  );
}

export default App;
