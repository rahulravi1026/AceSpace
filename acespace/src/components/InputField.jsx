import styled from 'styled-components';

const InputField = styled.input`
  font-size: 1.5vmin;
  background: #555555;
  color: white;
  border: 1px solid #222;
  border-radius: 8px;
  height: 3vmin;
  width: 35vmin;
  &:focus {
    border-color: #222222;
  }
  margin-left: ${({ leftColumn }) => (leftColumn ? '30vmin' : '0')};
  margin-right: ${({ rightColumn }) => (rightColumn ? '30vmin' : '0')}
  text-indent: 1vmin;
  opacity: ${({ readOnly }) => (readOnly ? '0.6' : '1')};
`;

export default InputField;