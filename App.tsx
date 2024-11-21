import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MyStack from './src/navigation/MyStack';
import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform, Alert } from 'react-native';

const App = () => {
  // 권한 요청 함수 (Android 13 이상에서 POST_NOTIFICATIONS 요청)
  const requestNotificationPermission = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          {
            title: "알림 권한 요청",
            message: "앱에서 알림을 보내기 위해 권한이 필요합니다.",
            buttonNeutral: "나중에",
            buttonNegative: "거부",
            buttonPositive: "허용",
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("알림 권한이 허용되었습니다.");
        } else {
          console.log("알림 권한이 거부되었습니다.");
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  // FCM 사용자 권한 요청
  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("Authorization status:", authStatus);
    }
  }

  // FCM 토큰 가져오기
  const getToken = async () => {
    try {
      const token = await messaging().getToken();
      console.log("Firebase Token:", token);
    } catch (error) {
      console.log("토큰 가져오기 실패:", error);
    }
  };

  // 푸시 알림 처리
  const handleForegroundMessage = () => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log("푸시 알림 수신:", remoteMessage);
      Alert.alert("푸시 알림", JSON.stringify(remoteMessage.notification.body));
    });
    return unsubscribe; // 언마운트 시 이벤트 해제
  };

  useEffect(() => {
    requestNotificationPermission(); // Android 권한 요청
    requestUserPermission(); // FCM 권한 요청
    getToken(); // FCM 토큰 가져오기
    const unsubscribe = handleForegroundMessage(); // 푸시 알림 이벤트 등록

    return unsubscribe; // 컴포넌트 언마운트 시 이벤트 해제
  }, []);

  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
};

export default App;