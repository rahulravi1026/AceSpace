import { useState } from 'react';
import '../styles/tip-popup-styles.css';
import InputField from './InputField';
import PrimaryButton from './PrimaryButton';

const TipPopupForm = ({handleSubmit, handleCancel}) => {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [text, setText] = useState('');

  const titleCharacterLimit = 25;
  const timeCharacterLimit = 3;
  const textCharacterLimit = 250;

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleTimeChange = (event) => {
    setTime(event.target.value);
  };

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleFormSubmit = () => {
    handleSubmit(title, time, text);
  }

  const titleCharactersLeft = titleCharacterLimit - title.length;
  const timeCharactersLeft = timeCharacterLimit - time.length;
  const textCharactersLeft = textCharacterLimit - text.length;

  return (
    <div>
        <div className="overlay">
          <div className="popup">
            <h3 className = "popupTitle">Add a Tip</h3>
            <span className = "popupInstruction">Title</span>
            <InputField className = "tipsTitleInput" placeholder = "e.g. final study tips" onChange={handleTitleChange} maxLength = {titleCharacterLimit}></InputField>
            <p className='charactersLeft'> {titleCharactersLeft} characters left </p>

            <span className = "popupInstruction">When?</span>
            <InputField className = "tipsTitleInput" placeholder = "e.g. F23" onChange={handleTimeChange} maxLength = {timeCharacterLimit}></InputField>
            <p className='charactersLeft'> {timeCharactersLeft} characters left </p>

            <span className = "popupInstruction">Text</span>
            <textarea className = "tipsTextArea" onChange={handleTextChange} maxLength = {textCharacterLimit}/>
            <p className='charactersLeft'> {textCharactersLeft} characters left </p>

            <div className='buttons'>
                <PrimaryButton className = "submitButton" onClick={handleFormSubmit}>Submit</PrimaryButton>
                <PrimaryButton onClick={handleCancel}>Cancel</PrimaryButton>
            </div>
          </div>
        </div>
    </div>
  );
};

export default TipPopupForm;