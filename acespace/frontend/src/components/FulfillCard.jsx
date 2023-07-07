import styled from 'styled-components';

const RectangleContainer = styled.div`
  display: flex;
  flex-direction: column;
  // align-items: center;
  background-color: #444444;
  padding-top: 1vmin;
  padding-bottom: 1vmin;
  padding-right: 0.5vmin;
  border-radius: 8px;
  height: 23vmin;
  width: 28vmin;
  margin-left: 2vmin;
  margin-bottom: 1vmin;
`;

const Title = styled.span`
  font-size: 1.6vmin;
  color: #ffffff;
  font-weight: bold;
  margin-bottom: 1vmin;
  margin-top: 0.5vmin;
  text-align: center;
  word-wrap: break-word;
`;

const Text = styled.span`
  font-size: 1.4vmin;
  color: #ffffff;
  padding: 0.7rem;
  text-align: left;
  word-wrap: break-word;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
`;

const CheckButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 3.5vmin;
  color: #c35cf7;
  margin-left: 3vmin;
`;

const CrossButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 4.5vmin;
  color: #c35cf7;
  margin-right: 3vmin;
`;

const FulfillCard = ({id, course, title, description, onDelete}) => {

  const handleDelete = () => {
    onDelete(id);
  }

  return (
    <RectangleContainer>
      <Title>{title} - {course}</Title>
      <Text>{description}</Text>
      <ButtonContainer>
          <CheckButton>&#10003;</CheckButton>
          <CrossButton onClick= {handleDelete}>&times;</CrossButton>
      </ButtonContainer>
    </RectangleContainer>
  );
};

export default FulfillCard;