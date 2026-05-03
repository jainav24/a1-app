import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from './src/context/ThemeContext';

import A1BotScreen from './src/screens/A1BotScreen';
import A1DesignScreen from './src/screens/A1DesignScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import CanvasScreen from './src/canvas_v2/CanvasScreen';
import LoginScreen from './src/screens/LoginScreen';
import NotificationScreen from './src/screens/NotificationScreen';
import PrivacyScreen from './src/screens/PrivacyScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ProjectDetailScreen from './src/screens/ProjectDetailScreen';
import SavedProjectsScreen from './src/screens/SavedProjectsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import SignupScreen from './src/screens/SignupScreen';
import SplashScreen from './src/screens/SplashScreen';
import SubscriptionScreen from './src/screens/SubscriptionScreen';
import TemplatesScreen from './src/screens/TemplatesScreen';
import TermsScreen from './src/screens/TermsScreen';
import WalkthroughScreen from './src/screens/WalkthroughScreen';

const Stack = createNativeStackNavigator();

function App() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ThemeProvider>
                <SafeAreaProvider>
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
                            <Stack.Screen name="CanvasScreen" component={CanvasScreen} />
                            <Stack.Screen name="TemplatesScreen" component={TemplatesScreen} />
                            <Stack.Screen name="A1DesignScreen" component={A1DesignScreen} />
                            <Stack.Screen name="A1BotScreen" component={A1BotScreen} />
                            <Stack.Screen name="SubscriptionScreen" component={SubscriptionScreen} />
                            <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} />
                            <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
                            <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
                            <Stack.Screen name="SavedProjectsScreen" component={SavedProjectsScreen} />
                            <Stack.Screen name="ProjectDetailScreen" component={ProjectDetailScreen} />
                            <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
                            <Stack.Screen name="TermsScreen" component={TermsScreen} />
                            <Stack.Screen name="PrivacyScreen" component={PrivacyScreen} />
                            <Stack.Screen name="WalkthroughScreen" component={WalkthroughScreen} />
                        </Stack.Navigator>
                    </NavigationContainer>
                </SafeAreaProvider>
            </ThemeProvider>
        </GestureHandlerRootView>
    );
}

export default App;
