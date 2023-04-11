import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import {TouchableOpacity, Text} from 'react-native'
import {useNavigation} from '@react-navigation/core'
import Tabs from './tabs';
import ProfileStack from './profileStack';
import LandingScreen from '../screens/LandingScreen';
import SplashScreen from '../screens/SplashScreen';
import SignupScreen from '../screens/SignupScreen';

const Stack = createNativeStackNavigator();

function LoginStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#213A5C',
        }
      }}
    >
      <Stack.Screen options={{ headerShown: false }} name="Landing" component={LandingScreen} />
      <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
      <Stack.Screen options={{ headerShown: false }} name="Signup" component={SignupScreen} />
      <Stack.Screen options={{ headerShown: false }} name="Starting" component={SplashScreen} />
      <Stack.Screen options={{ headerShown: false }} name="App" component={Tabs} />
      <Stack.Screen options={{ headerShown: false }} name="Profiles" component={ProfileStack} />
    </Stack.Navigator>
  );
}

export default LoginStack;