import './App.css';
import GPUResults from './components/GPUResults';
import Filter from './components/Filter';
import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [cLevel, setCLevel] = useState("Any");
  const [kSize, setKSize] = useState("32");
  const [gigaVersion, setGigaVersion] = useState("Any")
  const [selectedGPU, setSelectedGPU] = useState("Any");

  const [gigaVersionArray, setGigaVersionArray] = useState([""])
  const [kSizeArray, SetKSizeArray] = useState([""])
  const [cLevelArray, setCLevelArray] = useState([""])

  const [siteViews, setSiteViews] = useState(1);

  //used to get the giga_version values from csv
  useEffect(()=>{
    const fetchData = async () => { 
      try {
          const response = await axios.get("https://gh-max-farm.parkert.dev/backend/getGigaVersions", {});
          setGigaVersionArray(response.data.results)
      }
        catch (error) {
        console.error('Error fetching data: ', error);
      }
    };
    fetchData();
  },[])
  useEffect(()=>{
    const fetchData = async () => { 
      try {
          const response = await axios.get("https://gh-max-farm.parkert.dev/backend/getCLevels", {});
          setCLevelArray(response.data.results)
      }
        catch (error) {
        console.error('Error fetching data: ', error);
      }
    };
    fetchData();
  },[])
  useEffect(()=>{
    const fetchData = async () => { 
      try {
          const response = await axios.get("https://gh-max-farm.parkert.dev/backend/getKSizes", {});
          SetKSizeArray(response.data.results)
      }
        catch (error) {
        console.error('Error fetching data: ', error);
      }
    };
    fetchData();
  },[])

  useEffect(()=>{
    const fetchData = async () => { 
      try {
          const response = await axios.get("https://gh-max-farm.parkert.dev/backend/getSiteViews", {});
          setSiteViews(response.data.results[0].view_count)
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
        cLevelArray={cLevelArray} setCLevelArray={setCLevelArray}
        kSizeArray={kSizeArray} SetKSizeArray={SetKSizeArray}
        />
        
      </div>
      <div className='Footer'>
        <div className='InternalFooterDiv'>
          <p>Total Site views: {siteViews}</p>
          <p onClick={()=>{window.open("https://github.com/pht1207")}}>Made by Parker Throneberry</p>
        </div>
      </div>
    </div>
  );
}

export default App;
