/* eslint-disable react-native/no-inline-styles */
import {Button, SafeAreaView, View} from 'react-native';
import React from 'react';
import Animated, {useSharedValue, withSpring} from 'react-native-reanimated';

export default function App() {
  const width = useSharedValue(100);

  const handlePress = () => {
    width.value = withSpring(width.value + 50);
  };
  const reset = () => {
    width.value = withSpring(100);
  };

  return (
    <SafeAreaView>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Animated.View
          style={{
            width,
            height: 100,
            backgroundColor: 'violet',
          }}
        />
        <View style={{justifyContent: 'space-around', height: 100}}>
          <Button onPress={handlePress} title="Click me" />
          <Button onPress={reset} title="Reset" />
        </View>
      </View>
    </SafeAreaView>
  );
}
