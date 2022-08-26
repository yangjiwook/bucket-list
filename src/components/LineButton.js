import React from "react";
import styled from "styled-components/native";
import PropTypes from "prop-types";

// {name} = styled.TouchableOpacity
// => name 이름으로 TouchableOpacity 효과 사용 가능
const StyledTouchableOpacity = styled.TouchableOpacity`
    background-color : orange;
    width:100%;
    align-items:center;
`;

const StyledText = styled.Text`
    font-size: 20px;
    padding: 5px;
    font-weight: bold;
`;

//text : 제목
const LineButton = ( {text, onPressOut}) => {
    return (
        <StyledTouchableOpacity onPressOut={onPressOut}>
            <StyledText>{text}</StyledText>
        </StyledTouchableOpacity>
    );
}

LineButton.defaultProps = {
    text: '임시',
    onPressOut: () => {
        
    }
}

LineButton.proptypes = {
    text: PropTypes.string.isRequired,
    onPressOut : PropTypes.func.isRequired,
}


export default LineButton;