/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import Login from './Login';
import Home from './Home';
import CameraScreen from './CameraScreen';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import AudioScreen from './AudioScreen';
import BottomTab from './BottomTab';

const RootStack = createStackNavigator(
  {
    LoginScreen: Login,
    Tabs: BottomTab
  },
  {
    initialRouteName: 'LoginScreen',
  }
);

const AppContainer = createAppContainer(RootStack);


type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
        <AppContainer style={styles.container}>
        </AppContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});
