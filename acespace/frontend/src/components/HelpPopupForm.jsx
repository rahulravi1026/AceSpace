import { useState } from 'react';
import '../styles/tip-popup-styles.css';
import InputField from './InputField';
import PrimaryButton from './PrimaryButton';

const HelpPopupForm = ({handleSubmit, handleCancel, courseForHelp}) => {
  const [title, setTitle] = useState('');
  // const [time, setTime] = useState('');
  const [description, setDescription] = useState('');

  const titleCharacterLimit = 25;
  // const timeCharacterLimit = 3;
  const descriptionCharacterLimit = 250;

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  // const handleTimeChange = (event) => {
  //   setTime(event.target.value);
  // };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleFormSubmit = () => {
    handleSubmit(title, description, courseForHelp);
  }

  const titleCharactersLeft = titleCharacterLimit - title.length;
  // const timeCharactersLeft = timeCharacterLimit - time.length;
  const descriptionCharactersLeft = descriptionCharacterLimit - description.length;

  return (
    <div>
        <div className="overlay">
          <div className="popup">
            <h3 className = "popupTitle">Help For {courseForHelp}</h3>
            <span className = "popupInstruction">Topic / Assignment</span>
            <InputField className = "tipsTitleInput" placeholder = "e.g. reading x86-64 assembly" onChange={handleTitleChange} maxLength = {titleCharacterLimit}></InputField>
            <p className='charactersLeft'> {titleCharactersLeft} characters left </p>

            {/* <span className = "popupInstruction">When?</span>
            <InputField className = "tipsTitleInput" placeholder = "e.g. F23" onChange={handleTimeChange} maxLength = {timeCharacterLimit}></InputField>
            <p className='charactersLeft'> {timeCharactersLeft} characters left </p> */}

            <span className = "popupInstruction">Description</span>
            <textarea className = "tipsTextArea" onChange={handleDescriptionChange} maxLength = {descriptionCharacterLimit}/>
            <p className='charactersLeft'> {descriptionCharactersLeft} characters left </p>

            <div className='buttons'>
                <PrimaryButton className = "submitButton" onClick = {handleFormSubmit}>Request Help</PrimaryButton>
                <PrimaryButton onClick={handleCancel}>Cancel</PrimaryButton>
            </div>
          </div>
        </div>
    </div>
  );
};

export default HelpPopupForm;