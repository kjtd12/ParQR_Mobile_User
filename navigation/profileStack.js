import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EditProfile from '../components/profile/EditProfile';
import MyWallet from '../components/profile/MyWallet';
import HelpSupport from '../components/profile/HelpSupport';
import AboutApp from '../components/profile/AboutApp';
import VehiclesList from '../components/profile/VehiclesList';
import EditVehicle from '../components/profile/EditVehicle';

const Stack = createNativeStackNavigator();

function ProfileStack(){
    return (
        <Stack.Navigator>
            <Stack.Screen options={{ headerShown: false }} name="Edit Profile" component={EditProfile}/>
            <Stack.Screen options={{ headerShown: false }} name="My Wallet" component={MyWallet}/>
            <Stack.Screen options={{ headerShown: false }} name="Vehicles" component={VehiclesList}/>
            <Stack.Screen options={{ headerShown: false }} name="EditVehicle" component={EditVehicle}/>
            <Stack.Screen options={{ headerShown: false }} name="Help & Support" component={HelpSupport}/>
            <Stack.Screen options={{ headerShown: false }} name="About App" component={AboutApp}/>
        </Stack.Navigator>
    )
}

export default ProfileStack;