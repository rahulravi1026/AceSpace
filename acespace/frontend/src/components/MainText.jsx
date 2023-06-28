import styled from 'styled-components';

const MainText = styled.h1`
    color: white;
    @media (orientation: landscape) {
        font-size: 5vw;
        margin-top: 10vmin;
        margin-bottom: 12vmin;
    }
    @media (orientation: portrait) {
        font-size: 5vh;
        margin-top: 10vmax;
        margin-bottom: 12vmax;
    }
`;

export default MainText;