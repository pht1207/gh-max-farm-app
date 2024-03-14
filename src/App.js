import logo from './logo.svg';
import './App.css';
import GPURow from './components/GPURow';
import Filter from './components/Filter';
import { useState } from 'react';

function App() {
  const [cLevel, setCLevel] = useState();
  const [selectedGPU, setSelectedGPU] = useState("RTX 3060");

  return (
    <div className="App">
      <h1>Max Farm V3 Website</h1>
      <div className='AppContainer'>
        <Filter selectedGPU={selectedGPU} setSelectedGPU={setSelectedGPU}/>

        <GPURow selectedGPU={selectedGPU} setSelectedGPU={setSelectedGPU}/>
      </div>
    </div>
  );
}

export default App;
