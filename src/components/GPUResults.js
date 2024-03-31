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
              console.log(response.data.results);
          }
            catch (error) {
            console.error('Error fetching data: ', error);
          }
        };
        fetchData();
  },[props.selectedGPU, props.cLevel, props.kSize, props.gigaVersion])





  return (
    <div className="GPUResults">
      <div className='GPUResultsHeader'>
        <p>Currently selected GPU: {props.selectedGPU}</p>
        <div className='CLevelSelector'>
          <p>Set K-Size, C-Level and GH-Version:</p>
          <select defaultValue={"32"} onChange={(event)=>{props.setKSize(event.target.value)}}>
            {props.kSizeArray.map((value, index) =>(
                <option key={index} value={value.k_size}>K{value.k_size}</option>
            ))}
        </select>
        <select defaultValue={"Any"} onChange={(event)=>{props.setCLevel(event.target.value)}}>
          <option value="Any">Any</option>
            {props.cLevelArray.map((value, index) =>(
                <option key={index}>{value.c_level}</option>
            ))}
        </select>
        <select defaultValue={"Any"} onChange={(event)=>{props.setGigaVersion(event.target.value)}}>
            <option value="Any">Any</option>
              {props.gigaVersionArray.map((value, index) =>(
            <option key={index}>{value.giga_version}</option>
            ))}
        </select>

        </div>
      </div>
      <br/>
      <p>Showing {gpuResults.length} results for:&ensp;[GPU: {props.selectedGPU}] &ensp;[K-Size: {props.kSize}] &ensp;[C-Level: {props.cLevel}] &ensp;[Version: {props.gigaVersion}]</p>
      <hr style={{width:"100%"}}/>
      {gpuResults.length > 0 ? 
            <>
                {gpuResults.map((resultElement, index) => 
                    <GPUResultsRow key={index} resultElement={resultElement} index={index} selectedGPU={props.selectedGPU}/>
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
