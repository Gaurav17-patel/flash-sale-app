import React, { useEffect, useRef } from 'react';
import { Animated, Text, Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

export default function Toast({ message, isVisible, onHide }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (isVisible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start(onHide);
        }, 2000);
      });
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [isVisible]);

  return (
    <Animated.View style={[styles.toastContainer, { opacity: fadeAnim }]}>
      <Text style={styles.toastMessage}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toastContainer: {
    bottom: 50,
    padding: 15,
    zIndex: 1000,
    borderRadius: 10,
    left: width * 0.05,
    right: width * 0.05,
    position: 'absolute',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  toastMessage: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
});
