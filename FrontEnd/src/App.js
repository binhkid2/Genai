import './App.css';
import React, { useState, useEffect } from 'react';
import Spinner from "./Spinner-1s.svg";


function App() {

  const [data, setData] = useState(null);
  const [input, setInput] = useState(null);
  const [prompt, setPrompt] = useState(null);
  const [images, setImages] = useState([]);
  const [isDisabled, setButton] = useState(false);  

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


  return (
    <div className="app">
    <link href="https://fonts.cdnfonts.com/css/crazy-robot" rel="stylesheet"></link>
     <main>
     <h1>Genai</h1>
      <form>
      <input onChange={handleChange} placeholder='Type Description' value={input}></input>
      <button onClick={handleClick} type='submit' disabled={isDisabled}>generate</button></form>
    <div className='imgs'>

    {images.map(e=>{

      return <a href={e !=Spinner && e } target = "_blank" rel = "noopener noreferrer"><img src={e}></img></a>

    })}
        
    </div>

    <div className='input'></div>
    </main>
    </div>
  );
}

export default App;
