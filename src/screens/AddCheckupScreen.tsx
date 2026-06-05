import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { v4 as uuidv4 } from 'uuid';
import { RootStackParamList } from '../navigation/AppNavigator';
import PhotoStrip from '../components/PhotoStrip';
import { DateField, TimeField } from '../components/DatePicker';
import { Colors, MacaronColors } from '../constants/colors';
import { FONTS } from '../constants/fonts';
import { useCheckups } from '../hooks/useCheckups';
import { copyPhotoToCheckup } from '../utils/photoManager';
import { Photo } from '../utils/storage';

type Nav = NativeStackNavigationProp<RootStackParamList, 'AddCheckup'>;

export default function AddCheckupScreen() {
  const navigation = useNavigation<Nav>();
  const { add } = useCheckups();

  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [saving, setSaving] = useState(false);

  const handleTakePhoto = useCallback(async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('需要权限', '请在设置中允许相机权限');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({ quality: 0.6, allowsEditing: false });
      if (!result.canceled && result.assets[0]) {
        setPhotos((prev) => [...prev, {
          id: uuidv4(), uri: result.assets[0].uri, timestamp: new Date().toISOString(),
        }]);
      }
    } catch (e) {
      console.error('Camera:', e);
      Alert.alert('拍照失败', '请重试');
    }
  }, []);

  const handlePickGallery = useCallback(async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('需要权限', '请在设置中允许相册权限');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        quality: 0.6, allowsMultipleSelection: true, selectionLimit: 20,
      });
      if (!result.canceled && result.assets.length > 0) {
        setPhotos((prev) => [...prev, ...result.assets.map((a) => ({
          id: uuidv4(), uri: a.uri, timestamp: new Date().toISOString(),
        }))]);
      }
    } catch (e) {
      console.error('Gallery:', e);
      Alert.alert('选取失败', '请重试');
    }
  }, []);

  const handleRemovePhoto = useCallback((p: Photo) => {
    setPhotos((prev) => prev.filter((x) => x.id !== p.id));
  }, []);

  const handleSave = useCallback(async () => {
    if (saving) return;
    setSaving(true);
    try {
      const checkupId = uuidv4();
      const savedPhotos: Photo[] = [];
      for (const p of photos) {
        savedPhotos.push(await copyPhotoToCheckup(p.uri, checkupId));
      }
      await add({
        id: checkupId,
        date: date.toISOString(),
        notes: notes.trim(),
        photos: savedPhotos,
      });
      navigation.goBack();
    } catch (e) {
      console.error('Save:', e);
      Alert.alert('保存失败', '请重试');
    } finally {
      setSaving(false);
    }
  }, [saving, photos, date, notes, add, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Text style={styles.navBack}>← 返回</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle}>新增复查</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollInner} showsVerticalScrollIndicator={false}>
        {/* 日期时间 */}
        <Text style={styles.sectionTitle}>📅 复查日期 & 时间</Text>
        <View style={styles.dateRow}>
          <DateField date={date} onDateChange={setDate} />
          <TimeField date={date} onDateChange={setDate} />
        </View>

        {/* 备注 */}
        <Text style={styles.sectionTitle}>📝 备注</Text>
        <TextInput
          style={styles.notesInput}
          value={notes}
          onChangeText={setNotes}
          placeholder="比如：换了皮筋、医生叮嘱..."
          placeholderTextColor={Colors.textLight}
          multiline
          textAlignVertical="top"
        />

        {/* 照片 */}
        <Text style={styles.sectionTitle}>📸 复查照片</Text>
        <PhotoStrip photos={photos} onRemove={handleRemovePhoto} />
        <View style={styles.photoRow}>
          <TouchableOpacity style={[styles.photoBtn, { backgroundColor: MacaronColors.rose }]} onPress={handleTakePhoto} activeOpacity={0.7}>
            <Text style={styles.photoBtnText}>📷 拍照</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.photoBtn, { backgroundColor: MacaronColors.skyBlue }]} onPress={handlePickGallery} activeOpacity={0.7}>
            <Text style={styles.photoBtnText}>🖼️ 相册</Text>
          </TouchableOpacity>
        </View>

        {/* 保存 */}
        <TouchableOpacity style={[styles.saveBtn, { opacity: saving ? 0.6 : 1 }]} onPress={handleSave} disabled={saving} activeOpacity={0.7}>
          {saving ? <ActivityIndicator color="#FFF" /> : <Text style={styles.saveBtnText}>💾 保存 ({photos.length} 张照片)</Text>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  navBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14, backgroundColor: Colors.surface,
    borderBottomWidth: 1, borderBottomColor: Colors.shadow,
  },
  navBack: { fontFamily: FONTS.bodySemiBold, fontSize: 15, color: MacaronColors.pink },
  navTitle: { fontFamily: FONTS.title, fontSize: 18, color: Colors.text },
  scroll: { flex: 1 },
  scrollInner: { padding: 20, paddingBottom: 40 },
  sectionTitle: { fontFamily: FONTS.title, fontSize: 17, color: Colors.text, marginBottom: 12, marginTop: 4 },
  dateRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  notesInput: {
    backgroundColor: Colors.surface, borderRadius: 16, padding: 16,
    fontFamily: FONTS.body, fontSize: 15, color: Colors.text,
    minHeight: 80, marginBottom: 24,
  },
  photoRow: { flexDirection: 'row', gap: 12, marginTop: 16, marginBottom: 28 },
  photoBtn: { flex: 1, borderRadius: 18, paddingVertical: 16, alignItems: 'center' },
  photoBtnText: { fontFamily: FONTS.bodySemiBold, fontSize: 16, color: Colors.text },
  saveBtn: {
    backgroundColor: MacaronColors.pink, borderRadius: 20, paddingVertical: 18,
    alignItems: 'center', elevation: 4,
  },
  saveBtnText: { fontFamily: FONTS.bodyBold, fontSize: 17, color: '#FFF' },
});
