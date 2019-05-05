import React from 'react';
import {Image, View} from 'react-native';

export default (props) => {
  return (
      <View style={{width: props.page_width}}>
        <Image style={{
          margin: 16,
          alignSelf: 'center',
          width: props.width,
          height: props.height,
        }} source={props.source}/>
      </View>
  );
}
