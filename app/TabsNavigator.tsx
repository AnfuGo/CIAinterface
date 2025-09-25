import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import TabOneScreen from './tabs/index'; 
import TabTwoScreen from './tabs/explore'; 
import { Image, StyleSheet } from 'react-native';
import { PeripheralProvider } from './tabs/peripheralContext';

const Tab = createBottomTabNavigator();

export default function TabsNavigator() {
  return (
    <PeripheralProvider>
      <NavigationContainer>
        <Tab.Navigator screenOptions={{ headerShown: false }}>
          <Tab.Screen
            name="Home"
            component={TabOneScreen}
            options={{
              tabBarIcon: ({ focused }) => (
                <Image
                  source={require('assets/images/favicon.png')}
                  style={[
                    styles.icon,
                  ]}
                  resizeMode="cover"
                />
              ),
            }}
          />
          <Tab.Screen
            name="Control"
            component={TabTwoScreen}
            options={{
              tabBarIcon: ({ focused }) => (
                <Image
                  source={require('assets/images/control.png')}
                  style={[
                    styles.icon,
                  ]}
                  resizeMode="contain"
                />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </PeripheralProvider>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 30,
    height: 30,
  },
});