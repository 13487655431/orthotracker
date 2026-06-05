import React from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Colors } from '../constants/colors';

const { width } = Dimensions.get('window');
const GAP = 4;
const NUM_COLUMNS = 3;
const THUMB_SIZE = (width - 48 - GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS;

interface Props {
  uri: string;
  onPress: () => void;
  onLongPress?: () => void;
}

export default function PhotoThumbnail({ uri, onPress, onLongPress }: Props) {
  return (
    <TouchableOpacity
      style={styles.thumbnail}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      <Image source={{ uri }} style={styles.image} resizeMode="cover" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  thumbnail: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.shadow,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export { THUMB_SIZE, NUM_COLUMNS, GAP };
