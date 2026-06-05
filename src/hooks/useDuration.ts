import { useState, useEffect, useMemo } from 'react';
import { Settings } from '../utils/storage';

interface Duration {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalMonths: number;
  formatted: string; // e.g. "1年3个月15天"
}

function calcDuration(startDate: string): Duration {
  const start = new Date(startDate);
  const now = new Date();
  const diffMs = now.getTime() - start.getTime();

  // 总天数
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // 计算年月日
  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  let days = now.getDate() - start.getDate();

  if (days < 0) {
    months -= 1;
    // 获取上个月的天数
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  if (years < 0) {
    years = 0;
    months = 0;
    days = 0;
  }

  const parts: string[] = [];
  if (years > 0) parts.push(`${years}年`);
  if (months > 0) parts.push(`${months}个月`);
  parts.push(`${days}天`);

  return {
    years,
    months,
    days,
    totalDays,
    totalMonths: years * 12 + months,
    formatted: parts.join(''),
  };
}

export function useDuration(settings: Settings | null) {
  const [now, setNow] = useState(new Date());

  // 每分钟刷新一次
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const duration = useMemo(() => {
    if (!settings?.startDate) return null;
    return calcDuration(settings.startDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings?.startDate, now]);

  return duration;
}
