import { FuturesElement, ElementCategory } from './types';

export const ELEMENTS: FuturesElement[] = [
  // Basic
  { atomicNumber: 1, symbol: 'Fu', name: '期货定义', category: ElementCategory.BASIC, shortDesc: '什么是期货？' },
  { atomicNumber: 2, symbol: 'Df', name: '期现区别', category: ElementCategory.BASIC, shortDesc: '期货 vs 股票' },
  { atomicNumber: 3, symbol: 'Ex', name: '交易所', category: ElementCategory.BASIC, shortDesc: '交易场所' },
  
  // Mechanism
  { atomicNumber: 4, symbol: 'Mg', name: '保证金', category: ElementCategory.MECHANISM, shortDesc: '以小博大' },
  { atomicNumber: 5, symbol: 'Lv', name: '杠杆', category: ElementCategory.MECHANISM, shortDesc: '资金放大' },
  { atomicNumber: 6, symbol: 'Bi', name: '双向交易', category: ElementCategory.MECHANISM, shortDesc: '做多与做空' },
  { atomicNumber: 7, symbol: 'T0', name: 'T+0', category: ElementCategory.MECHANISM, shortDesc: '日内回转' },
  { atomicNumber: 8, symbol: 'St', name: '结算', category: ElementCategory.MECHANISM, shortDesc: '每日无负债' },

  // Risk
  { atomicNumber: 9, symbol: 'Lq', name: '爆仓', category: ElementCategory.RISK, shortDesc: '保证金不足' },
  { atomicNumber: 10, symbol: 'Mc', name: '追加保证金', category: ElementCategory.RISK, shortDesc: 'Margin Call' },
  { atomicNumber: 11, symbol: 'Lm', name: '涨跌停板', category: ElementCategory.RISK, shortDesc: '价格限制' },

  // Asset
  { atomicNumber: 12, symbol: 'Wr', name: '仓单', category: ElementCategory.ASSET, shortDesc: '实物凭证' },
  { atomicNumber: 13, symbol: 'Dl', name: '交割', category: ElementCategory.ASSET, shortDesc: '合约履行' },
  { atomicNumber: 14, symbol: 'Mn', name: '主力合约', category: ElementCategory.ASSET, shortDesc: '活跃月份' },

  // Strategy
  { atomicNumber: 15, symbol: 'Lk', name: '锁仓', category: ElementCategory.STRATEGY, shortDesc: '锁定盈亏' },
  { atomicNumber: 16, symbol: 'Hg', name: '套期保值', category: ElementCategory.STRATEGY, shortDesc: '对冲风险' },
  { atomicNumber: 17, symbol: 'Ar', name: '套利', category: ElementCategory.STRATEGY, shortDesc: '价差获利' },
];

export const CATEGORY_COLORS: Record<ElementCategory, string> = {
  [ElementCategory.BASIC]: 'bg-blue-500/20 border-blue-500 text-blue-200 hover:bg-blue-500/40',
  [ElementCategory.MECHANISM]: 'bg-emerald-500/20 border-emerald-500 text-emerald-200 hover:bg-emerald-500/40',
  [ElementCategory.RISK]: 'bg-rose-500/20 border-rose-500 text-rose-200 hover:bg-rose-500/40',
  [ElementCategory.STRATEGY]: 'bg-purple-500/20 border-purple-500 text-purple-200 hover:bg-purple-500/40',
  [ElementCategory.ASSET]: 'bg-amber-500/20 border-amber-500 text-amber-200 hover:bg-amber-500/40',
};

export const CATEGORY_TEXT_COLORS: Record<ElementCategory, string> = {
  [ElementCategory.BASIC]: 'text-blue-400',
  [ElementCategory.MECHANISM]: 'text-emerald-400',
  [ElementCategory.RISK]: 'text-rose-400',
  [ElementCategory.STRATEGY]: 'text-purple-400',
  [ElementCategory.ASSET]: 'text-amber-400',
};