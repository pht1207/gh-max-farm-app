import { useEffect, useState } from 'react';
import './Filter.css';
import axios from 'axios';
import FilterRow from './FilterRow';

function Filter(props) {

    const [gpuArray, setGPUArray] = useState([])

    useEffect(() =>{
        const fetchData = async () => { 
            try {
              const response = await axios.get("http://192.168.1.127:5012/showGPUNames", {});
              await setGPUArray(response.data.results)
            }
              catch (error) {
              console.error('Error fetching data: ', error);
            }
          };
          fetchData();
    },[])
    

    return (
        <div className="Filter">
            <h1>Filter</h1>
            {gpuArray.length > 0 ? 
            <>
                {gpuArray.map((resultElement, index) => 
                    <FilterRow key={index} resultElement={resultElement} index={index} selectedGPU={props.selectedGPU} setSelectedGPU={props.setSelectedGPU}/>
                )}

            </>
            :
            <>
                <p>array rendering...</p>
            </>}
        </div>
    );
}

export default Filter;
