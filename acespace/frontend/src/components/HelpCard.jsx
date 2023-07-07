import styled from 'styled-components';
import trashIcon from '../assets/trash-icon.png';

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

const TrashContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: auto;
`;

const TrashButton = styled.img`
  border: none;
  cursor: pointer;
  color: #c35cf7;
  margin-right: 1vmin;
  margin-left: 1vmin;
`;

const HelpCard = ({id, course, title, description, onDelete}) => {

  const handleDelete = () => {
    onDelete(id);
  }

  return (
    <RectangleContainer>
      <Title>{title} - {course}</Title>
      <Text>{description}</Text>
      <TrashContainer>
          <TrashButton src = {trashIcon} onClick={handleDelete}></TrashButton>
      </TrashContainer>
    </RectangleContainer>
  );
};

export default HelpCard;