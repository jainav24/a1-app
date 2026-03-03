import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import DesignCanvasScreen from './src/screens/DesignCanvasScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import TemplatesScreen from './src/screens/TemplatesScreen';
import A1DesignScreen from './src/screens/A1DesignScreen';
import A1BotScreen from './src/screens/A1BotScreen';
import SubscriptionScreen from './src/screens/SubscriptionScreen';
import SplashScreen from './src/screens/SplashScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';

const Stack = createNativeStackNavigator();

function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="SplashScreen"
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen name="SplashScreen" component={SplashScreen} />
                <Stack.Screen name="LoginScreen" component={LoginScreen} />
                <Stack.Screen name="SignupScreen" component={SignupScreen} />
                <Stack.Screen name="DashboardScreen" component={DashboardScreen} />
                <Stack.Screen name="DesignCanvasScreen" component={DesignCanvasScreen} />
                <Stack.Screen name="TemplatesScreen" component={TemplatesScreen} />
                <Stack.Screen name="A1DesignScreen" component={A1DesignScreen} />
                <Stack.Screen name="A1BotScreen" component={A1BotScreen} />
                <Stack.Screen name="SubscriptionScreen" component={SubscriptionScreen} />
                <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} />
                <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
                <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;
