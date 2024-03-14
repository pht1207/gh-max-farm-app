import './GPURow.css';

function GPURow(props) {
  return (
    <div className="GPURow">
        <p>Currently selected GPU: {props.selectedGPU}</p>
    </div>
  );
}

export default GPURow;
