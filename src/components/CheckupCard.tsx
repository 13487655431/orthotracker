import React, { useMemo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image, Dimensions,
} from 'react-native';
import { Colors, getCardColor } from '../constants/colors';
import { FONTS } from '../constants/fonts';
import { Checkup } from '../utils/storage';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;
const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

interface Props {
  checkup: Checkup;
  index: number;
  onPress: (c: Checkup) => void;
  onLongPress?: (c: Checkup) => void;
}

export default function CheckupCard({ checkup, index, onPress, onLongPress }: Props) {
  const date = useMemo(() => new Date(checkup.date), [checkup.date]);
  const cardColor = useMemo(() => getCardColor(index), [index]);

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const weekday = WEEKDAYS[date.getDay()];
  const time = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  const previewUri = checkup.photos.length > 0 ? checkup.photos[checkup.photos.length - 1].uri : null;
  const hasNotes = checkup.notes && checkup.notes.trim().length > 0;

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: cardColor }]}
      onPress={() => onPress(checkup)}
      onLongPress={() => onLongPress?.(checkup)}
      activeOpacity={0.75}
    >
      <View style={styles.cover}>
        {previewUri ? (
          <Image source={{ uri: previewUri }} style={styles.img} />
        ) : (
          <View style={[styles.imgPlaceholder, { backgroundColor: cardColor }]}>
            <Text style={styles.emoji}>🦷</Text>
          </View>
        )}
        <View style={styles.overlay}>
          <Text style={styles.bigDay}>{day}</Text>
          <View style={styles.meta}>
            <Text style={styles.metaText}>{month}月 · 周{weekday}</Text>
            <Text style={styles.metaText}>{time}</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.year}>{date.getFullYear()}年</Text>
        <View style={styles.badges}>
          {hasNotes && <Text style={styles.badge}>📝</Text>}
          {checkup.photos.length > 0 && (
            <View style={styles.photoBadge}>
              <Text style={styles.photoBadgeText}>📷 {checkup.photos.length}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH, borderRadius: 20, overflow: 'hidden',
    shadowColor: Colors.shadow, shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25, shadowRadius: 6, elevation: 4,
  },
  cover: { height: 140, position: 'relative' },
  img: { width: '100%', height: '100%', resizeMode: 'cover' },
  imgPlaceholder: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  emoji: { fontSize: 40 },
  overlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.35)', paddingHorizontal: 12, paddingVertical: 10,
  },
  bigDay: { fontFamily: FONTS.title, fontSize: 36, color: '#FFF', lineHeight: 40 },
  meta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 },
  metaText: { fontFamily: FONTS.bodySemiBold, fontSize: 13, color: 'rgba(255,255,255,0.9)' },
  footer: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 12, paddingVertical: 10,
  },
  year: { fontFamily: FONTS.bodySemiBold, fontSize: 13, color: Colors.text },
  badges: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  badge: { fontSize: 14 },
  photoBadge: {
    backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 10,
    paddingHorizontal: 8, paddingVertical: 2,
  },
  photoBadgeText: { fontFamily: FONTS.body, fontSize: 11, color: Colors.text },
});
