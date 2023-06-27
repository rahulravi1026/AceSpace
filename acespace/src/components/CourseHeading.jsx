import styled from 'styled-components';

const CourseHeading = styled.h1`
    color: white;
    @media (orientation: landscape) {
        font-size: 3vmin;
        margin-right: 2vmin;
    }
    &:hover {
        cursor: pointer;
        color: #c35cf7;
    }
`;

export default CourseHeading;