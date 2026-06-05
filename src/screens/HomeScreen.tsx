import React, { useCallback, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, SafeAreaView, Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import DurationBanner from '../components/DurationBanner';
import CheckupCard from '../components/CheckupCard';
import { Colors, MacaronColors } from '../constants/colors';
import { FONTS } from '../constants/fonts';
import { useSettings } from '../hooks/useSettings';
import { useCheckups } from '../hooks/useCheckups';
import { Checkup } from '../utils/storage';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const { settings, reload: reloadSettings } = useSettings();
  const { checkups, remove, reload: reloadCheckups } = useCheckups();

  useEffect(() => {
    const unsub = navigation.addListener('focus', () => {
      reloadSettings(); reloadCheckups();
    });
    reloadSettings(); reloadCheckups();
    return unsub;
  }, [navigation, reloadSettings, reloadCheckups]);

  const handleCardPress = useCallback((c: Checkup) => {
    navigation.navigate('CheckupDetail', { checkupId: c.id });
  }, [navigation]);

  const handleCardLongPress = useCallback((c: Checkup) => {
    const doDelete = Platform.OS === 'web'
      ? window.confirm(`确定删除 ${new Date(c.date).toLocaleDateString('zh-CN')} 的复查记录？`)
      : true;

    if (doDelete === false) return;

    if (Platform.OS !== 'web') {
      Alert.alert('删除复查记录', `确定删除 ${new Date(c.date).toLocaleDateString('zh-CN')} 的复查记录？`, [
        { text: '取消', style: 'cancel' },
        { text: '删除', style: 'destructive', onPress: () => remove(c.id) },
      ]);
    } else {
      remove(c.id);
    }
  }, [remove]);

  const handleSetStartDate = useCallback(() => {
    navigation.navigate('SetStartDate');
  }, [navigation]);

  const handleAdd = useCallback(() => {
    if (!settings?.startDate) {
      navigation.navigate('SetStartDate');
      return;
    }
    navigation.navigate('AddCheckup');
  }, [navigation, settings]);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={checkups}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.col}
        ListHeaderComponent={<DurationBanner settings={settings} onSetStartDate={handleSetStartDate} />}
        ListHeaderComponentStyle={styles.header}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyEmoji}>📋</Text>
            <Text style={styles.emptyTitle}>还没有复查记录</Text>
            <Text style={styles.emptyDesc}>点击右下角 + 记录第一次复查吧</Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <CheckupCard checkup={item} index={index} onPress={handleCardPress} onLongPress={handleCardLongPress} />
        )}
        showsVerticalScrollIndicator={false}
      />
      <TouchableOpacity style={styles.fab} onPress={handleAdd} activeOpacity={0.8}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { marginBottom: 20 },
  list: { paddingBottom: 100, paddingHorizontal: 16 },
  col: { gap: 16, marginBottom: 16 },
  emptyWrap: { alignItems: 'center', paddingTop: 60 },
  emptyEmoji: { fontSize: 56, marginBottom: 12 },
  emptyTitle: { fontFamily: FONTS.title, fontSize: 20, color: Colors.text, marginBottom: 8 },
  emptyDesc: { fontFamily: FONTS.body, fontSize: 15, color: Colors.textLight, textAlign: 'center', lineHeight: 24 },
  fab: {
    position: 'absolute', bottom: 32, right: 24,
    width: 60, height: 60, borderRadius: 30, backgroundColor: MacaronColors.pink,
    justifyContent: 'center', alignItems: 'center', elevation: 8,
  },
  fabText: { fontFamily: FONTS.title, fontSize: 32, color: '#FFF', lineHeight: 36, marginTop: -2 },
});
