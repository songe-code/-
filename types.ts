export enum ElementCategory {
  BASIC = '基础概念',
  MECHANISM = '交易机制',
  RISK = '风险管理',
  STRATEGY = '交易策略',
  ASSET = '实物与合约'
}

export interface FuturesElement {
  atomicNumber: number;
  symbol: string;
  name: string;
  category: ElementCategory;
  shortDesc: string;
}

export interface ExplanationResponse {
  definition: string;
  analogy: string;
  keyPoint: string;
  example: string;
}

export interface AudioState {
  isPlaying: boolean;
  isLoading: boolean;
  hasAudio: boolean;
}