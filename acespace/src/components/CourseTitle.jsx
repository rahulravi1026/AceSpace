import styled from 'styled-components';

const RectangleContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: #444444;
  padding-top: 1vmin;
  padding-bottom: 1vmin;
  padding-right: 0.5vmin;
  border-radius: 4px;
  height: 1vmin;
  width: 12vmin;
  margin-left: 2vmin;
  margin-bottom: 1vmin;
`;

const Text = styled.span`
  font-size: 1.4vmin;
  color: #ffffff;
`;

const CrossButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 2.5vmin;
  color: #c35cf7;
`;

const CourseTitle = ({children, onRemove}) => {
  const handleRemove = () => {
    onRemove(children);
  };

  return (
    <RectangleContainer>
      <CrossButton onClick={handleRemove}>&times;</CrossButton>
      <Text>{children}</Text>
    </RectangleContainer>
  );
};

export default CourseTitle;