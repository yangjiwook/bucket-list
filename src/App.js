import React,{useState} from 'react';
import styled, {ThemeProvider} from 'styled-components/native';
import theme from './theme';
import { StatusBar, Alert } from 'react-native';
import Input from './components/Input';
import Task from './components/Task';
import {Dimensions} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';
import All_delBtn from './components/All_delBtn';
import LineButton from './components/LineButton';

const Container = styled.SafeAreaView`
  flex:1;
  background-color: ${({theme}) => theme.background};
  //background-color: ${(props) => props.theme.background};
  align-items: center;
  justify-content: flex-start;
`;

const Title = styled.Text`
  width: ${({width})=>width-40}px;
  height:60px
  text-align:center;
  background-color: ${({theme})=>theme.itemBackground};  
  font-size: 40px;
  font-weight: 600;
  color: ${({theme})=>theme.text};
  align-self: center; //flex-start;
  margin:0 20px;
`;

const List = styled.ScrollView`
  flex:1;
  width:${({width})=> width - 40}px;
  `;

const tmpData = {
    '1':{id:'1', text:'dodo_1', completed:false },
    '2':{id:'2', text:'dodo_2', completed:false },
    '3':{id:'3', text:'dodo_3', completed:false },
    '4':{id:'4', text:'dodo_4', completed:false }
  };

export default function App() {
  
  const [isReady, setIsReady] = useState(false);  //앱 실행준비 상태
  const [newTask, setNewTask ] = useState('');    //새로운 항목
  const [tasks, setTasks] = useState({});         //항목 리스트

  //로컬저장소에 데이터 저장하기
  const storeData = async (key, value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem(key, jsonValue)
      setTasks(value);
    } catch (e) {
      // saving error
    }
  }
  
  //로컬저장소에 데이터 가져오하기
  const getData = async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key)
      console.log(jsonValue);
      const tasks = jsonValue != null ? JSON.parse(jsonValue) : {};
      setTasks(tasks);
    } catch(e) {
      console.log('데이터 가져오기:'+jsonValue);
    }
  }

  //로컬저장소 삭제 by key
  const removeValue = async (key) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch(e) {
      // remove error
    }
      
    console.log('항목삭제:'+key);
  }

  //전체 삭제
  const clearAll = async () => {
    try {
      await AsyncStorage.clear()
    } catch(e) {
      // clear error
    }
  
    console.log('전체 삭제 Done.')
  }

  //추가
  const _addTask = ()=>{
    console.log('입력완료');
    const ID = Date.now().toString();
    const newTaskObject = {
      [ID]:{id:ID, text:newTask, completed:false}
    };

    //setTasks({...tasks, ...newTaskObject}); //객체 병합 by 스프레드문법
    storeData('tasks', {...tasks, ...newTaskObject});  //로컬저장소에 저장
    setNewTask('');
  };
  
  const _handleTextChange = text=>{
    setNewTask(text);
  };

  //삭제
  const _deleteTask = (id)=>{
    const currentTasks = {...tasks};  //객체복사
    delete currentTasks[id];
    //setTasks(currentTasks); //tasks = currentTasks;
    storeData('tasks', currentTasks);  //로컬저장소에 저장
  };


  //완료
  const _toggleTask = id => {
    const currentTasks = {...tasks};  //객체 복사
    currentTasks[id]['completed'] = !currentTasks[id]['completed'];
    //setTasks(currentTasks); //tasks = currentTasks;
    storeData('tasks', currentTasks);  //로컬저장소에 저장
  }

  //수정
  const _updateTask = task => {
    const currentTasks = {...tasks};   //객체 복사
    currentTasks[task.id] = task;      //수정 항목
    //setTasks(currentTasks); //tasks = currentTasks;
    storeData('tasks', currentTasks);  //로컬저장소에 저장
  }

  
  //완료항목 전체삭제
  const _delAllTask = () => {
    const currentTasks = { ...tasks };

    const completedTasks =
      Object.entries(currentTasks)
        .filter(task => task[1].completed == true);
    
    //완료항목이 없는경우
    if (completedTasks.length < 1) return alert('삭제할 항목이 없음');

    deleteCompletedItem = () => {
      const filterd_Tasks =
      Object.fromEntries(Object.entries(currentTasks)
                               .filter(task => task[1].completed ==false));
      storeData('tasks',filterd_Tasks);
    }

    Alert.alert(
      "삭제",           // 경고창 제목
      "완료항목 전체를 삭제하시겠습니까?",   // 경고창 메시지
      [
        {
          text: "예",
          onPress: () =>  deleteCompletedItem(),
        },
        {
          text: "아니오",
          onPress: () => { }
        }
      ]
    );
  }


  //입력필드에 포커스가 떠났을때
  const _onBlur = ()=>{
    setNewTask('');
  }

  const width = Dimensions.get('window').width;

  return !isReady ? (
      <AppLoading
        // 앱 로딩전 실행할 로직     
        startAsync={()=>{getData('tasks')}}
        // 저장소 전체 삭제
        //startAsync={()=>{clearAll()}}
        
        //startAsync호출이 성공적으로 수행되면
        onFinish={()=>setIsReady(true)}
        //startAsync호출이 실패하면
        onError={console.error}
     />
    ):(
    <ThemeProvider theme={theme}>
      <Container>
        <StatusBar
          barStyle="light-content"
          backgroundColor={theme.background}
        />
          <Title width={width}>버킷 리스트</Title>
        <Input 
          value={newTask}
          placeholder='+ 항목 추가'
          onChangeText={_handleTextChange}
          onSubmitEditing={_addTask}
          onBlur={_onBlur}
        />
        <List width={width}>
          {Object.values(tasks)
                 .reverse()
                 .map(task=><Task key={task.id}
                                  task={task} 
                                  deleteTask={_deleteTask}
                                  toggleTask={_toggleTask}
                                  updateTask={_updateTask}
                            />)
          }
          </List>
            
          {/* <All_delBtn  _all_deleteTask={_all_deleteTask}/> */}
          <LineButton
            text='완료항목 전체삭제'
            onPressOut={_delAllTask}
          />
        
      </Container>
    </ThemeProvider>
  );
}

