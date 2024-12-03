import { AppRegistry } from 'react-native';
import MyStack from './src/navigation/MyStack'; // Navigation 파일 가져오기
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => MyStack);