import { useEffect, useRef } from 'react';
import { Pressable, Image, View, Animated } from 'react-native';

const TabIcon = ({ icon, isActive, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isActive ? 1.25 : 1,
      useNativeDriver: true,
      friction: 5,
    }).start();
  }, [isActive]);

  return (
    <Pressable onPress={onPress}>
      <View style={{ height: 40, justifyContent: 'center', alignItems: 'center' }}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <Image
            source={icon}
            style={{
              width: 28,
              height: 28,
              resizeMode: 'contain',
              opacity: isActive ? 1 : 0.5,
            }}
          />
        </Animated.View>
      </View>
    </Pressable>
  );
};

export default TabIcon;
