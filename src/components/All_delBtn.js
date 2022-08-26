import React, { useState } from "react";
import styled from "styled-components/native";
import {TouchableOpacity} from 'react-native';
import Proptypes from 'prop-types';
import {Dimensions} from 'react-native';

const Del_btn = styled.Text`
  width: ${({width})=>width-60}px;
  height: 60px;
  text-align:center;
  border-radius: 10px;
  background-color: ${({theme})=>theme.itemBackground};  
  font-size: 40px;
  font-weight: 400;
  color: ${({theme})=>theme.text};  
  margin:0 20px;
`;

const All_delBtn = ({_all_deleteTask})=>{
  //길이 동적 조절 Dimensions
  const width = Dimensions.get('window').width;

  return (
    <TouchableOpacity  onPressOut={_all_deleteTask}>
          <Del_btn width={width} >완료항목 전체삭제</Del_btn>
    </TouchableOpacity>
  )
};

//핸들러가 넘어오지 않더라도 오류발생하지 않도록 디폴트 처리함.
All_delBtn.defaultProps = {
  onPressOut:()=>{}
}

All_delBtn.proptypes = {
  onPressOut:Proptypes.func,
}


export default All_delBtn;
