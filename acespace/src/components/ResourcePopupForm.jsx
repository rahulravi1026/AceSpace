import { useState } from 'react';
import '../styles/resource-popup-styles.css';
import InputField from './InputField';
import PrimaryButton from './PrimaryButton';
import { useDropzone } from 'react-dropzone';

const ResourcePopupForm = ({handleSubmit, handleCancel}) => {
  const [title, setTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const titleCharacterLimit = 30;

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleFormSubmit = () => {
    handleSubmit(title, selectedFile);
  }
  
  const onDrop = (acceptedFiles) => {
    setSelectedFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: '.pdf',
  });

  const titleCharactersLeft = titleCharacterLimit - title.length;

  return (
    <div>
        <div className="overlay">
          <div className="resourcePopup">
            <h3 className = "popupTitle">Add a Resource</h3>
            <span className = "popupInstruction">Name</span>
            <InputField className = "tipsTitleInput" onChange={handleTitleChange} maxLength = {titleCharacterLimit} justifyWidth></InputField>
            <p className='charactersLeft'> {titleCharactersLeft} characters left </p>
            <span className = "popupInstruction">File</span>
            <div {...getRootProps()} className="dropzone">
              <input {...getInputProps()} />
                {isDragActive ? (
                  <p>Drop the PDF file here...</p>
                ) : selectedFile ? (
                  <p>{selectedFile.name}</p>
                ) : (
                  <p>Drag and drop a PDF file here, or click to select a file</p>
              )}
              {/* {selectedFile && <p>Selected file: {selectedFile.name}</p>} */}
            </div>
            <div className='buttons'>
                <PrimaryButton className = "submitButton" onClick={handleFormSubmit}>Submit</PrimaryButton>
                <PrimaryButton onClick={handleCancel}>Cancel</PrimaryButton>
            </div>
          </div>
        </div>
    </div>
  );
};

export default ResourcePopupForm;