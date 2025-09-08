// 設定関連の型定義
export interface Site {
  id: string;
  name: string;
  url: string;
  excludeUrls: string[];
  excludeCondition: 'contains' | 'equals' | 'startsWith' | 'endsWith';
  globalTag: string;
  gaPropertyId: string;
  googleAnalyticsConnected: boolean;
  googleSearchConsoleConnected: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SettingsData {
  sites: Site[];
}