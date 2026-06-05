import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { SingleDatePicker } from '../components/DatePicker';
import { Colors, MacaronColors } from '../constants/colors';
import { FONTS } from '../constants/fonts';
import { useSettings } from '../hooks/useSettings';

type Nav = NativeStackNavigationProp<RootStackParamList, 'SetStartDate'>;

export default function SetStartDateScreen() {
  const navigation = useNavigation<Nav>();
  const { settings, updateSettings } = useSettings();

  const initialDate = settings?.startDate
    ? new Date(settings.startDate)
    : new Date();

  const [date, setDate] = useState(initialDate);
  const [saving, setSaving] = useState(false);

  const handleConfirm = useCallback(async () => {
    if (saving) return;
    setSaving(true);
    try {
      await updateSettings({
        startDate: date.toISOString(),
      });
      navigation.goBack();
    } catch (e) {
      console.error('Save settings error:', e);
      Alert.alert('保存失败', '请重试');
    } finally {
      setSaving(false);
    }
  }, [date, updateSettings, navigation, saving]);

  return (
    <SafeAreaView style={styles.container}>
      {/* 导航 */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Text style={styles.navBack}>← 返回</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle}>设置开始日期</Text>
        <View style={{ width: 50 }} />
      </View>

      <View style={styles.content}>
        {/* 插图区 */}
        <View style={styles.illustration}>
          <Text style={styles.emoji}>🦷✨</Text>
          <Text style={styles.title}>你的正畸之旅</Text>
          <Text style={styles.subtitle}>从哪一天开始的呢？</Text>
        </View>

        {/* 日期选择 */}
        <View style={styles.dateCardWrap}>
          <SingleDatePicker
            date={date}
            onDateChange={setDate}
            label="正畸开始日期"
            color={MacaronColors.lavender}
          />
        </View>

        {/* 提示 */}
        <View style={styles.tipCard}>
          <Text style={styles.tipEmoji}>💡</Text>
          <Text style={styles.tipText}>
            设置后，主界面会实时显示你已经正畸的时长。你随时可以回来修改。
          </Text>
        </View>

        {/* 确认按钮 */}
        <TouchableOpacity
          style={[styles.confirmBtn, { opacity: saving ? 0.6 : 1 }]}
          onPress={handleConfirm}
          disabled={saving}
          activeOpacity={0.7}
        >
          {saving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.confirmBtnText}>✅ 确认设置</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.shadow,
  },
  navBack: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 15,
    color: MacaronColors.pink,
  },
  navTitle: {
    fontFamily: FONTS.title,
    fontSize: 18,
    color: Colors.text,
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustration: {
    alignItems: 'center',
    marginBottom: 32,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 12,
  },
  title: {
    fontFamily: FONTS.title,
    fontSize: 26,
    color: Colors.text,
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: FONTS.body,
    fontSize: 16,
    color: Colors.textLight,
  },
  dateCardWrap: {
    width: '100%',
    marginBottom: 20,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 28,
    alignItems: 'flex-start',
    gap: 10,
    width: '100%',
  },
  tipEmoji: {
    fontSize: 20,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontFamily: FONTS.body,
    fontSize: 14,
    color: Colors.textLight,
    lineHeight: 22,
  },
  confirmBtn: {
    width: '100%',
    backgroundColor: MacaronColors.pink,
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#FF8FA3',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  confirmBtnText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 18,
    color: '#FFFFFF',
  },
});
