import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import AddCheckupScreen from '../screens/AddCheckupScreen';
import CheckupDetailScreen from '../screens/CheckupDetailScreen';
import SetStartDateScreen from '../screens/SetStartDateScreen';
import { Colors } from '../constants/colors';

export type RootStackParamList = {
  Home: undefined;
  AddCheckup: { checkupId?: string } | undefined;
  CheckupDetail: { checkupId: string };
  SetStartDate: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="AddCheckup"
          component={AddCheckupScreen}
          options={{ animation: 'slide_from_bottom' }}
        />
        <Stack.Screen name="CheckupDetail" component={CheckupDetailScreen} />
        <Stack.Screen
          name="SetStartDate"
          component={SetStartDateScreen}
          options={{ animation: 'slide_from_bottom' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
