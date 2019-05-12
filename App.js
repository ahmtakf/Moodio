/**
 * Moodio
 * https://github.com/ahmtakf/Moodio
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import {createAppContainer, createStackNavigator} from 'react-navigation';
import BottomTab from './src/BottomTab';
import RecordDetect from './src/screens/RecordDetectScreen';

const RootStack = createStackNavigator(
    {
      LoginScreen: LoginScreen,
      RecordDetectScreen: RecordDetect,
      Tabs: BottomTab,
    },
    {
      initialRouteName: 'LoginScreen',
    },
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
  },
});
