import styled from 'styled-components';

const InputField = styled.input`
  font-size: 1.5vmin;
  background: #555555;
  color: white;
  border: 1px solid #222;
  border-radius: 8px;
  height: 3vmin;
  width: ${({ justifyWidth }) => (justifyWidth ? '' : '35vmin')};
  &:focus {
    border-color: #222222;
  }
  margin-left: ${({ leftColumn }) => (leftColumn ? '30vmin' : '0')};

  opacity: ${({ readOnly }) => (readOnly ? '0.6' : '1')};
  text-indent: 1vmin;
  margin-right: ${({ rightColumn }) => (rightColumn ? '30vmin' : '0')}
`;

export default InputField;