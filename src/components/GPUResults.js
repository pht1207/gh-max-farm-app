import { useEffect, useState } from 'react';
import './GPUResults.css';
import axios from 'axios';
import GPUResultsRow from './GPUResultsRow';

function GPUResults(props) {
  const [gpuResults, setGPUResults] = useState([]);

  useEffect(()=>{
      const fetchData = async () => { 
          try {
              const response = await axios.get("https://gh-max-farm.parkert.dev/backend/showResultsTableByGPU?gpu="+encodeURIComponent(props.selectedGPU)+"&clevel="+encodeURIComponent(props.cLevel)+"&ksize="+encodeURIComponent(props.kSize)+"&gigaversion="+encodeURIComponent(props.gigaVersion), {});
              setGPUResults(response.data.results)
          }
            catch (error) {
            console.error('Error fetching data: ', error);
          }
        };
        fetchData();
  },[props.selectedGPU, props.cLevel, props.kSize, props.gigaVersion])


  //used to create the giga version select element array



  return (
    <div className="GPUResults">
      <div className='GPUResultsHeader'>
        <p>Currently selected GPU: {props.selectedGPU}</p>
        <div className='CLevelSelector'>
          <p>Set K-Size and C-Level:</p>
          <select defaultValue={"32"} onChange={(event)=>{props.setKSize(event.target.value)}}>
            <option value="32">K32</option>
            <option value="33">K33</option>
            <option value="34">K34</option>

        </select>
        <select defaultValue={"Any"} onChange={(event)=>{props.setGigaVersion(event.target.value)}}>
            <option value="Any">Any</option>
            {props.gigaVersionArray.map((value, index) =>(
                <option key={index}>{value.giga_version}</option>
            ))}
        </select>
        <select defaultValue={"Any"} onChange={(event)=>{props.setCLevel(event.target.value)}}>
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
      <p onClick={()=>{console.log(gpuResults)}}>Showing {gpuResults.length} results for: "{props.selectedGPU}" at K-Size "{props.kSize}" C-Level: "{props.cLevel}"</p>
      <hr style={{width:"100%"}}/>
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
