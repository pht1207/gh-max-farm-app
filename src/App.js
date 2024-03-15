import './App.css';
import GPUResults from './components/GPUResults';
import Filter from './components/Filter';
import { useState } from 'react';

function App() {
  const [cLevel, setCLevel] = useState("Any");
  const [kSize, setKSize] = useState("32");
  const [selectedGPU, setSelectedGPU] = useState("RTX 3060");

  return (
    <div className="App">
      <h1>Max Farm V3 Website</h1>
      <div className='AppContainer'>
        <Filter selectedGPU={selectedGPU} setSelectedGPU={setSelectedGPU}/>

        <GPUResults selectedGPU={selectedGPU} setSelectedGPU={setSelectedGPU} cLevel={cLevel} setCLevel={setCLevel} kSize={kSize} setKSize={setKSize}/>
      </div>
      <div className='Footer'><p onClick={()=>{window.open("https://github.com/pht1207")}}>Made by Parker Throneberry</p></div>
    </div>
  );
}

export default App;
