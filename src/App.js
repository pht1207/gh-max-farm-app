import logo from './logo.svg';
import './App.css';
import GPUResults from './components/GPUResults';
import Filter from './components/Filter';
import { useState } from 'react';

function App() {
  const [cLevel, setCLevel] = useState("Any");
  const [selectedGPU, setSelectedGPU] = useState("RTX 3060");

  return (
    <div className="App">
      <h1>Max Farm V3 Website</h1>
      <div className='AppContainer'>
        <Filter selectedGPU={selectedGPU} setSelectedGPU={setSelectedGPU}/>

        <GPUResults selectedGPU={selectedGPU} setSelectedGPU={setSelectedGPU} cLevel={cLevel} setCLevel={setCLevel}/>
      </div>
    </div>
  );
}

export default App;
