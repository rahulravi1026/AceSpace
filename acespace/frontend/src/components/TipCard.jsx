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
  height: 20vmin;
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
`;

// const CrossButton = styled.button`
//   background-color: transparent;
//   border: none;
//   cursor: pointer;
//   font-size: 2.5vmin;
//   color: #c35cf7;
// `;

const TipCard = ({title, time, text}) => {
  // const handleRemove = () => {
  //   onRemove(children);
  // };

  return (
    <RectangleContainer>
      <Title>{title} ({time})</Title>
      {/* <CrossButton onClick={handleRemove}>&times;</CrossButton> */}
      <Text>{text}</Text>
    </RectangleContainer>
  );
};

export default TipCard;