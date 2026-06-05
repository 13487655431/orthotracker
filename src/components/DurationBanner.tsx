import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, MacaronColors } from '../constants/colors';
import { FONTS } from '../constants/fonts';
import { useDuration } from '../hooks/useDuration';
import { Settings } from '../utils/storage';

const { width } = Dimensions.get('window');

interface Props {
  settings: Settings | null;
  onSetStartDate: () => void;
}

export default function DurationBanner({ settings, onSetStartDate }: Props) {
  const duration = useDuration(settings);

  if (!settings?.startDate) {
    return (
      <LinearGradient
        colors={[MacaronColors.pink, MacaronColors.lavender, MacaronColors.skyBlue]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.banner}
      >
        <Text style={styles.emoji}>🦷</Text>
        <Text style={styles.title}>开始你的正畸之旅</Text>
        <TouchableOpacity
          style={styles.setDateBtn}
          onPress={onSetStartDate}
          activeOpacity={0.7}
        >
          <Text style={styles.setDateBtnText}>✨ 设置开始日期</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[MacaronColors.pink, MacaronColors.lavender, MacaronColors.skyBlue]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.banner}
    >
      <Text style={styles.label}>已正畸</Text>
      <View style={styles.durationRow}>
        {duration && (
          <>
            {duration.years > 0 && (
              <View style={styles.durationBlock}>
                <Text style={styles.durationNumber}>{duration.years}</Text>
                <Text style={styles.durationUnit}>年</Text>
              </View>
            )}
            <View style={styles.durationBlock}>
              <Text style={styles.durationNumber}>
                {duration ? duration.months : 0}
              </Text>
              <Text style={styles.durationUnit}>个月</Text>
            </View>
            <View style={styles.durationBlock}>
              <Text style={styles.durationNumber}>
                {duration ? duration.days : 0}
              </Text>
              <Text style={styles.durationUnit}>天</Text>
            </View>
          </>
        )}
      </View>
      <TouchableOpacity
        style={styles.editBtn}
        onPress={onSetStartDate}
        activeOpacity={0.7}
      >
        <Text style={styles.editBtnText}>📅 修改开始日期</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  banner: {
    paddingTop: 24,
    paddingBottom: 28,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  title: {
    fontFamily: FONTS.title,
    fontSize: 22,
    color: Colors.textWhite,
    marginBottom: 16,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  label: {
    fontFamily: FONTS.body,
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 8,
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 6,
  },
  durationBlock: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    minWidth: 56,
  },
  durationNumber: {
    fontFamily: FONTS.title,
    fontSize: 32,
    color: Colors.textWhite,
    lineHeight: 38,
  },
  durationUnit: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  setDateBtn: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  setDateBtnText: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 16,
    color: Colors.textWhite,
  },
  editBtn: {
    marginTop: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 16,
  },
  editBtnText: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
  },
});
