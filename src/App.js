import './App.css';
import GPUResults from './components/GPUResults';
import Filter from './components/Filter';
import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [cLevel, setCLevel] = useState("Any");
  const [kSize, setKSize] = useState("32");
  const [gigaVersion, setGigaVersion] = useState("Any")
  const [selectedGPU, setSelectedGPU] = useState("RTX 3060");

  const [gigaVersionArray, setGigaVersionArray] = useState([""])

  //used to get the giga_version values from csv
  useEffect(()=>{
    const fetchData = async () => { 
      try {
          const response = await axios.get("https://gh-max-farm.parkert.dev/backend/getFilterValues", {});
          setGigaVersionArray(response.data.results)
      }
        catch (error) {
        console.error('Error fetching data: ', error);
      }
    };
    fetchData();
  },[])

  return (
    <div className="App">
      <h1>Max Farm V3 Website</h1>
      <div className='AppContainer'>
        <Filter selectedGPU={selectedGPU} setSelectedGPU={setSelectedGPU}/>

        <GPUResults selectedGPU={selectedGPU} setSelectedGPU={setSelectedGPU} 
        cLevel={cLevel} setCLevel={setCLevel} 
        kSize={kSize} setKSize={setKSize} 
        gigaVersion={gigaVersion} setGigaVersion={setGigaVersion}
        gigaVersionArray={gigaVersionArray} setGigaVersionArray={setGigaVersionArray}
        />
        
      </div>
      <div className='Footer'><p onClick={()=>{window.open("https://github.com/pht1207")}}>Made by Parker Throneberry</p></div>
    </div>
  );
}

export default App;
