// 马卡龙色系 Macaron Color Palette
export const MacaronColors = {
  pink: '#FFB5C2',
  mint: '#B5EAD7',
  lavender: '#C7CEEA',
  peach: '#FFDAC1',
  lemon: '#FFFACD',
  skyBlue: '#B5D8EB',
  rose: '#FFD1DC',
  lilac: '#E2D9FF',
  coral: '#FFC8A2',
  cream: '#FFF0D4',
};

// 卡片循环配色（用于复查卡片背景）
export const CardColors = [
  MacaronColors.pink,
  MacaronColors.mint,
  MacaronColors.lavender,
  MacaronColors.peach,
  MacaronColors.skyBlue,
  MacaronColors.rose,
  MacaronColors.lilac,
  MacaronColors.coral,
  MacaronColors.lemon,
  MacaronColors.cream,
];

// 功能性颜色
export const Colors = {
  background: '#FFF5F5',
  surface: '#FFFFFF',
  text: '#5D576B',
  textLight: '#9B95A9',
  textWhite: '#FFFFFF',
  accent: '#FF8FA3',
  shadow: '#E8D5D5',
  delete: '#FF8A80',
  overlay: 'rgba(93, 87, 107, 0.4)',
};

// 根据索引获取卡片颜色
export function getCardColor(index: number): string {
  return CardColors[index % CardColors.length];
}
