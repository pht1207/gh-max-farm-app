import { useEffect, useState } from 'react';
import './Filter.css';

function FilterRow(props) {
    const [backgroundColor, setBackgroundColor] = useState('rgba(245, 245, 245, 1)')
    const [mouseHover, setMouseHover] = useState(false)
    useEffect(()=>{
        if(mouseHover === true){
            setBackgroundColor("rgba(0, 0, 0, 0.123)");
        }
        else{ //change back to default on mouse leave
                setBackgroundColor('rgba(245, 245, 245, 1)')
        }
    },[mouseHover])
    

    function FilterRowClick(){
        props.setSelectedGPU(props.resultElement.gpu_name)
    }

  return (
    <div className="FilterRow" onClick={FilterRowClick}style={{background:backgroundColor}} onMouseOver={()=>{setMouseHover(true)}} onMouseLeave={()=>{setMouseHover(false)}}>
        <p>{props.resultElement.gpu_name}</p>
    </div>
  );
}

export default FilterRow;
