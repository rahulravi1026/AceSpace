import styled from 'styled-components';

const HeaderText = styled.h1`
    color: white;
    @media (orientation: landscape) {
        font-size: 3.5vw;
        margin-top: 8vmin;
    }
    @media (orientation: portrait) {
        font-size: 3.5vh;
        margin-top: 9vmax;
    }
`;

export default HeaderText;