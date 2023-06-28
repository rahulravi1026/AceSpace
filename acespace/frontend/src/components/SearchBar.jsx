import styled from 'styled-components';

const SearchBar = styled.input`
  font-size: 1.5vmin;
  background: #555555;
  color: white;
  border: 1px solid #222;
  border-radius: 8px;
  height: 3vmin;
  width: 50vmin;
  &:focus {
    border-color: #222222;
  }
  text-indent: 1vmin;
`;

export default SearchBar;