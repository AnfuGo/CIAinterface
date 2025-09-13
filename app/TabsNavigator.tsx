import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import TabOneScreen from './tabs/index'; 
import TabTwoScreen from './tabs/explore'; 
import { Image } from 'react-native';
import { IconSymbol } from 'components/ui/IconSymbol';

const Tab = createBottomTabNavigator();

export default function TabsNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen
          name="Home"
          component={TabOneScreen}
          options={{
           tabBarIcon: ({ color }) => <IconSymbol size={24} name="house.fill" color={color} />,
                }}
              />
        <Tab.Screen
          name="Control"
          component={TabTwoScreen}
           options={{
           tabBarIcon: ({ color }) => <IconSymbol size={28} name="chevron.right" color={color} />,
                }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
