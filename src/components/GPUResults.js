import { useEffect, useState } from 'react';
import './GPUResults.css';
import axios from 'axios';
import GPUResultsRow from './GPUResultsRow';

function GPUResults(props) {
  const [gpuResults, setGPUResults] = useState([]);

  useEffect(()=>{
    console.log('change')
    console.log(props.cLevel)
      const fetchData = async () => { 
          try {
            if(props.cLevel === "Any"){
              console.log("Any")
              const response = await axios.get("http://192.168.1.127:5012/showResultsTableByGPU?gpu="+props.selectedGPU, {});
              setGPUResults(response.data.results)
              console.log(response.data.results)

            }
            else{
              console.log("clevel "+props.cLevel)
              console.log("http://192.168.1.127:5012/showResultsTableByGPU?gpu="+props.selectedGPU+"&clevel="+props.cLevel)
              const response = await axios.get("http://192.168.1.127:5012/showResultsTableByCLevelAndGPU?gpu="+props.selectedGPU+"&clevel="+props.cLevel, {});
              setGPUResults(response.data.results)
            }
          }
            catch (error) {
            console.error('Error fetching data: ', error);
          }
        };
        fetchData();
  },[props.selectedGPU, props.cLevel])




  return (
    <div className="GPUResults">
      <div className='GPUResultsHeader'>
        <p>Currently selected GPU: {props.selectedGPU}</p>
        <div className='CLevelSelector'>
          <p>Set C Level:</p>
          <select onChange={(event)=>{props.setCLevel(event.target.value)}}>
            <option value="Any">Any</option>
            <option value="26">C26</option>
            <option value="27">C27</option>
            <option value="28">C28</option>
            <option value="29">C29</option>
            <option value="30">C30</option>
            <option value="31">C31</option>
            <option value="32">C32</option>
            <option value="33">C33</option>
        </select>
        </div>
      </div>
      <br/>
      <p>Showing {gpuResults.length} results for: "{props.selectedGPU}" at C-Level: "{props.cLevel}"</p>
      <br/>
    {gpuResults.length > 0 ? 
            <>
                {gpuResults.map((resultElement, index) => 
                    <GPUResultsRow key={index} resultElement={resultElement} index={index}/>
                )}

            </>
            :
            <>
                <p>No Results</p>
            </>}
    </div>
  );
}

export default GPUResults;
