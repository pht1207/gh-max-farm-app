import { useEffect, useState } from 'react';
import './GPUResults.css';

function GPUResultsRow(props) {
  const [backgroundColor, setBackgroundColor] = useState('rgba(245, 245, 245, 1)')
  const [clicked, setClicked] = useState(false);

  useEffect(()=>{
    console.log(props.resultElement)
},[])



  return (
    <>
      <div className="GPUResultsRow" style={{background:backgroundColor}} onClick={()=>{setClicked(!clicked)}} onMouseOver={()=>{setBackgroundColor('rgba(225, 225, 225, 1)')}} onMouseLeave={()=>{setBackgroundColor('rgba(245, 245, 245, 1)')}}>
          <p>CPU: {props.resultElement.cpu_used}</p>
          <p>Threads: {props.resultElement.thread_count}</p>
          <p>Difficulty: {props.resultElement.difficulty}</p>
          <p>Max Size (PiB): {props.resultElement.plot_filter}</p>
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
