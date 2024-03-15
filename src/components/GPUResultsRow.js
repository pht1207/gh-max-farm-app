import { useEffect, useState } from 'react';
import './GPUResults.css';

function GPUResultsRow(props) {
  const [backgroundColor, setBackgroundColor] = useState('rgba(245, 245, 245, 1)')
  const [clicked, setClicked] = useState(false);

  useEffect(()=>{
    if(props.resultElement.cpu_used === ""){
      props.resultElement.cpu_used = "N/A";
    }
    if(props.resultElement.difficulty === ""){
      props.resultElement.difficulty = "N/A";
    }
    if(props.resultElement.giga_version === ""){
      props.resultElement.giga_version = "N/A";
    }
    if(props.resultElement.information === ""){
      props.resultElement.information = "N/A";
    }
    if(props.resultElement.operating_system === ""){
      props.resultElement.operating_system = "N/A";
    }
    if(props.resultElement.plot_filter === ""){
      props.resultElement.plot_filter = "N/A";
    }
    if(props.resultElement.thread_count === ""){
      props.resultElement.thread_count = "N/A";
    }
    if(props.resultElement.user === ""){
      props.resultElement.user = "N/A";
    }
},[backgroundColor])



  return (
    <>
      <div className="GPUResultsRow" style={{background:backgroundColor}} onClickCapture={()=>{setBackgroundColor('rgba(225, 225, 225, 1)')}}onClick={()=>{setClicked(!clicked)}} onMouseOver={()=>{setBackgroundColor('rgba(225, 225, 225, 1)')}} onMouseLeave={()=>{setBackgroundColor('rgba(245, 245, 245, 1)')}}>
          <p>CPU: {props.resultElement.cpu_used}</p>
          <p>C-Level: {props.resultElement.c_level}</p>
          <p>Difficulty: {props.resultElement.difficulty}</p>
          <p>Max Size (PiB): {props.resultElement.max_farm_size}</p>
      </div>
      {clicked ? 
      <div className='GPUResultsExtraInformation'>
        <p>Version: {props.resultElement.giga_version}</p>
        <p>OS: {props.resultElement.operating_system}</p>
        <p>User: {props.resultElement.user}</p>
        <p>Information: {props.resultElement.information}</p>
      </div>
      :
      <></>
      }
    </>
  );
}

export default GPUResultsRow;
