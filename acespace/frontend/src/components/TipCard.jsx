import styled from 'styled-components';
import editIcon from '../assets/edit-icon.png';

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

const VotingContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
`;

const VotingButtons = styled.div`
  display: flex;
  align-items: center;
`;

const UpvoteButton = styled.button`
  background-color: #444444;
  color: ${props => props.userUpvoted ? "#c35cf7" : "#ffffff"};
  border: none;
  font-size: 1.5rem;
  &:hover {
    cursor: pointer;
  }
`;

const DownvoteButton = styled.button`
  background-color: #444444;
  color: ${props => props.userDownvoted ? "#c35cf7" : "#ffffff"};
  border: none;
  font-size: 1.5rem;
  font-weight: bold;
  &:hover {
    cursor: pointer;
  }
`;

const NumVotes = styled.span`
  color: ${props => (props.userUpvoted || props.userDownvoted) ? "#c35cf7" : "#ffffff"};
  font-size: 1.3rem;
  font-weight: bold;
`;

const EditButton = styled.img`
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: #c35cf7;
  margin-right: 1vmin;
  margin-left: 1vmin;
`;

const TipCard = ({id, title, time, text, votes, onUpvote, onDownvote, userUpvoted, userDownvoted, userUploaded, onEdit}) => {

  const handleUpvote = () => {
    onUpvote(id);
  }

  const handleDownvote = () => {
    onDownvote(id);
  }

  const handleEdit = () => {
    onEdit(id, title, time, text);
  }

  return (
    <RectangleContainer>
      <Title>{title} ({time})</Title>
      <Text>{text}</Text>
      <VotingContainer>
          <VotingButtons>
            <UpvoteButton onClick={handleUpvote} userUpvoted = {userUpvoted}>&uarr;</UpvoteButton>
            <NumVotes userUpvoted = {userUpvoted} userDownvoted = {userDownvoted}>{votes}</NumVotes>
            <DownvoteButton onClick={handleDownvote} userDownvoted = {userDownvoted}>&darr;</DownvoteButton>
          </VotingButtons>
          {userUploaded &&
              <EditButton src = {editIcon} onClick = {handleEdit}></EditButton>
          }
      </VotingContainer>
    </RectangleContainer>
  );
};

export default TipCard;