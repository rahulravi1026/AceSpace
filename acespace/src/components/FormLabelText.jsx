import styled from 'styled-components';

const FormLabelText = styled.h1`
    color: white;
    @media (orientation: landscape) {
        font-size: 1.8vw;
        margin-left: ${({ leftColumn }) => (leftColumn ? '30vmin' : '0')};
        margin-right: ${({ rightColumn }) => (rightColumn ? '30vmin' : '0')}
    }
    @media (orientation: portrait) {
        font-size: 1.8vh;
        //margin-left: ${({ leftColumn }) => (leftColumn ? '30vmin' : '0')};
        //margin-right: ${({ rightColumn }) => (rightColumn ? '55vmin' : '0')}
    }
`;

export default FormLabelText;