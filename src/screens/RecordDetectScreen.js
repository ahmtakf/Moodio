import React from 'react';
import {ScrollView, StyleSheet, Text} from 'react-native';

class RecordDetect extends React.Component {

  constructor(props) {
    super(props);
    this.state = {text: this.props.navigation.state.params.data.res};
  }

  componentDidMount() {
    this.setState({text: this.props.navigation.state.params.data.res});
  }

  render() {
    return (
        <ScrollView>
          <Text>Speech-To-Text: {JSON.stringify(this.state.text)}</Text>
        </ScrollView>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flex: 1,
  },
});

export default RecordDetect;
