import React from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Colors } from '../constants/colors';
import { FONTS } from '../constants/fonts';
import { Photo } from '../utils/storage';

interface Props {
  photos: Photo[];
  onRemove: (photo: Photo) => void;
}

export default function PhotoStrip({ photos, onRemove }: Props) {
  if (photos.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyEmoji}>📸</Text>
        <Text style={styles.emptyText}>还没有添加照片</Text>
        <Text style={styles.emptyHint}>点击下方按钮拍照或从相册选择</Text>
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.strip}
    >
      {photos.map((photo) => (
        <View key={photo.id} style={styles.photoWrapper}>
          <Image source={{ uri: photo.uri }} style={styles.photo} />
          <TouchableOpacity
            style={styles.removeBtn}
            onPress={() => onRemove(photo)}
            activeOpacity={0.7}
          >
            <Text style={styles.removeBtnText}>✕</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  strip: {
    paddingHorizontal: 4,
    gap: 10,
    flexDirection: 'row',
  },
  photoWrapper: {
    position: 'relative',
  },
  photo: {
    width: 90,
    height: 90,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.shadow,
  },
  removeBtn: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.delete,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  removeBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontFamily: FONTS.bodyBold,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  emptyText: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 15,
    color: Colors.textLight,
  },
  emptyHint: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: Colors.textLight,
    marginTop: 4,
  },
});
