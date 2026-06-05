import React, { useState, useCallback, useMemo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Alert, SafeAreaView,
  ScrollView, TextInput, Platform,
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { RootStackParamList } from '../navigation/AppNavigator';
import PhotoThumbnail, { THUMB_SIZE, NUM_COLUMNS, GAP } from '../components/PhotoThumbnail';
import ImageViewer from '../components/ImageViewer';
import { Colors, MacaronColors, getCardColor } from '../constants/colors';
import { FONTS } from '../constants/fonts';
import { useCheckups } from '../hooks/useCheckups';
import { Checkup, Photo } from '../utils/storage';

type Nav = NativeStackNavigationProp<RootStackParamList, 'CheckupDetail'>;
type Route = RouteProp<RootStackParamList, 'CheckupDetail'>;

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

export default function CheckupDetailScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { checkupId } = route.params;
  const { checkups, addPhoto, removePhoto, remove, update, reload } = useCheckups();

  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerUri, setViewerUri] = useState<string | null>(null);
  const [viewerPhotoId, setViewerPhotoId] = useState<string | null>(null);
  const [addingPhoto, setAddingPhoto] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesText, setNotesText] = useState('');

  useFocusEffect(useCallback(() => { reload(); }, []));

  const checkup = useMemo(() => checkups.find((c) => c.id === checkupId), [checkups, checkupId]);
  const date = useMemo(() => (checkup ? new Date(checkup.date) : new Date()), [checkup]);
  const cardColor = useMemo(() => {
    const idx = checkups.findIndex((c) => c.id === checkupId);
    return getCardColor(idx >= 0 ? idx : 0);
  }, [checkups, checkupId]);

  // ====== 查看大图 ======
  const handlePhotoPress = useCallback((photo: Photo) => {
    setViewerUri(photo.uri); setViewerPhotoId(photo.id); setViewerVisible(true);
  }, []);

  const closeViewer = useCallback(() => {
    setViewerVisible(false); setViewerUri(null); setViewerPhotoId(null);
  }, []);

  const handleDeletePhoto = useCallback(() => {
    if (!viewerPhotoId || !viewerUri) return;
    const doDelete = Platform.OS === 'web' ? window.confirm('确定删除这张照片？') : true;
    if (!doDelete) return;
    if (Platform.OS !== 'web') {
      Alert.alert('删除照片', '确定删除？', [
        { text: '取消', style: 'cancel' },
        { text: '删除', style: 'destructive', onPress: () => {
          removePhoto(checkupId, viewerPhotoId, viewerUri); closeViewer();
        }},
      ]);
    } else {
      removePhoto(checkupId, viewerPhotoId, viewerUri); closeViewer();
    }
  }, [viewerPhotoId, viewerUri, checkupId, removePhoto, closeViewer]);

  // ====== 长按删除缩略图 ======
  const handlePhotoLongPress = useCallback((photo: Photo) => {
    const doDelete = Platform.OS === 'web' ? window.confirm('确定删除这张照片？') : true;
    if (doDelete === false) return;
    if (Platform.OS !== 'web') {
      Alert.alert('删除照片', '确定删除？', [
        { text: '取消', style: 'cancel' },
        { text: '删除', style: 'destructive', onPress: () => removePhoto(checkupId, photo.id, photo.uri) },
      ]);
    } else {
      removePhoto(checkupId, photo.id, photo.uri);
    }
  }, [checkupId, removePhoto]);

  // ====== 追加照片 ======
  const handleAddPhoto = useCallback(async () => {
    if (addingPhoto) return;
    setAddingPhoto(true);
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') { Alert.alert('需要权限'); setAddingPhoto(false); return; }
      const result = await ImagePicker.launchCameraAsync({ quality: 0.6, allowsEditing: false });
      if (!result.canceled && result.assets[0]) {
        await addPhoto(checkupId, result.assets[0].uri);
      }
    } catch { Alert.alert('添加失败'); }
    finally { setAddingPhoto(false); }
  }, [checkupId, addPhoto, addingPhoto]);

  const handleAddGallery = useCallback(async () => {
    if (addingPhoto) return;
    setAddingPhoto(true);
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') { Alert.alert('需要权限'); setAddingPhoto(false); return; }
      const result = await ImagePicker.launchImageLibraryAsync({
        quality: 0.6, allowsMultipleSelection: true, selectionLimit: 20,
      });
      if (!result.canceled && result.assets.length > 0) {
        for (const a of result.assets) await addPhoto(checkupId, a.uri);
      }
    } catch { Alert.alert('添加失败'); }
    finally { setAddingPhoto(false); }
  }, [checkupId, addPhoto, addingPhoto]);

  // ====== 删除复查记录 ======
  const handleDeleteCheckup = useCallback(() => {
    const doDelete = Platform.OS === 'web' ? window.confirm('确定删除整条复查记录及所有照片？此操作无法撤销。') : true;
    if (doDelete === false) return;
    if (Platform.OS !== 'web') {
      Alert.alert('删除复查记录', '确定删除整条复查记录及所有照片？此操作无法撤销。', [
        { text: '取消', style: 'cancel' },
        { text: '删除', style: 'destructive', onPress: async () => { await remove(checkupId); navigation.goBack(); } },
      ]);
    } else {
      remove(checkupId).then(() => navigation.goBack());
    }
  }, [navigation, remove, checkupId]);

  // ====== 编辑备注 ======
  const handleStartEditNotes = useCallback(() => {
    setNotesText(checkup?.notes || '');
    setEditingNotes(true);
  }, [checkup]);

  const handleSaveNotes = useCallback(async () => {
    if (!checkup) return;
    const updated = { ...checkup, notes: notesText.trim() };
    await update(updated);
    setEditingNotes(false);
  }, [checkup, notesText, update]);

  if (!checkup) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadWrap}><Text style={styles.loadText}>加载中...</Text></View>
      </SafeAreaView>
    );
  }

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const weekday = WEEKDAYS[date.getDay()];
  const time = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Text style={styles.navBack}>← 返回</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle}>复查详情</Text>
        <TouchableOpacity onPress={handleDeleteCheckup} activeOpacity={0.7}>
          <Text style={styles.navDelete}>🗑️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollInner} showsVerticalScrollIndicator={false}>
        {/* 日期头 */}
        <View style={[styles.dateHeader, { backgroundColor: cardColor }]}>
          <Text style={styles.bigDay}>{day}</Text>
          <View style={styles.dateInfo}>
            <Text style={styles.dateLine1}>{year}年{month}月</Text>
            <Text style={styles.dateLine2}>周{weekday} · {time}</Text>
          </View>
          <Text style={styles.photoCount}>📷 {checkup.photos.length}</Text>
        </View>

        {/* 备注 */}
        <View style={styles.notesSection}>
          <View style={styles.notesHeader}>
            <Text style={styles.sectionTitle}>📝 备注</Text>
            {!editingNotes && (
              <TouchableOpacity onPress={handleStartEditNotes} activeOpacity={0.7}>
                <Text style={styles.editNotesBtn}>{checkup.notes ? '编辑' : '+ 添加备注'}</Text>
              </TouchableOpacity>
            )}
          </View>
          {editingNotes ? (
            <View>
              <TextInput
                style={styles.notesInput}
                value={notesText}
                onChangeText={setNotesText}
                placeholder="比如：换了皮筋、医生叮嘱..."
                placeholderTextColor={Colors.textLight}
                multiline
                textAlignVertical="top"
                autoFocus
              />
              <View style={styles.notesActions}>
                <TouchableOpacity style={styles.notesCancel} onPress={() => setEditingNotes(false)} activeOpacity={0.7}>
                  <Text style={styles.notesCancelText}>取消</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.notesSave} onPress={handleSaveNotes} activeOpacity={0.7}>
                  <Text style={styles.notesSaveText}>保存备注</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <Text style={styles.notesContent}>
              {checkup.notes || '暂无备注'}
            </Text>
          )}
        </View>

        {/* 照片网格 */}
        <Text style={styles.sectionTitle}>📸 照片 ({checkup.photos.length})</Text>
        {checkup.photos.length > 0 ? (
          <View style={styles.photoGrid}>
            {checkup.photos.map((photo) => (
              <PhotoThumbnail
                key={photo.id}
                uri={photo.uri}
                onPress={() => handlePhotoPress(photo)}
                onLongPress={() => handlePhotoLongPress(photo)}
              />
            ))}
          </View>
        ) : (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>📸</Text>
            <Text style={styles.emptyText}>还没有照片</Text>
          </View>
        )}

        {/* 追加按钮 */}
        <View style={styles.addRow}>
          <TouchableOpacity style={[styles.addBtn, { backgroundColor: MacaronColors.rose }]} onPress={handleAddPhoto} disabled={addingPhoto} activeOpacity={0.7}>
            <Text style={styles.addBtnText}>📷 拍照追加</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.addBtn, { backgroundColor: MacaronColors.skyBlue }]} onPress={handleAddGallery} disabled={addingPhoto} activeOpacity={0.7}>
            <Text style={styles.addBtnText}>🖼️ 相册追加</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ImageViewer visible={viewerVisible} uri={viewerUri} onClose={closeViewer} onDelete={handleDeletePhoto} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  loadWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadText: { fontFamily: FONTS.body, fontSize: 16, color: Colors.textLight },
  navBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14, backgroundColor: Colors.surface,
    borderBottomWidth: 1, borderBottomColor: Colors.shadow,
  },
  navBack: { fontFamily: FONTS.bodySemiBold, fontSize: 15, color: MacaronColors.pink },
  navTitle: { fontFamily: FONTS.title, fontSize: 18, color: Colors.text },
  navDelete: { fontSize: 20 },
  scroll: { flex: 1 },
  scrollInner: { paddingBottom: 40 },
  dateHeader: {
    margin: 16, borderRadius: 24, padding: 24,
    flexDirection: 'row', alignItems: 'center', gap: 16,
  },
  bigDay: { fontFamily: FONTS.title, fontSize: 56, color: '#FFF', lineHeight: 60 },
  dateInfo: { flex: 1 },
  dateLine1: { fontFamily: FONTS.bodyBold, fontSize: 18, color: '#FFF' },
  dateLine2: { fontFamily: FONTS.body, fontSize: 15, color: 'rgba(255,255,255,0.85)', marginTop: 4 },
  photoCount: { fontFamily: FONTS.bodySemiBold, fontSize: 14, color: 'rgba(255,255,255,0.9)' },
  // 备注
  notesSection: { paddingHorizontal: 16, marginBottom: 20 },
  notesHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  sectionTitle: { fontFamily: FONTS.title, fontSize: 17, color: Colors.text },
  editNotesBtn: { fontFamily: FONTS.bodySemiBold, fontSize: 14, color: MacaronColors.pink },
  notesContent: { fontFamily: FONTS.body, fontSize: 15, color: Colors.text, lineHeight: 22, backgroundColor: Colors.surface, borderRadius: 12, padding: 14 },
  notesInput: { backgroundColor: Colors.surface, borderRadius: 12, padding: 14, fontFamily: FONTS.body, fontSize: 15, color: Colors.text, minHeight: 80 },
  notesActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 10 },
  notesCancel: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, backgroundColor: Colors.shadow },
  notesCancelText: { fontFamily: FONTS.bodySemiBold, fontSize: 14, color: Colors.text },
  notesSave: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, backgroundColor: MacaronColors.mint },
  notesSaveText: { fontFamily: FONTS.bodySemiBold, fontSize: 14, color: Colors.text },
  // 照片
  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: GAP },
  empty: { alignItems: 'center', paddingVertical: 30 },
  emptyEmoji: { fontSize: 40 }, emptyText: { fontFamily: FONTS.body, fontSize: 15, color: Colors.textLight, marginTop: 8 },
  addRow: { flexDirection: 'row', gap: 12, paddingHorizontal: 16, marginTop: 20 },
  addBtn: { flex: 1, borderRadius: 18, paddingVertical: 16, alignItems: 'center' },
  addBtnText: { fontFamily: FONTS.bodySemiBold, fontSize: 15, color: Colors.text },
});
