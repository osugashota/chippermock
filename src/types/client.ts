// クライアント管理システムの型定義
export interface Organization {
  id: string;
  name: string;
  type: 'client';
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'inactive' | 'suspended';
  
  // 直接クライアントの場合の設定
  clientSettings?: {
    subscriptionType: 'free' | 'basic' | 'premium' | 'enterprise';
    limits: {
      sites: number;
      points: number;
      users: number;
    };
    usage: {
      sites: number;
      points: number;
      users: number;
    };
  };
}

export interface Company {
  id: string;
  name: string;
  organizationId: string; // 組織ID
  type: 'company'; // 会社タイプ
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'inactive' | 'suspended';
  
  // 会社/プロジェクトレベルの設定
  settings: {
    subscriptionType: 'free' | 'basic' | 'premium' | 'enterprise';
    limits: {
      sites: number;
      points: number;
      users: number;
      heatmaps?: number; // ヒートマップ利用可能数
    };
    usage: {
      sites: number;
      points: number;
      users: number;
      heatmaps?: number; // ヒートマップ使用数
    };
  };
  
  // 代理ログイン設定
  proxyLoginEnabled: boolean;
  proxyLoginSessions: ProxyLoginSession[];
}

export interface Site {
  id: string;
  name: string;
  url: string;
  companyId: string; // 会社/プロジェクトID
  organizationId: string; // 組織ID
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'inactive';
  
  // サイト固有の設定
  settings: {
    pointsAllocated: number; // このサイトに割り当てられたポイント
    pointsUsed: number;
    domains: string[];
  };
}

export interface ClientUser {
  id: string;
  firstName: string;
  lastName: string;
  nickName: string;
  email: string;
  organizationId: string; // 組織ID
  companyId: string; // 会社/プロジェクトID
  role: 'chipper' | 'company-admin' | 'company-user';
  lastLogin?: string;
  lastLoginDate?: string; // 最終ログイン日時
  monthlyLogins: number;
  monthlyArticles: number;
  creditBalance: number;
  status: 'active' | 'trial' | 'expired' | 'suspended';
  createdAt: string;
  createdDate?: string; // 作成日
  updatedAt: string;
  lastUpdatedDate?: string; // 最終更新日
  
  // 計算プロパティ
  name: string; // lastName + firstName
  organizationName: string;
  companyName: string;
}

export interface ProxyLoginSession {
  sessionId: string;
  targetUserId: string;
  adminUserId: string;
  expiresAt: string;
  createdAt: string;
}