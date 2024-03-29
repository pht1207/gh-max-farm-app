import { useEffect, useState } from 'react';
import './Filter.css';
import axios from 'axios';
import FilterRow from './FilterRow';

function Filter(props) {

    const [gpuArray, setGPUArray] = useState([])

    useEffect(() =>{
        const fetchData = async () => { 
            try {
              const response = await axios.get("https://gh-max-farm.parkert.dev/backend/showGPUNames", {});
              await setGPUArray(response.data.results)
            }
              catch (error) {
              console.error('Error fetching data: ', error);
            }
          };
          fetchData();
    },[])
    
    const resultElementAny = {gpu_name:"Any"}

    return (
        <div className="Filter">
            <h2>Select GPU to Filter By</h2>
            <FilterRow resultElement={resultElementAny} index={-1} selectedGPU={props.selectedGPU} setSelectedGPU={props.setSelectedGPU}/>
            {gpuArray.length > 0 ? 
            <>
                {gpuArray.map((resultElement, index) => 
                    <FilterRow key={index} resultElement={resultElement} index={index} selectedGPU={props.selectedGPU} setSelectedGPU={props.setSelectedGPU}/>
                )}

            </>
            :
            <>
                <p>fetching array...</p>
            </>}
        </div>
    );
}

export default Filter;
