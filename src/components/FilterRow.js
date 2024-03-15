import { useEffect, useState } from 'react';
import './Filter.css';

function FilterRow(props) {
    const [backgroundColor, setBackgroundColor] = useState('white')
    useEffect(()=>{
        if(props.index % 2 === 0){
            setBackgroundColor("rgba(0, 0, 0, 0.123)");
        }
    },[])

    function FilterRowClick(){
        props.setSelectedGPU(props.resultElement.gpu_name)
    }

  return (
    <div className="FilterRow" onClick={FilterRowClick}style={{background:backgroundColor}}>
        <p>{props.resultElement.gpu_name}</p>
    </div>
  );
}

export default FilterRow;
