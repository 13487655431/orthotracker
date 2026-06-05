import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  TextInput,
} from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { Colors, MacaronColors } from '../constants/colors';
import { FONTS } from '../constants/fonts';

// ============ Web 端：直接可见的 HTML input ============

function WebDateField({
  value,
  onChange,
  color,
}: {
  value: Date;
  onChange: (d: Date) => void;
  color: string;
}) {
  const dateStr = value.toISOString().split('T')[0];
  const displayStr = `${value.getFullYear()}年${value.getMonth() + 1}月${value.getDate()}日`;

  return (
    <View style={[pickerStyles.box, { backgroundColor: color }]}>
      <Text style={pickerStyles.label}>📅 日期</Text>
      {/* 使用原生 HTML input，display: flex 让它在 RN Web 中正常渲染 */}
      <input
        type="date"
        value={dateStr}
        max={new Date().toISOString().split('T')[0]}
        onChange={(e: any) => {
          const [y, m, d] = e.target.value.split('-').map(Number);
          const nd = new Date(value);
          nd.setFullYear(y);
          nd.setMonth(m - 1);
          nd.setDate(d);
          onChange(nd);
        }}
        style={{
          fontFamily: 'Nunito, sans-serif',
          fontSize: 18,
          fontWeight: '700',
          color: Colors.text,
          border: 'none',
          background: 'transparent',
          width: '100%',
          textAlign: 'center',
          cursor: 'pointer',
          padding: 0,
          marginTop: 6,
        }}
      />
      <Text style={pickerStyles.displayText}>{displayStr}</Text>
    </View>
  );
}

function WebTimeField({
  value,
  onChange,
  color,
}: {
  value: Date;
  onChange: (d: Date) => void;
  color: string;
}) {
  const timeStr = `${String(value.getHours()).padStart(2, '0')}:${String(value.getMinutes()).padStart(2, '0')}`;

  return (
    <View style={[pickerStyles.box, { backgroundColor: color }]}>
      <Text style={pickerStyles.label}>⏰ 时间</Text>
      <input
        type="time"
        value={timeStr}
        onChange={(e: any) => {
          const [h, m] = e.target.value.split(':').map(Number);
          const nd = new Date(value);
          nd.setHours(h);
          nd.setMinutes(m);
          onChange(nd);
        }}
        style={{
          fontFamily: 'Nunito, sans-serif',
          fontSize: 18,
          fontWeight: '700',
          color: Colors.text,
          border: 'none',
          background: 'transparent',
          width: '100%',
          textAlign: 'center',
          cursor: 'pointer',
          padding: 0,
          marginTop: 6,
        }}
      />
      <Text style={pickerStyles.displayText}>{timeStr}</Text>
    </View>
  );
}

// ============ 原生端 ============

function NativeDateField({
  value,
  onChange,
  color,
  mode,
}: {
  value: Date;
  onChange: (d: Date) => void;
  color: string;
  mode: 'date' | 'time';
}) {
  const [show, setShow] = useState(false);
  const label = mode === 'date' ? '📅 日期' : '⏰ 时间';
  const displayStr =
    mode === 'date'
      ? `${value.getFullYear()}年${value.getMonth() + 1}月${value.getDate()}日`
      : `${String(value.getHours()).padStart(2, '0')}:${String(value.getMinutes()).padStart(2, '0')}`;

  return (
    <>
      <TouchableOpacity
        style={[pickerStyles.box, { backgroundColor: color }]}
        onPress={() => setShow(true)}
        activeOpacity={0.7}
      >
        <Text style={pickerStyles.label}>{label}</Text>
        <Text style={pickerStyles.displayText}>{displayStr}</Text>
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          value={value}
          mode={mode}
          display="spinner"
          onChange={(_e: DateTimePickerEvent, d?: Date) => {
            setShow(Platform.OS === 'ios');
            if (d) onChange(d);
          }}
          maximumDate={mode === 'date' ? new Date() : undefined}
        />
      )}
    </>
  );
}

// ============ 统一导出 ============

interface FieldProps {
  date: Date;
  onDateChange: (d: Date) => void;
}

export function DateField({ date, onDateChange }: FieldProps) {
  if (Platform.OS === 'web') {
    return <WebDateField value={date} onChange={onDateChange} color={MacaronColors.lavender} />;
  }
  return <NativeDateField value={date} onChange={onDateChange} color={MacaronColors.lavender} mode="date" />;
}

export function TimeField({ date, onDateChange }: FieldProps) {
  if (Platform.OS === 'web') {
    return <WebTimeField value={date} onChange={onDateChange} color={MacaronColors.mint} />;
  }
  return <NativeDateField value={date} onChange={onDateChange} color={MacaronColors.mint} mode="time" />;
}

// 设置页面用的大日期选择器
export function SingleDatePicker({
  date,
  onDateChange,
  label,
  color,
}: {
  date: Date;
  onDateChange: (d: Date) => void;
  label: string;
  color: string;
}) {
  if (Platform.OS === 'web') {
    const dateStr = date.toISOString().split('T')[0];
    const displayStr = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;

    return (
      <View style={[pickerStyles.box, { backgroundColor: color }]}>
        <Text style={pickerStyles.label}>{label}</Text>
        <input
          type="date"
          value={dateStr}
          max={new Date().toISOString().split('T')[0]}
          min="2020-01-01"
          onChange={(e: any) => {
            const [y, m, d] = e.target.value.split('-').map(Number);
            const nd = new Date(date);
            nd.setFullYear(y);
            nd.setMonth(m - 1);
            nd.setDate(d);
            onDateChange(nd);
          }}
          style={{
            fontFamily: 'Nunito, sans-serif',
            fontSize: 24,
            fontWeight: '700',
            color: Colors.text,
            border: 'none',
            background: 'transparent',
            width: '100%',
            textAlign: 'center',
            cursor: 'pointer',
            padding: 0,
            marginTop: 8,
          }}
        />
        <Text style={[pickerStyles.displayText, { fontSize: 13, marginTop: 4 }]}>点击上方修改</Text>
      </View>
    );
  }

  // Native
  const [show, setShow] = useState(false);
  const displayStr = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;

  return (
    <>
      <TouchableOpacity
        style={[pickerStyles.box, { backgroundColor: color }]}
        onPress={() => setShow(true)}
        activeOpacity={0.7}
      >
        <Text style={pickerStyles.label}>{label}</Text>
        <Text style={[pickerStyles.displayText, { fontSize: 24 }]}>{displayStr}</Text>
        <Text style={{ fontFamily: FONTS.body, fontSize: 12, color: Colors.textLight, marginTop: 4 }}>
          点击修改
        </Text>
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          value={date}
          mode="date"
          display="spinner"
          onChange={(_e: DateTimePickerEvent, d?: Date) => {
            setShow(Platform.OS === 'ios');
            if (d) onDateChange(d);
          }}
          maximumDate={new Date()}
          minimumDate={new Date('2020-01-01')}
        />
      )}
    </>
  );
}

const pickerStyles = StyleSheet.create({
  box: {
    flex: 1,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  label: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: Colors.textLight,
    marginBottom: 2,
  },
  displayText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 18,
    color: Colors.text,
    marginTop: 2,
  },
});
