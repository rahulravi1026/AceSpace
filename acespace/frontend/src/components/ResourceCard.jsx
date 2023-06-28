import styled from 'styled-components';

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
  &:hover {
    cursor: pointer;
  }
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
  height: auto;
  border-radius: 8px;
  max-height: calc(28vmin - 5vmin);
  margin: auto;
`;

const ResourceCard = ({title, time, image, selectedFile}) => {
  // const handleRemove = () => {
  //   onRemove(children);
  // };

  const openPDFFile = () => {
    if (selectedFile) {
      // const url = URL.createObjectURL(selectedFile);
      console.log(image)
      window.open(selectedFile, '_blank');
    }
  };
  return (
    <RectangleContainer onClick={openPDFFile}>
      <Title>{title} ({time})</Title>
      <Image src = {image} alt = "PDF Preview"></Image>
      {/* <CrossButton onClick={handleRemove}>&times;</CrossButton> */}
      {/* <Text>{text}</Text> */}
    </RectangleContainer>
  );
};

export default ResourceCard;