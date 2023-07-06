import styled from 'styled-components';
import questionIcon from '../assets/question-icon.png';

const RectangleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #444444;
  padding-top: 1vmin;
  padding-bottom: 1vmin;
  padding-right: 0.5vmin;
  border-radius: 4px;
  height: 14%;
  width: 60%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 4vmin;
`;

const Text = styled.span`
  font-size: 2.7vmin;
  color: #ffffff;
  margin-left: 2vmin;
  font-weight: bold;
`;

const QuestionButton = styled.img`
  width: 3vmin;
  height: 3vmin;
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 3.5vmin;
  color: #c35cf7;
  margin-right: 2vmin
`;

const CrossButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 3.5vmin;
  color: #c35cf7;
`;

const HomeCourseTitle = ({children, onRemove}) => {
  const handleRemove = () => {
    onRemove(children);
  };

  return (
    <RectangleContainer>
      {/* <CrossButton onClick={handleRemove}>&times;</CrossButton> */}
      <div>
        <Text>{children}</Text>
        <Text>Introduction to Computer Science</Text>
      </div>
      <div> 
        <QuestionButton src = {questionIcon}></QuestionButton>
        <CrossButton onClick={handleRemove}>&times;</CrossButton> 
      </div>
    </RectangleContainer>
  );
};

export default HomeCourseTitle;