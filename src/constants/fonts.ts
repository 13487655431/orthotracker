// 字体 — 使用 Expo Google Fonts 包
// 童趣圆润风格：Baloo 2 (标题) + Nunito (正文)

export { useFonts } from 'expo-font';

import {
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
} from '@expo-google-fonts/nunito';

import { Baloo2_400Regular } from '@expo-google-fonts/baloo-2';

export const FONTS = {
  // 标题字体：Baloo 2 — 圆润童趣，用于大数字和标题
  title: 'Baloo2_400Regular',
  // 正文字体：Nunito — 现代圆润
  body: 'Nunito_400Regular',
  bodySemiBold: 'Nunito_600SemiBold',
  bodyBold: 'Nunito_700Bold',
};

export const FONT_MAP = {
  [FONTS.title]: Baloo2_400Regular,
  [FONTS.body]: Nunito_400Regular,
  [FONTS.bodySemiBold]: Nunito_600SemiBold,
  [FONTS.bodyBold]: Nunito_700Bold,
};
