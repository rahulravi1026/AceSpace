import styled from 'styled-components';
import questionIcon from '../assets/question-icon.png';
import { useEffect, useState } from 'react';

const RectangleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #444444;
  padding-top: 1vmin;
  padding-bottom: 1vmin;
  padding-right: 0.5vmin;
  border-radius: 8px;
  height: 14%;
  width: 60%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 4vmin;
  cursor: pointer;
`;

const TextContainer = styled.div`
  //display: flex;
  //justify-content: space-between;
  //align-items: center;
  //margin-top: auto;
`;

const CourseText = styled.span`
  font-size: 2.7vmin;
  color: #ffffff;
  margin-left: 2vmin;
  font-weight: bold;
`;

const CourseNameText = styled.span`
  font-size: 2.4vmin;
  color: #ffffff;
  margin-left: 2vmin;
  //font-weight: bold;
`;


const IconsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
`;

const QuestionButton = styled.img`
  width: 3vmin;
  height: 3vmin;
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 3.5vmin;
  color: #c35cf7;
  margin-right: 4vmin;
`;

const CrossButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 3.5vmin;
  color: #c35cf7;
  margin-right: 0.5vmin;
`;

const HomeCourseTitle = ({children, getCourseName, onRemove, onHelp, goToCourse}) => {
  const [courseName, setCourseName] = useState('');

  const handleClick = () => {
    goToCourse(children);
  }

  useEffect(() => {
    const getName = async () => {
      const name = await getCourseName(children);
      setCourseName(name);
    }
    getName();
  }, [children, getCourseName]);

  const handleRemove = (e) => {
    e.stopPropagation();
    onRemove(children);
  };

  const handleHelp = (e) => {
    e.stopPropagation();
    onHelp();
  }

  return (
    <RectangleContainer onClick = {handleClick}>
      <TextContainer>
        <CourseText>{children}</CourseText>
        <CourseNameText>{courseName}</CourseNameText>
      </TextContainer>
      <IconsContainer> 
        <QuestionButton src = {questionIcon} onClick={handleHelp}></QuestionButton>
        <CrossButton onClick={handleRemove}>&times;</CrossButton> 
      </IconsContainer>
    </RectangleContainer>
  );
};

export default HomeCourseTitle;