import styled from 'styled-components';
import trashIcon from '../assets/trash-icon.png';

const RectangleContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #444444;
  padding-top: 1vmin;
  padding-bottom: 1vmin;
  //padding-right: 0.5vmin;
  border-radius: 8px;
  height: 28vmin;
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

const Image = styled.img`
  width: 85%;
  height: 75%;
  border-radius: 8px;
  max-height: calc(28vmin - 5vmin);
  margin: auto;
  &:hover {
    cursor: pointer;
  }
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

const TrashButton = styled.img`
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: #c35cf7;
  margin-right: 1vmin;
  margin-left: 1vmin;
`;

const ResourceCard = ({id, title, time, image, selectedFile, votes, onUpvote, onDownvote, userUpvoted, userDownvoted, userUploaded, onDelete}) => {
  const openPDFFile = () => {
    if (selectedFile) {
      console.log(image)
      window.open(selectedFile, '_blank');
    }
  };

  const handleUpvote = () => {
    onUpvote(id);
  }

  const handleDownvote = () => {
    onDownvote(id);
  }

  const handleDelete = () => {
    onDelete(id);
  }

  return (
    <RectangleContainer>
      <Title>{title} ({time})</Title>
      <Image src = {image} alt = "PDF Preview" onClick={openPDFFile}></Image>
      <VotingContainer>
          <VotingButtons>
            <UpvoteButton onClick = {handleUpvote} userUpvoted = {userUpvoted}>&uarr;</UpvoteButton>
            <NumVotes userUpvoted = {userUpvoted} userDownvoted = {userDownvoted}>{votes}</NumVotes>
            <DownvoteButton onClick = {handleDownvote} userDownvoted = {userDownvoted}>&darr;</DownvoteButton>
          </VotingButtons>
          {userUploaded &&
              <TrashButton src = {trashIcon} onClick = {handleDelete}></TrashButton>
          }
      </VotingContainer>
    </RectangleContainer>
  );
};

export default ResourceCard;