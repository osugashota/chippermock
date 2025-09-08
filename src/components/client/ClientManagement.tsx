import React, { useState, useMemo } from 'react';
import { Search, Users, Building2, Globe, Settings, Edit, Table, TrendingUp, Zap, Shield, Calendar, AlertCircle, CheckCircle, Download } from 'lucide-react';
import { CompanyEditModal } from './CompanyEditModal';
import { CompanySettingsModal } from './CompanySettingsModal';
import { ContractPeriodModal } from './ContractPeriodModal';
import { ContractPlanModal } from './ContractPlanModal';
import { FilterBar, FilterState } from './FilterBar';
import { SortBar, TableSortState } from './SortBar';
import { sortClients, sortCompanies, sortTableCompanies } from '../../utils/sortUtils';

// 型定義
interface Site {
  id: string;
  name: string;
  domain: string;
  points: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  credits: number;
  lastLoginDate?: string;
  createdDate?: string;
  lastUpdatedDate?: string;
}

interface Company {
  id: string;
  name: string;
  type: string;
  organizationId?: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  contractStatus?: 'active' | 'inactive' | 'suspended';
  contractStartDate?: string;
  contractEndDate?: string;
  analyticsEnabled?: boolean;
  heatmapEnabled?: boolean;
  proxyLoginEnabled: boolean;
  proxyLoginSessions: any[];
  settings: {
    subscriptionType: string;
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
    cumulativePoints?: number; // 累積使用ポイント
    totalPoints?: number; // 総ポイント（月間×契約月数）
  };
  sites: Site[];
  users: User[];
}

interface Client {
  id: string;
  type: string;
  name: string;
  companies: Company[];
}

// Mock data
const mockClients: Client[] = [
  {
    id: '1',
    type: 'direct',
    name: 'デジタルマーケティング会社様',
    companies: [
      {
        id: 'c1',
        name: 'プロジェクトA（食品メーカー様）',
        type: 'company',
        organizationId: '',
        createdAt: '2024-01-15T09:00:00Z',
        updatedAt: '2024-01-20T14:30:00Z',
        status: 'active',
        proxyLoginEnabled: true,
        proxyLoginSessions: [],
        contractStartDate: '2024-01-15',
        contractEndDate: '2025-01-14',
        contractStatus: 'active' as const,
        settings: {
          subscriptionType: 'basic',
          limits: {
            sites: 3,
            points: 1000,
            users: 3
          },
          usage: {
            sites: 3,
            points: 450,
            users: 2
          }
        },
        sites: [
          { id: 's1', name: 'サイトA-1', domain: 'site-a1.example.com', points: 200 },
          { id: 's2', name: 'サイトA-2', domain: 'site-a2.example.com', points: 150 },
          { id: 's3', name: 'サイトA-3', domain: 'site-a3.example.com', points: 100 }
        ],
        users: [
          { id: 'u1', name: '田中太郎', email: 'tanaka@example.com', role: 'company-admin', status: 'active', credits: 500, lastLoginDate: '2024-02-25T10:30:00Z', createdDate: '2024-01-15T09:00:00Z', lastUpdatedDate: '2024-02-20T14:30:00Z' },
          { id: 'u2', name: '佐藤花子', email: 'sato@example.com', role: 'company-user', status: 'active', credits: 300, lastLoginDate: '2024-02-24T15:45:00Z', createdDate: '2024-01-16T10:00:00Z', lastUpdatedDate: '2024-02-19T11:20:00Z' }
        ]
      },
      {
        id: 'c2',
        name: 'プロジェクトB（IT企業様）',
        type: 'company',
        organizationId: '',
        createdAt: '2024-01-10T10:00:00Z',
        updatedAt: '2024-01-22T16:45:00Z',
        status: 'active',
        proxyLoginEnabled: true,
        proxyLoginSessions: [],
        contractStartDate: '2024-01-10',
        contractEndDate: '2024-12-31',
        settings: {
          subscriptionType: 'premium',
          limits: {
            sites: 1,
            points: 1000,
            users: 3
          },
          usage: {
            sites: 1,
            points: 650,
            users: 2
          }
        },
        sites: [
          { id: 's4', name: 'サイトB-1', domain: 'site-b1.example.com', points: 650 }
        ],
        users: [
          { id: 'u3', name: '山田次郎', email: 'yamada@example.com', role: 'company-admin', status: 'active', credits: 800, lastLoginDate: '2024-02-25T08:00:00Z', createdDate: '2024-01-10T10:00:00Z', lastUpdatedDate: '2024-02-22T16:45:00Z' },
          { id: 'u4', name: '鈴木美咲', email: 'suzuki@example.com', role: 'company-user', status: 'active', credits: 200, lastLoginDate: '2024-02-23T12:30:00Z', createdDate: '2024-01-11T09:30:00Z', lastUpdatedDate: '2024-02-21T13:15:00Z' }
        ]
      }
    ]
  },
  {
    id: '2',
    type: 'direct',
    name: 'ダイレクト株式会社様',
    companies: [
      {
        id: 'c3',
        name: 'ダイレクト株式会社',
        type: 'company',
        organizationId: '',
        createdAt: '2024-01-05T08:00:00Z',
        updatedAt: '2024-01-25T11:20:00Z',
        status: 'active',
        proxyLoginEnabled: true,
        proxyLoginSessions: [],
        contractStartDate: '2024-01-05',
        contractEndDate: null,
        settings: {
          subscriptionType: 'enterprise',
          limits: {
            sites: 1,
            points: 1000,
            users: 3
          },
          usage: {
            sites: 1,
            points: 280,
            users: 2
          }
        },
        sites: [
          { id: 's7', name: 'サイト1', domain: 'direct1.example.com', points: 280 }
        ],
        users: [
          { id: 'u5', name: '高橋健一', email: 'takahashi@direct.com', role: 'company-admin', status: 'active', credits: 1000, lastLoginDate: '2024-02-25T09:15:00Z', createdDate: '2024-01-20T10:00:00Z', lastUpdatedDate: '2024-02-25T16:00:00Z' },
          { id: 'u6', name: '渡辺麻衣', email: 'watanabe@direct.com', role: 'company-user', status: 'active', credits: 600, lastLoginDate: '2024-02-20T14:00:00Z', createdDate: '2024-02-01T08:00:00Z', lastUpdatedDate: '2024-02-20T14:00:00Z' }
        ]
      }
    ]
  },
  {
    id: '3',
    type: 'direct',
    name: 'WEBコンサルティング株式会社様',
    companies: [
      {
        id: 'c4',
        name: 'プロジェクトC（小売業様）',
        type: 'company',
        organizationId: '',
        createdAt: '2024-02-01T10:00:00Z',
        updatedAt: '2024-02-15T15:00:00Z',
        status: 'inactive',
        proxyLoginEnabled: false,
        proxyLoginSessions: [],
        contractStartDate: '2023-02-01',
        contractEndDate: '2024-01-31',
        contractStatus: 'inactive' as const,
        settings: {
          subscriptionType: 'free',
          limits: {
            sites: 1,
            points: 500,
            users: 2
          },
          usage: {
            sites: 1,
            points: 450,
            users: 2
          }
        },
        sites: [
          { id: 's8', name: 'サイトC-1', domain: 'site-c1.example.com', points: 450 }
        ],
        users: [
          { id: 'u7', name: '伊藤一郎', email: 'ito@example.com', role: 'company-admin', status: 'inactive', credits: 100, lastLoginDate: '2024-01-31T10:00:00Z', createdDate: '2023-02-01T10:00:00Z', lastUpdatedDate: '2024-01-31T10:00:00Z' },
          { id: 'u8', name: '加藤花子', email: 'kato@example.com', role: 'company-admin', status: 'active', credits: 50, lastLoginDate: '2024-02-25T11:30:00Z', createdDate: '2023-02-01T10:00:00Z', lastUpdatedDate: '2024-02-15T15:00:00Z' }
        ]
      },
      {
        id: 'c5',
        name: 'プロジェクトD（製造業様）',
        type: 'company',
        organizationId: '',
        createdAt: '2024-02-05T09:00:00Z',
        updatedAt: '2024-02-20T14:00:00Z',
        status: 'suspended',
        proxyLoginEnabled: true,
        proxyLoginSessions: [],
        contractStartDate: '2024-02-05',
        contractEndDate: '2025-02-04',
        contractStatus: 'suspended' as const,
        settings: {
          subscriptionType: 'enterprise',
          limits: {
            sites: 5,
            points: 5000,
            users: 10
          },
          usage: {
            sites: 2,
            points: 1200,
            users: 3
          }
        },
        sites: [
          { id: 's9', name: 'サイトD-1', domain: 'site-d1.example.com', points: 800 },
          { id: 's10', name: 'サイトD-2', domain: 'site-d2.example.com', points: 400 }
        ],
        users: [
          { id: 'u9', name: '中村太郎', email: 'nakamura@example.com', role: 'chipper', status: 'active', credits: 2000, lastLoginDate: '2024-02-25T07:00:00Z', createdDate: '2024-02-05T09:00:00Z', lastUpdatedDate: '2024-02-20T14:00:00Z' },
          { id: 'u10', name: '小林美咲', email: 'kobayashi@example.com', role: 'company-user', status: 'active', credits: 1500, lastLoginDate: '2024-02-24T16:00:00Z', createdDate: '2024-02-05T09:30:00Z', lastUpdatedDate: '2024-02-19T10:30:00Z' },
          { id: 'u11', name: '松田健二', email: 'matsuda@example.com', role: 'company-user', status: 'suspended', credits: 500, lastLoginDate: '2024-02-10T10:00:00Z', createdDate: '2024-02-06T08:00:00Z', lastUpdatedDate: '2024-02-10T10:00:00Z' }
        ]
      }
    ]
  },
  {
    id: '4',
    type: 'direct',
    name: 'テクノロジー株式会社様',
    companies: [
      {
        id: 'c6',
        name: 'テクノロジー株式会社',
        type: 'company',
        organizationId: '',
        createdAt: '2024-01-20T10:00:00Z',
        updatedAt: '2024-02-25T16:00:00Z',
        status: 'active',
        proxyLoginEnabled: false,
        proxyLoginSessions: [],
        contractStartDate: '2024-01-20',
        contractEndDate: '2025-01-19',
        settings: {
          subscriptionType: 'premium',
          limits: {
            sites: 3,
            points: 2000,
            users: 5
          },
          usage: {
            sites: 3,
            points: 1950,
            users: 4
          }
        },
        sites: [
          { id: 's11', name: 'メインサイト', domain: 'main.tech.com', points: 1000 },
          { id: 's12', name: 'ブログ', domain: 'blog.tech.com', points: 500 },
          { id: 's13', name: 'サポート', domain: 'support.tech.com', points: 450 }
        ],
        users: [
          { id: 'u12', name: '斎藤一郎', email: 'saito@tech.com', role: 'company-admin', status: 'active', credits: 1000, lastLoginDate: '2024-02-25T10:00:00Z', createdDate: '2024-01-20T10:00:00Z', lastUpdatedDate: '2024-02-25T16:00:00Z' },
          { id: 'u13', name: '田村花子', email: 'tamura@tech.com', role: 'company-user', status: 'active', credits: 800, lastLoginDate: '2024-02-24T09:30:00Z', createdDate: '2024-01-21T09:00:00Z', lastUpdatedDate: '2024-02-23T14:30:00Z' },
          { id: 'u14', name: '森田次郎', email: 'morita@tech.com', role: 'company-user', status: 'active', credits: 600, lastLoginDate: '2024-02-23T11:00:00Z', createdDate: '2024-01-22T10:30:00Z', lastUpdatedDate: '2024-02-22T15:45:00Z' },
          { id: 'u15', name: '吉田美咲', email: 'yoshida@tech.com', role: 'chipper', status: 'active', credits: 2000, lastLoginDate: '2024-02-25T08:30:00Z', createdDate: '2024-01-20T10:00:00Z', lastUpdatedDate: '2024-02-24T17:00:00Z' }
        ]
      }
    ]
  },
  // 追加の30件のダミーデータ
  {
    id: '5',
    type: 'direct',
    name: 'アルファマーケティング株式会社様',
    companies: [{
      id: 'c7', name: 'ECサイト運営', type: 'company', organizationId: '', createdAt: '2024-01-12T09:00:00Z', updatedAt: '2024-02-20T15:30:00Z', status: 'active', proxyLoginEnabled: true, proxyLoginSessions: [], contractStartDate: '2024-01-12', contractEndDate: '2024-12-31',
      settings: { subscriptionType: 'basic', limits: { sites: 2, points: 800, users: 3 }, usage: { sites: 2, points: 320, users: 2 } },
      sites: [{ id: 's14', name: 'ECメインサイト', domain: 'alpha-ec.com', points: 200 }, { id: 's15', name: 'ブランドサイト', domain: 'brand.alpha.com', points: 120 }],
      users: [{ id: 'u16', name: '青木健太', email: 'aoki@alpha.com', role: 'company-admin', status: 'active', credits: 400, lastLoginDate: '2024-02-25T12:00:00Z', createdDate: '2024-01-12T09:00:00Z', lastUpdatedDate: '2024-02-20T15:30:00Z' }]
    }]
  },
  {
    id: '6',
    type: 'direct',
    name: 'ベータソリューションズ様',
    companies: [{
      id: 'c8', name: 'SaaS事業部', type: 'company', organizationId: '', createdAt: '2024-01-25T10:00:00Z', updatedAt: '2024-02-22T11:45:00Z', status: 'active', proxyLoginEnabled: false, proxyLoginSessions: [], contractStartDate: '2024-01-25', contractEndDate: '2025-01-24',
      settings: { subscriptionType: 'premium', limits: { sites: 5, points: 3000, users: 8 }, usage: { sites: 4, points: 2100, users: 6 } },
      sites: [{ id: 's16', name: 'SaaS製品サイト', domain: 'beta-saas.com', points: 800 }, { id: 's17', name: 'ランディングページ', domain: 'lp.beta.com', points: 600 }, { id: 's18', name: 'サポートサイト', domain: 'support.beta.com', points: 400 }, { id: 's19', name: 'ブログ', domain: 'blog.beta.com', points: 300 }],
      users: [{ id: 'u17', name: '西村雅子', email: 'nishimura@beta.com', role: 'company-admin', status: 'active', credits: 1200, lastLoginDate: '2024-02-24T16:30:00Z', createdDate: '2024-01-25T10:00:00Z', lastUpdatedDate: '2024-02-22T11:45:00Z' }]
    }]
  },
  {
    id: '7',
    type: 'direct',
    name: 'ガンマエンタープライズ様',
    companies: [{
      id: 'c9', name: 'BtoB事業', type: 'company', organizationId: '', createdAt: '2023-12-15T08:30:00Z', updatedAt: '2024-02-18T14:20:00Z', status: 'suspended', proxyLoginEnabled: true, proxyLoginSessions: [], contractStartDate: '2023-12-15', contractEndDate: '2024-12-14',
      settings: { subscriptionType: 'enterprise', limits: { sites: 10, points: 8000, users: 15 }, usage: { sites: 3, points: 1800, users: 5 } },
      sites: [{ id: 's20', name: 'コーポレートサイト', domain: 'gamma-corp.com', points: 900 }, { id: 's21', name: '製品サイト', domain: 'products.gamma.com', points: 600 }, { id: 's22', name: 'IR情報', domain: 'ir.gamma.com', points: 300 }],
      users: [{ id: 'u18', name: '橋本直樹', email: 'hashimoto@gamma.com', role: 'company-admin', status: 'suspended', credits: 150, lastLoginDate: '2024-02-10T09:00:00Z', createdDate: '2023-12-15T08:30:00Z', lastUpdatedDate: '2024-02-10T09:00:00Z' }]
    }]
  },
  {
    id: '8',
    type: 'direct',
    name: 'デルタインダストリーズ様',
    companies: [{
      id: 'c10', name: '製造業DX', type: 'company', organizationId: '', createdAt: '2024-02-08T11:00:00Z', updatedAt: '2024-02-26T13:15:00Z', status: 'active', proxyLoginEnabled: true, proxyLoginSessions: [], contractStartDate: '2024-02-08', contractEndDate: null,
      settings: { subscriptionType: 'premium', limits: { sites: 3, points: 2500, users: 6 }, usage: { sites: 3, points: 1650, users: 4 } },
      sites: [{ id: 's23', name: 'DXソリューション', domain: 'dx.delta.com', points: 800 }, { id: 's24', name: '事例紹介', domain: 'case.delta.com', points: 500 }, { id: 's25', name: 'セミナー', domain: 'seminar.delta.com', points: 350 }],
      users: [{ id: 'u19', name: '川島美紀', email: 'kawashima@delta.com', role: 'company-admin', status: 'active', credits: 900, lastLoginDate: '2024-02-26T10:30:00Z', createdDate: '2024-02-08T11:00:00Z', lastUpdatedDate: '2024-02-26T13:15:00Z' }]
    }]
  },
  {
    id: '9',
    type: 'direct',
    name: 'イプシロンコンサルティング様',
    companies: [{
      id: 'c11', name: 'デジタル変革支援', type: 'company', organizationId: '', createdAt: '2024-01-18T14:00:00Z', updatedAt: '2024-02-21T16:40:00Z', status: 'active', proxyLoginEnabled: false, proxyLoginSessions: [], contractStartDate: '2024-01-18', contractEndDate: '2025-01-17',
      settings: { subscriptionType: 'basic', limits: { sites: 1, points: 600, users: 2 }, usage: { sites: 1, points: 480, users: 2 } },
      sites: [{ id: 's26', name: 'コンサル紹介', domain: 'epsilon-consult.com', points: 480 }],
      users: [{ id: 'u20', name: '岡田誠', email: 'okada@epsilon.com', role: 'company-admin', status: 'active', credits: 300, lastLoginDate: '2024-02-25T08:45:00Z', createdDate: '2024-01-18T14:00:00Z', lastUpdatedDate: '2024-02-21T16:40:00Z' }]
    }]
  },
  {
    id: '10',
    type: 'direct',
    name: 'ゼータファイナンス様',
    companies: [{
      id: 'c12', name: 'フィンテック事業', type: 'company', organizationId: '', createdAt: '2023-11-20T09:30:00Z', updatedAt: '2024-02-19T12:50:00Z', status: 'inactive', proxyLoginEnabled: true, proxyLoginSessions: [], contractStartDate: '2023-11-20', contractEndDate: '2024-11-19',
      settings: { subscriptionType: 'free', limits: { sites: 1, points: 300, users: 1 }, usage: { sites: 1, points: 280, users: 1 } },
      sites: [{ id: 's27', name: 'フィンテックサービス', domain: 'fintech.zeta.com', points: 280 }],
      users: [{ id: 'u21', name: '村田さくら', email: 'murata@zeta.com', role: 'company-admin', status: 'inactive', credits: 50, lastLoginDate: '2024-01-15T10:00:00Z', createdDate: '2023-11-20T09:30:00Z', lastUpdatedDate: '2024-01-15T10:00:00Z' }]
    }]
  },
  {
    id: '11',
    type: 'direct',
    name: 'イータメディア様',
    companies: [{
      id: 'c13', name: 'メディア運営', type: 'company', organizationId: '', createdAt: '2024-01-30T13:20:00Z', updatedAt: '2024-02-24T17:10:00Z', status: 'active', proxyLoginEnabled: true, proxyLoginSessions: [], contractStartDate: '2024-01-30', contractEndDate: '2024-12-31',
      settings: { subscriptionType: 'premium', limits: { sites: 6, points: 4000, users: 10 }, usage: { sites: 5, points: 2800, users: 8 } },
      sites: [{ id: 's28', name: 'ニュースサイト', domain: 'news.eta.com', points: 1000 }, { id: 's29', name: 'ライフスタイル', domain: 'lifestyle.eta.com', points: 700 }, { id: 's30', name: 'テクノロジー', domain: 'tech.eta.com', points: 600 }, { id: 's31', name: 'スポーツ', domain: 'sports.eta.com', points: 350 }, { id: 's32', name: 'エンタメ', domain: 'entertainment.eta.com', points: 150 }],
      users: [{ id: 'u22', name: '石井啓介', email: 'ishii@eta.com', role: 'company-admin', status: 'active', credits: 1500, lastLoginDate: '2024-02-26T09:20:00Z', createdDate: '2024-01-30T13:20:00Z', lastUpdatedDate: '2024-02-24T17:10:00Z' }]
    }]
  },
  {
    id: '12',
    type: 'direct',
    name: 'シータリテール様',
    companies: [{
      id: 'c14', name: '小売業デジタル化', type: 'company', organizationId: '', createdAt: '2024-02-12T10:45:00Z', updatedAt: '2024-02-25T14:25:00Z', status: 'active', proxyLoginEnabled: false, proxyLoginSessions: [], contractStartDate: '2024-02-12', contractEndDate: '2025-02-11',
      settings: { subscriptionType: 'enterprise', limits: { sites: 8, points: 6000, users: 12 }, usage: { sites: 6, points: 3600, users: 9 } },
      sites: [{ id: 's33', name: 'オンラインストア', domain: 'store.theta.com', points: 1200 }, { id: 's34', name: 'カタログサイト', domain: 'catalog.theta.com', points: 800 }, { id: 's35', name: 'キャンペーン', domain: 'campaign.theta.com', points: 600 }, { id: 's36', name: 'お客様サポート', domain: 'support.theta.com', points: 500 }, { id: 's37', name: '店舗検索', domain: 'store-finder.theta.com', points: 300 }, { id: 's38', name: 'ブランドサイト', domain: 'brand.theta.com', points: 200 }],
      users: [{ id: 'u23', name: '林田恵子', email: 'hayashida@theta.com', role: 'company-admin', status: 'active', credits: 2000, lastLoginDate: '2024-02-25T15:45:00Z', createdDate: '2024-02-12T10:45:00Z', lastUpdatedDate: '2024-02-25T14:25:00Z' }]
    }]
  },
  {
    id: '13',
    type: 'direct',
    name: 'カッパテクノロジー様',
    companies: [{
      id: 'c15', name: 'AI開発事業', type: 'company', organizationId: '', createdAt: '2024-01-08T15:30:00Z', updatedAt: '2024-02-23T11:20:00Z', status: 'active', proxyLoginEnabled: true, proxyLoginSessions: [], contractStartDate: '2024-01-08', contractEndDate: null,
      settings: { subscriptionType: 'premium', limits: { sites: 4, points: 3500, users: 7 }, usage: { sites: 3, points: 2450, users: 5 } },
      sites: [{ id: 's39', name: 'AI製品サイト', domain: 'ai.kappa.com', points: 1200 }, { id: 's40', name: '技術ブログ', domain: 'tech-blog.kappa.com', points: 800 }, { id: 's41', name: '導入事例', domain: 'cases.kappa.com', points: 450 }],
      users: [{ id: 'u24', name: '安藤亮太', email: 'ando@kappa.com', role: 'company-admin', status: 'active', credits: 1300, lastLoginDate: '2024-02-26T08:30:00Z', createdDate: '2024-01-08T15:30:00Z', lastUpdatedDate: '2024-02-23T11:20:00Z' }]
    }]
  },
  {
    id: '14',
    type: 'direct',
    name: 'ラムダロジスティクス様',
    companies: [{
      id: 'c16', name: '物流システム', type: 'company', organizationId: '', createdAt: '2023-12-28T08:15:00Z', updatedAt: '2024-02-20T16:55:00Z', status: 'suspended', proxyLoginEnabled: false, proxyLoginSessions: [], contractStartDate: '2023-12-28', contractEndDate: '2024-12-27',
      settings: { subscriptionType: 'basic', limits: { sites: 2, points: 1200, users: 4 }, usage: { sites: 2, points: 720, users: 3 } },
      sites: [{ id: 's42', name: '物流サービス', domain: 'logistics.lambda.com', points: 420 }, { id: 's43', name: 'トラッキング', domain: 'track.lambda.com', points: 300 }],
      users: [{ id: 'u25', name: '金子洋平', email: 'kaneko@lambda.com', role: 'company-admin', status: 'suspended', credits: 200, lastLoginDate: '2024-02-05T12:00:00Z', createdDate: '2023-12-28T08:15:00Z', lastUpdatedDate: '2024-02-05T12:00:00Z' }]
    }]
  },
  {
    id: '15',
    type: 'direct',
    name: 'ミューヘルスケア様',
    companies: [{
      id: 'c17', name: 'デジタルヘルス', type: 'company', organizationId: '', createdAt: '2024-02-05T12:40:00Z', updatedAt: '2024-02-26T10:15:00Z', status: 'active', proxyLoginEnabled: true, proxyLoginSessions: [], contractStartDate: '2024-02-05', contractEndDate: '2025-02-04',
      settings: { subscriptionType: 'enterprise', limits: { sites: 7, points: 5500, users: 11 }, usage: { sites: 5, points: 3300, users: 8 } },
      sites: [{ id: 's44', name: 'ヘルスケアアプリ', domain: 'health.mu.com', points: 1100 }, { id: 's45', name: '医療相談', domain: 'consult.mu.com', points: 900 }, { id: 's46', name: '健康情報', domain: 'info.mu.com', points: 700 }, { id: 's47', name: '予約システム', domain: 'booking.mu.com', points: 400 }, { id: 's48', name: 'FAQ', domain: 'faq.mu.com', points: 200 }],
      users: [{ id: 'u26', name: '山口由美', email: 'yamaguchi@mu.com', role: 'company-admin', status: 'active', credits: 1800, lastLoginDate: '2024-02-26T11:30:00Z', createdDate: '2024-02-05T12:40:00Z', lastUpdatedDate: '2024-02-26T10:15:00Z' }]
    }]
  },
  {
    id: '16',
    type: 'direct',
    name: 'ニューエデュケーション様',
    companies: [{
      id: 'c18', name: 'オンライン教育', type: 'company', organizationId: '', createdAt: '2024-01-22T09:50:00Z', updatedAt: '2024-02-22T13:35:00Z', status: 'active', proxyLoginEnabled: false, proxyLoginSessions: [], contractStartDate: '2024-01-22', contractEndDate: '2024-12-31',
      settings: { subscriptionType: 'premium', limits: { sites: 4, points: 2800, users: 6 }, usage: { sites: 4, points: 1960, users: 5 } },
      sites: [{ id: 's49', name: 'オンライン講座', domain: 'courses.nu-edu.com', points: 800 }, { id: 's50', name: '学習管理', domain: 'lms.nu-edu.com', points: 600 }, { id: 's51', name: '講師紹介', domain: 'teachers.nu-edu.com', points: 350 }, { id: 's52', name: '受講生サポート', domain: 'support.nu-edu.com', points: 210 }],
      users: [{ id: 'u27', name: '佐々木隆', email: 'sasaki@nu-edu.com', role: 'company-admin', status: 'active', credits: 1100, lastLoginDate: '2024-02-25T14:20:00Z', createdDate: '2024-01-22T09:50:00Z', lastUpdatedDate: '2024-02-22T13:35:00Z' }]
    }]
  },
  {
    id: '17',
    type: 'direct',
    name: 'オミクロンエナジー様',
    companies: [{
      id: 'c19', name: '再生可能エネルギー', type: 'company', organizationId: '', createdAt: '2023-12-10T11:25:00Z', updatedAt: '2024-02-18T15:10:00Z', status: 'inactive', proxyLoginEnabled: true, proxyLoginSessions: [], contractStartDate: '2023-12-10', contractEndDate: '2024-12-09',
      settings: { subscriptionType: 'basic', limits: { sites: 3, points: 1500, users: 5 }, usage: { sites: 2, points: 900, users: 3 } },
      sites: [{ id: 's53', name: 'ソーラー事業', domain: 'solar.omicron.com', points: 550 }, { id: 's54', name: '風力発電', domain: 'wind.omicron.com', points: 350 }],
      users: [{ id: 'u28', name: '池田真理', email: 'ikeda@omicron.com', role: 'company-admin', status: 'inactive', credits: 180, lastLoginDate: '2024-01-20T09:30:00Z', createdDate: '2023-12-10T11:25:00Z', lastUpdatedDate: '2024-01-20T09:30:00Z' }]
    }]
  },
  {
    id: '18',
    type: 'direct',
    name: 'パイアグリカルチャー様',
    companies: [{
      id: 'c20', name: 'スマート農業', type: 'company', organizationId: '', createdAt: '2024-02-14T14:15:00Z', updatedAt: '2024-02-26T12:45:00Z', status: 'active', proxyLoginEnabled: true, proxyLoginSessions: [], contractStartDate: '2024-02-14', contractEndDate: '2025-02-13',
      settings: { subscriptionType: 'premium', limits: { sites: 5, points: 3200, users: 8 }, usage: { sites: 4, points: 2240, users: 6 } },
      sites: [{ id: 's55', name: 'スマート農業', domain: 'smart-agri.pi.com', points: 900 }, { id: 's56', name: 'IoTセンサー', domain: 'iot.pi.com', points: 700 }, { id: 's57', name: 'データ分析', domain: 'analytics.pi.com', points: 440 }, { id: 's58', name: 'サポート', domain: 'support.pi.com', points: 200 }],
      users: [{ id: 'u29', name: '田辺光男', email: 'tanabe@pi.com', role: 'company-admin', status: 'active', credits: 1400, lastLoginDate: '2024-02-26T13:15:00Z', createdDate: '2024-02-14T14:15:00Z', lastUpdatedDate: '2024-02-26T12:45:00Z' }]
    }]
  },
  {
    id: '19',
    type: 'direct',
    name: 'ローファッション様',
    companies: [{
      id: 'c21', name: 'アパレルEC', type: 'company', organizationId: '', createdAt: '2024-01-16T16:20:00Z', updatedAt: '2024-02-24T09:40:00Z', status: 'active', proxyLoginEnabled: false, proxyLoginSessions: [], contractStartDate: '2024-01-16', contractEndDate: null,
      settings: { subscriptionType: 'basic', limits: { sites: 3, points: 1800, users: 4 }, usage: { sites: 3, points: 1260, users: 3 } },
      sites: [{ id: 's59', name: 'オンラインショップ', domain: 'shop.rho-fashion.com', points: 600 }, { id: 's60', name: 'ブランドサイト', domain: 'brand.rho-fashion.com', points: 400 }, { id: 's61', name: 'スタイリング', domain: 'style.rho-fashion.com', points: 260 }],
      users: [{ id: 'u30', name: '小野寺彩', email: 'onodera@rho-fashion.com', role: 'company-admin', status: 'active', credits: 800, lastLoginDate: '2024-02-25T16:50:00Z', createdDate: '2024-01-16T16:20:00Z', lastUpdatedDate: '2024-02-24T09:40:00Z' }]
    }]
  },
  {
    id: '20',
    type: 'direct',
    name: 'シグマセキュリティ様',
    companies: [{
      id: 'c22', name: 'サイバーセキュリティ', type: 'company', organizationId: '', createdAt: '2023-11-05T10:10:00Z', updatedAt: '2024-02-21T14:50:00Z', status: 'suspended', proxyLoginEnabled: true, proxyLoginSessions: [], contractStartDate: '2023-11-05', contractEndDate: '2024-11-04',
      settings: { subscriptionType: 'enterprise', limits: { sites: 6, points: 4500, users: 9 }, usage: { sites: 3, points: 1800, users: 4 } },
      sites: [{ id: 's62', name: 'セキュリティサービス', domain: 'security.sigma.com', points: 900 }, { id: 's63', name: '脅威情報', domain: 'threat.sigma.com', points: 600 }, { id: 's64', name: 'コンサルティング', domain: 'consulting.sigma.com', points: 300 }],
      users: [{ id: 'u31', name: '森川英樹', email: 'morikawa@sigma.com', role: 'company-admin', status: 'suspended', credits: 300, lastLoginDate: '2024-02-01T11:20:00Z', createdDate: '2023-11-05T10:10:00Z', lastUpdatedDate: '2024-02-01T11:20:00Z' }]
    }]
  },
  {
    id: '21',
    type: 'direct',
    name: 'タウトラベル様',
    companies: [{
      id: 'c23', name: '旅行プラットフォーム', type: 'company', organizationId: '', createdAt: '2024-02-18T13:30:00Z', updatedAt: '2024-02-26T15:20:00Z', status: 'active', proxyLoginEnabled: true, proxyLoginSessions: [], contractStartDate: '2024-02-18', contractEndDate: '2025-02-17',
      settings: { subscriptionType: 'premium', limits: { sites: 7, points: 4200, users: 10 }, usage: { sites: 6, points: 2940, users: 7 } },
      sites: [{ id: 's65', name: '旅行予約', domain: 'booking.tau-travel.com', points: 1000 }, { id: 's66', name: 'ホテル検索', domain: 'hotels.tau-travel.com', points: 700 }, { id: 's67', name: '観光情報', domain: 'guide.tau-travel.com', points: 500 }, { id: 's68', name: 'レビュー', domain: 'reviews.tau-travel.com', points: 400 }, { id: 's69', name: 'キャンペーン', domain: 'campaign.tau-travel.com', points: 240 }, { id: 's70', name: 'サポート', domain: 'help.tau-travel.com', points: 100 }],
      users: [{ id: 'u32', name: '長谷川優子', email: 'hasegawa@tau-travel.com', role: 'company-admin', status: 'active', credits: 1600, lastLoginDate: '2024-02-26T14:40:00Z', createdDate: '2024-02-18T13:30:00Z', lastUpdatedDate: '2024-02-26T15:20:00Z' }]
    }]
  },
  {
    id: '22',
    type: 'direct',
    name: 'ファイフード様',
    companies: [{
      id: 'c24', name: 'フードデリバリー', type: 'company', organizationId: '', createdAt: '2024-01-28T11:45:00Z', updatedAt: '2024-02-25T16:30:00Z', status: 'active', proxyLoginEnabled: false, proxyLoginSessions: [], contractStartDate: '2024-01-28', contractEndDate: '2024-12-31',
      settings: { subscriptionType: 'basic', limits: { sites: 2, points: 1000, users: 3 }, usage: { sites: 2, points: 700, users: 2 } },
      sites: [{ id: 's71', name: 'デリバリーアプリ', domain: 'app.phi-food.com', points: 450 }, { id: 's72', name: 'レストラン登録', domain: 'restaurant.phi-food.com', points: 250 }],
      users: [{ id: 'u33', name: '吉川淳', email: 'yoshikawa@phi-food.com', role: 'company-admin', status: 'active', credits: 600, lastLoginDate: '2024-02-26T09:15:00Z', createdDate: '2024-01-28T11:45:00Z', lastUpdatedDate: '2024-02-25T16:30:00Z' }]
    }]
  },
  {
    id: '23',
    type: 'direct',
    name: 'カイインシュアランス様',
    companies: [{
      id: 'c25', name: 'デジタル保険', type: 'company', organizationId: '', createdAt: '2023-12-20T09:20:00Z', updatedAt: '2024-02-19T11:10:00Z', status: 'inactive', proxyLoginEnabled: true, proxyLoginSessions: [], contractStartDate: '2023-12-20', contractEndDate: '2024-12-19',
      settings: { subscriptionType: 'free', limits: { sites: 1, points: 400, users: 2 }, usage: { sites: 1, points: 320, users: 1 } },
      sites: [{ id: 's73', name: '保険見積もり', domain: 'quote.chi-insurance.com', points: 320 }],
      users: [{ id: 'u34', name: '中島康介', email: 'nakajima@chi-insurance.com', role: 'company-admin', status: 'inactive', credits: 80, lastLoginDate: '2024-01-25T14:00:00Z', createdDate: '2023-12-20T09:20:00Z', lastUpdatedDate: '2024-01-25T14:00:00Z' }]
    }]
  },
  {
    id: '24',
    type: 'direct',
    name: 'プサイゲーミング様',
    companies: [{
      id: 'c26', name: 'ゲーム開発', type: 'company', organizationId: '', createdAt: '2024-02-10T15:55:00Z', updatedAt: '2024-02-26T17:25:00Z', status: 'active', proxyLoginEnabled: true, proxyLoginSessions: [], contractStartDate: '2024-02-10', contractEndDate: '2025-02-09',
      settings: { subscriptionType: 'enterprise', limits: { sites: 8, points: 6000, users: 12 }, usage: { sites: 7, points: 4200, users: 10 } },
      sites: [{ id: 's74', name: 'ゲームポータル', domain: 'games.psi-gaming.com', points: 1200 }, { id: 's75', name: 'プレイヤーコミュニティ', domain: 'community.psi-gaming.com', points: 900 }, { id: 's76', name: 'eスポーツ', domain: 'esports.psi-gaming.com', points: 700 }, { id: 's77', name: 'ゲーム開発ブログ', domain: 'dev-blog.psi-gaming.com', points: 600 }, { id: 's78', name: 'サポート', domain: 'support.psi-gaming.com', points: 400 }, { id: 's79', name: 'ストア', domain: 'store.psi-gaming.com', points: 300 }, { id: 's80', name: 'イベント', domain: 'events.psi-gaming.com', points: 100 }],
      users: [{ id: 'u35', name: '藤田剛', email: 'fujita@psi-gaming.com', role: 'company-admin', status: 'active', credits: 2200, lastLoginDate: '2024-02-26T16:45:00Z', createdDate: '2024-02-10T15:55:00Z', lastUpdatedDate: '2024-02-26T17:25:00Z' }]
    }]
  },
  {
    id: '25',
    type: 'direct',
    name: 'オメガクラウド様',
    companies: [{
      id: 'c27', name: 'クラウドサービス', type: 'company', organizationId: '', createdAt: '2024-01-05T08:40:00Z', updatedAt: '2024-02-23T12:15:00Z', status: 'active', proxyLoginEnabled: false, proxyLoginSessions: [], contractStartDate: '2024-01-05', contractEndDate: null,
      settings: { subscriptionType: 'premium', limits: { sites: 5, points: 3800, users: 8 }, usage: { sites: 4, points: 2660, users: 6 } },
      sites: [{ id: 's81', name: 'クラウドプラットフォーム', domain: 'cloud.omega.com', points: 1000 }, { id: 's82', name: 'APIドキュメント', domain: 'api.omega.com', points: 800 }, { id: 's83', name: 'チュートリアル', domain: 'tutorial.omega.com', points: 500 }, { id: 's84', name: 'ステータスページ', domain: 'status.omega.com', points: 360 }],
      users: [{ id: 'u36', name: '松本和子', email: 'matsumoto@omega.com', role: 'company-admin', status: 'active', credits: 1500, lastLoginDate: '2024-02-25T11:30:00Z', createdDate: '2024-01-05T08:40:00Z', lastUpdatedDate: '2024-02-23T12:15:00Z' }]
    }]
  },
  {
    id: '26',
    type: 'direct',
    name: 'エイアルファエンジニアリング様',
    companies: [{
      id: 'c28', name: '建築設計支援', type: 'company', organizationId: '', createdAt: '2023-11-15T14:30:00Z', updatedAt: '2024-02-20T10:45:00Z', status: 'suspended', proxyLoginEnabled: true, proxyLoginSessions: [], contractStartDate: '2023-11-15', contractEndDate: '2024-11-14',
      settings: { subscriptionType: 'basic', limits: { sites: 3, points: 1400, users: 5 }, usage: { sites: 2, points: 840, users: 3 } },
      sites: [{ id: 's85', name: '設計サービス', domain: 'design.a1-eng.com', points: 500 }, { id: 's86', name: '施工事例', domain: 'cases.a1-eng.com', points: 340 }],
      users: [{ id: 'u37', name: '野村洋一', email: 'nomura@a1-eng.com', role: 'company-admin', status: 'suspended', credits: 220, lastLoginDate: '2024-02-08T13:20:00Z', createdDate: '2023-11-15T14:30:00Z', lastUpdatedDate: '2024-02-08T13:20:00Z' }]
    }]
  },
  {
    id: '27',
    type: 'direct',
    name: 'ベータマニュファクチャリング様',
    companies: [{
      id: 'c29', name: '製造業IoT', type: 'company', organizationId: '', createdAt: '2024-02-07T12:10:00Z', updatedAt: '2024-02-26T14:55:00Z', status: 'active', proxyLoginEnabled: true, proxyLoginSessions: [], contractStartDate: '2024-02-07', contractEndDate: '2025-02-06',
      settings: { subscriptionType: 'enterprise', limits: { sites: 9, points: 7000, users: 15 }, usage: { sites: 6, points: 4200, users: 11 } },
      sites: [{ id: 's87', name: 'IoTソリューション', domain: 'iot.beta-manu.com', points: 1300 }, { id: 's88', name: '工場管理', domain: 'factory.beta-manu.com', points: 1000 }, { id: 's89', name: '品質管理', domain: 'quality.beta-manu.com', points: 700 }, { id: 's90', name: 'メンテナンス', domain: 'maintenance.beta-manu.com', points: 600 }, { id: 's91', name: 'レポート', domain: 'report.beta-manu.com', points: 400 }, { id: 's92', name: 'トレーニング', domain: 'training.beta-manu.com', points: 200 }],
      users: [{ id: 'u38', name: '上田智子', email: 'ueda@beta-manu.com', role: 'company-admin', status: 'active', credits: 2500, lastLoginDate: '2024-02-26T15:20:00Z', createdDate: '2024-02-07T12:10:00Z', lastUpdatedDate: '2024-02-26T14:55:00Z' }]
    }]
  },
  {
    id: '28',
    type: 'direct',
    name: 'ガンマソーシャル様',
    companies: [{
      id: 'c30', name: 'SNSマーケティング', type: 'company', organizationId: '', createdAt: '2024-01-11T10:25:00Z', updatedAt: '2024-02-22T15:40:00Z', status: 'active', proxyLoginEnabled: false, proxyLoginSessions: [], contractStartDate: '2024-01-11', contractEndDate: '2024-12-31',
      settings: { subscriptionType: 'premium', limits: { sites: 4, points: 2600, users: 6 }, usage: { sites: 4, points: 1820, users: 5 } },
      sites: [{ id: 's93', name: 'SNS分析ツール', domain: 'analytics.gamma-social.com', points: 700 }, { id: 's94', name: 'キャンペーン管理', domain: 'campaign.gamma-social.com', points: 500 }, { id: 's95', name: 'レポート生成', domain: 'report.gamma-social.com', points: 400 }, { id: 's96', name: 'クライアント管理', domain: 'client.gamma-social.com', points: 220 }],
      users: [{ id: 'u39', name: '渡部健司', email: 'watabe@gamma-social.com', role: 'company-admin', status: 'active', credits: 1200, lastLoginDate: '2024-02-26T12:10:00Z', createdDate: '2024-01-11T10:25:00Z', lastUpdatedDate: '2024-02-22T15:40:00Z' }]
    }]
  },
  {
    id: '29',
    type: 'direct',
    name: 'デルタバイオ様',
    companies: [{
      id: 'c31', name: 'バイオテクノロジー', type: 'company', organizationId: '', createdAt: '2023-12-05T13:50:00Z', updatedAt: '2024-02-17T16:35:00Z', status: 'inactive', proxyLoginEnabled: true, proxyLoginSessions: [], contractStartDate: '2023-12-05', contractEndDate: '2024-12-04',
      settings: { subscriptionType: 'basic', limits: { sites: 2, points: 900, users: 3 }, usage: { sites: 1, points: 540, users: 2 } },
      sites: [{ id: 's97', name: '研究開発', domain: 'research.delta-bio.com', points: 540 }],
      users: [{ id: 'u40', name: '高木美香', email: 'takagi@delta-bio.com', role: 'company-admin', status: 'inactive', credits: 150, lastLoginDate: '2024-02-02T10:45:00Z', createdDate: '2023-12-05T13:50:00Z', lastUpdatedDate: '2024-02-02T10:45:00Z' }]
    }]
  },
  {
    id: '30',
    type: 'direct',
    name: 'イプシロンロボティクス様',
    companies: [{
      id: 'c32', name: 'ロボット開発', type: 'company', organizationId: '', createdAt: '2024-02-15T11:20:00Z', updatedAt: '2024-02-26T13:50:00Z', status: 'active', proxyLoginEnabled: true, proxyLoginSessions: [], contractStartDate: '2024-02-15', contractEndDate: '2025-02-14',
      settings: { subscriptionType: 'enterprise', limits: { sites: 6, points: 4800, users: 10 }, usage: { sites: 5, points: 3360, users: 8 } },
      sites: [{ id: 's98', name: 'ロボット製品', domain: 'robots.epsilon-robotics.com', points: 1200 }, { id: 's99', name: 'AI技術', domain: 'ai.epsilon-robotics.com', points: 800 }, { id: 's100', name: '産業用ロボット', domain: 'industrial.epsilon-robotics.com', points: 600 }, { id: 's101', name: 'サポート', domain: 'support.epsilon-robotics.com', points: 460 }, { id: 's102', name: 'デモ予約', domain: 'demo.epsilon-robotics.com', points: 300 }],
      users: [{ id: 'u41', name: '清水正人', email: 'shimizu@epsilon-robotics.com', role: 'company-admin', status: 'active', credits: 2000, lastLoginDate: '2024-02-26T14:30:00Z', createdDate: '2024-02-15T11:20:00Z', lastUpdatedDate: '2024-02-26T13:50:00Z' }]
    }]
  },
  {
    id: '31',
    type: 'direct',
    name: 'ゼータマテリアル様',
    companies: [{
      id: 'c33', name: '新素材開発', type: 'company', organizationId: '', createdAt: '2024-01-29T14:40:00Z', updatedAt: '2024-02-24T11:25:00Z', status: 'active', proxyLoginEnabled: false, proxyLoginSessions: [], contractStartDate: '2024-01-29', contractEndDate: null,
      settings: { subscriptionType: 'premium', limits: { sites: 3, points: 2200, users: 5 }, usage: { sites: 3, points: 1540, users: 4 } },
      sites: [{ id: 's103', name: '素材カタログ', domain: 'materials.zeta-material.com', points: 700 }, { id: 's104', name: '技術資料', domain: 'tech.zeta-material.com', points: 500 }, { id: 's105', name: '問い合わせ', domain: 'contact.zeta-material.com', points: 340 }],
      users: [{ id: 'u42', name: '岡本英治', email: 'okamoto@zeta-material.com', role: 'company-admin', status: 'active', credits: 1100, lastLoginDate: '2024-02-25T13:45:00Z', createdDate: '2024-01-29T14:40:00Z', lastUpdatedDate: '2024-02-24T11:25:00Z' }]
    }]
  },
  {
    id: '32',
    type: 'direct',
    name: 'イータスペース様',
    companies: [{
      id: 'c34', name: '宇宙技術', type: 'company', organizationId: '', createdAt: '2023-11-28T09:15:00Z', updatedAt: '2024-02-21T17:05:00Z', status: 'suspended', proxyLoginEnabled: true, proxyLoginSessions: [], contractStartDate: '2023-11-28', contractEndDate: '2024-11-27',
      settings: { subscriptionType: 'enterprise', limits: { sites: 10, points: 8500, users: 20 }, usage: { sites: 4, points: 2550, users: 6 } },
      sites: [{ id: 's106', name: '衛星開発', domain: 'satellite.eta-space.com', points: 1000 }, { id: 's107', name: '宇宙探査', domain: 'exploration.eta-space.com', points: 700 }, { id: 's108', name: '技術論文', domain: 'papers.eta-space.com', points: 500 }, { id: 's109', name: 'プロジェクト', domain: 'projects.eta-space.com', points: 350 }],
      users: [{ id: 'u43', name: '星野宇宙', email: 'hoshino@eta-space.com', role: 'company-admin', status: 'suspended', credits: 400, lastLoginDate: '2024-02-12T08:30:00Z', createdDate: '2023-11-28T09:15:00Z', lastUpdatedDate: '2024-02-12T08:30:00Z' }]
    }]
  },
  {
    id: '33',
    type: 'direct',
    name: 'シータオーシャン様',
    companies: [{
      id: 'c35', name: '海洋技術', type: 'company', organizationId: '', createdAt: '2024-02-20T16:10:00Z', updatedAt: '2024-02-26T18:00:00Z', status: 'active', proxyLoginEnabled: true, proxyLoginSessions: [], contractStartDate: '2024-02-20', contractEndDate: '2025-02-19',
      settings: { subscriptionType: 'premium', limits: { sites: 4, points: 3000, users: 7 }, usage: { sites: 4, points: 2100, users: 5 } },
      sites: [{ id: 's110', name: '海洋調査', domain: 'research.theta-ocean.com', points: 800 }, { id: 's111', name: '環境保全', domain: 'environment.theta-ocean.com', points: 600 }, { id: 's112', name: '海洋データ', domain: 'data.theta-ocean.com', points: 450 }, { id: 's113', name: 'プロジェクト', domain: 'projects.theta-ocean.com', points: 250 }],
      users: [{ id: 'u44', name: '海野浩二', email: 'umino@theta-ocean.com', role: 'company-admin', status: 'active', credits: 1300, lastLoginDate: '2024-02-26T17:20:00Z', createdDate: '2024-02-20T16:10:00Z', lastUpdatedDate: '2024-02-26T18:00:00Z' }]
    }]
  },
  {
    id: '34',
    type: 'direct',
    name: 'カッパクリーンエナジー様',
    companies: [{
      id: 'c36', name: 'クリーンエネルギー', type: 'company', organizationId: '', createdAt: '2024-01-31T12:35:00Z', updatedAt: '2024-02-23T14:20:00Z', status: 'active', proxyLoginEnabled: false, proxyLoginSessions: [], contractStartDate: '2024-01-31', contractEndDate: '2024-12-31',
      settings: { subscriptionType: 'basic', limits: { sites: 2, points: 1100, users: 4 }, usage: { sites: 2, points: 770, users: 3 } },
      sites: [{ id: 's114', name: '水素エネルギー', domain: 'hydrogen.kappa-clean.com', points: 450 }, { id: 's115', name: 'バッテリー技術', domain: 'battery.kappa-clean.com', points: 320 }],
      users: [{ id: 'u45', name: '木村環', email: 'kimura@kappa-clean.com', role: 'company-admin', status: 'active', credits: 650, lastLoginDate: '2024-02-26T11:40:00Z', createdDate: '2024-01-31T12:35:00Z', lastUpdatedDate: '2024-02-23T14:20:00Z' }]
    }]
  }
];

export const ClientManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'hierarchy' | 'table'>('table');
  const [selectedCompanyForEdit, setSelectedCompanyForEdit] = useState<Company | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isCompanyEditModalOpen, setIsCompanyEditModalOpen] = useState(false);
  const [isCompanySettingsModalOpen, setIsCompanySettingsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  
  // クライアントとカンパニーの状態管理
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [companies, setCompanies] = useState<Company[]>(() => 
    mockClients.flatMap(client => client.companies)
  );
  const [filters, setFilters] = useState<FilterState>({
    contractStatuses: [],
    subscriptionPlans: [],
    analyticsFeatures: [],
    contractDateRange: {
      startFrom: null,
      startTo: null,
      endFrom: null,
      endTo: null
    },
    loginDateRange: {
      from: null,
      to: null
    },
    usageLimits: {
      sites: { min: null, max: null },
      points: { min: null, max: null }
    }
  });
  
  // ソート状態の管理
  
  const [tableSortState, setTableSortState] = useState<TableSortState>({
    sortKey: 'lastLogin',
    sortDirection: 'desc'
  });
  
  const [isContractPeriodModalOpen, setIsContractPeriodModalOpen] = useState(false);
  const [selectedCompanyForContract, setSelectedCompanyForContract] = useState<Company | null>(null);
  const [isContractPlanModalOpen, setIsContractPlanModalOpen] = useState(false);
  const [selectedCompanyForPlan, setSelectedCompanyForPlan] = useState<Company | null>(null);


  const handleProxyLogin = (user: User) => {
    const confirmed = window.confirm(`${user.name} (${user.email}) としてログインしますか？`);
    if (confirmed) {
      // 実際の実装では、バックエンドAPIを呼び出してセッションを作成
      const sessionId = `proxy_${Date.now()}_${user.id}`;
      console.log(`代理ログイン実行: ${user.name}, セッションID: ${sessionId}`);
      alert(`${user.name} としてログインしました。\nセッションID: ${sessionId}`);
      // 実際の実装では、ダッシュボードにリダイレクト
    }
  };

  const handleCompanyProxyLogin = (company: Company) => {
    const confirmed = window.confirm(`${company.name} に代理ログインしますか？`);
    if (confirmed) {
      const sessionId = `proxy_company_${Date.now()}_${company.id}`;
      console.log(`代理ログイン実行: ${company.name}, セッションID: ${sessionId}`);
      alert(`${company.name} に代理ログインしました。`);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'chipper': return 'bg-purple-100 text-purple-800';
      case 'company-admin': return 'bg-green-100 text-green-800';
      case 'company-user': return 'bg-green-50 text-green-600';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'chipper': return 'Chipper社員';
      case 'company-admin': return '会社管理者';
      case 'company-user': return '会社ユーザー';
      default: return role;
    }
  };

  const getUsagePercentage = (used: number, limit: number) => {
    return Math.round((used / limit) * 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600 bg-red-50';
    if (percentage >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const getContractStatus = (company: Company): { text: string; color: string; bgColor: string } => {
    // 手動設定されたステータスがある場合はそれを優先
    if (company.contractStatus) {
      switch (company.contractStatus) {
        case 'active':
          return { text: '契約中', color: 'text-green-600', bgColor: 'bg-green-100' };
        case 'inactive':
          return { text: '契約終了', color: 'text-red-600', bgColor: 'bg-red-100' };
        case 'suspended':
          return { text: '停止中', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
      }
    }
    
    // ステータスが設定されていない場合は日付から判定
    const today = new Date().toISOString().split('T')[0];
    
    if (!company.contractStartDate && !company.contractEndDate) {
      return { text: '未設定', color: 'text-gray-600', bgColor: 'bg-gray-100' };
    }
    
    if (company.contractStartDate && !company.contractEndDate) {
      if (today < company.contractStartDate) {
        return { text: '契約開始前', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
      }
      return { text: '契約中', color: 'text-green-600', bgColor: 'bg-green-100' };
    }
    
    if (company.contractStartDate && company.contractEndDate) {
      if (today < company.contractStartDate) {
        return { text: '契約開始前', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
      }
      if (today > company.contractEndDate) {
        return { text: '契約終了', color: 'text-red-600', bgColor: 'bg-red-100' };
      }
      return { text: '契約中', color: 'text-green-600', bgColor: 'bg-green-100' };
    }
    
    return { text: '不明', color: 'text-gray-600', bgColor: 'bg-gray-100' };
  };

  const formatContractDate = (dateString: string | null): string => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}/${month}/${day}`;
  };

  const formatDateTime = (dateString: string | undefined): string => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}/${month}/${day} ${hours}:${minutes}`;
  };

  const downloadCSV = () => {
    const headers = [
      'クライアント名',
      'ステータス',
      'プラン',
      'サイト使用率',
      'ポイント使用率',
      '契約期間',
      '登録ユーザー名',
      'メールアドレス',
      'ロール',
      '最終ログイン日時',
      '作成日',
      '最終更新日'
    ];

    const rows: string[][] = [];
    
    processedClients.forEach(client => {
      // 各クライアントの主要な会社（最初の会社）の情報を使用
      const primaryCompany = client.companies[0];
      if (!primaryCompany) return;
      
      const contractStatus = getContractStatus(primaryCompany);
      const siteUsage = getUsagePercentage(primaryCompany.settings.usage.sites, primaryCompany.settings.limits.sites);
      const pointUsage = getUsagePercentage(primaryCompany.settings.usage.points, primaryCompany.settings.limits.points);
      
      // クライアントレベルでの集計値を計算
      const totalSites = client.companies.reduce((sum, company) => sum + company.settings.usage.sites, 0);
      const totalSiteLimit = client.companies.reduce((sum, company) => sum + company.settings.limits.sites, 0);
      const totalPoints = client.companies.reduce((sum, company) => sum + company.settings.usage.points, 0);
      const totalPointLimit = client.companies.reduce((sum, company) => sum + company.settings.limits.points, 0);
      
      const clientSiteUsage = getUsagePercentage(totalSites, totalSiteLimit);
      const clientPointUsage = getUsagePercentage(totalPoints, totalPointLimit);
      
      // 契約期間の表示
      const contractPeriod = `${formatContractDate(primaryCompany.contractStartDate)} - ${formatContractDate(primaryCompany.contractEndDate)}`;
      
      // 主要ユーザー（最初のユーザー）の情報
      const primaryUser = primaryCompany.users[0];
      if (!primaryUser) return;
      
      rows.push([
        client.name,
        contractStatus.text,
        primaryCompany.settings.subscriptionType,
        `${clientSiteUsage}%`,
        `${clientPointUsage}%`,
        contractPeriod,
        primaryUser.name,
        primaryUser.email,
        getRoleLabel(primaryUser.role),
        formatDateTime(primaryUser.lastLoginDate),
        formatDateTime(primaryUser.createdDate),
        formatDateTime(primaryUser.lastUpdatedDate)
      ]);
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `client_users_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // フィルタリングとソートロジック
  const processedClients = useMemo(() => {
    // companiesの更新をclientsに反映
    const updatedClients = clients.map(client => ({
      ...client,
      companies: client.companies.map(company => 
        companies.find(c => c.id === company.id) || company
      )
    }));
    
    let result = updatedClients;

    // クライアントレベルでのフィルタリング（集約データに基づく）
    result = result.filter(client => {
      // 契約ステータスフィルタ（クライアント内の少なくとも一つの会社が条件を満たす）
      if (filters.contractStatuses.length > 0) {
        const hasMatchingStatus = client.companies.some(company => {
          const contractStatus = getContractStatus(company);
          // 契約中、契約終了、停止中のいずれかにマッチするか確認
          if (filters.contractStatuses.includes('active') && contractStatus.text === '契約中') return true;
          if (filters.contractStatuses.includes('inactive') && contractStatus.text === '契約終了') return true;
          if (filters.contractStatuses.includes('suspended') && contractStatus.text === '停止中') return true;
          return false;
        });
        if (!hasMatchingStatus) return false;
      }

      // サブスクリプションプランフィルタ（クライアント内の少なくとも一つの会社が条件を満たす）
      if (filters.subscriptionPlans.length > 0) {
        const hasMatchingPlan = client.companies.some(company => 
          filters.subscriptionPlans.includes(company.settings.subscriptionType)
        );
        if (!hasMatchingPlan) return false;
      }

      // 分析機能フィルタ
      if (filters.analyticsFeatures.length > 0) {
        const hasMatchingAnalytics = client.companies.some(company => {
          const hasAnalytics = company.analyticsEnabled ?? true;
          const hasHeatmap = company.heatmapEnabled ?? false;
          
          if (filters.analyticsFeatures.includes('analytics') && !hasAnalytics) return false;
          if (filters.analyticsFeatures.includes('heatmap') && !hasHeatmap) return false;
          if (filters.analyticsFeatures.includes('none') && (hasAnalytics || hasHeatmap)) return false;
          
          return true;
        });
        if (!hasMatchingAnalytics) return false;
      }

      // 契約開始日フィルタ
      if (filters.contractDateRange.startFrom || filters.contractDateRange.startTo) {
        const hasMatchingStartDate = client.companies.some(company => {
          if (!company.contractStartDate) return false;
          const startDate = new Date(company.contractStartDate);
          
          if (filters.contractDateRange.startFrom && startDate < new Date(filters.contractDateRange.startFrom)) return false;
          if (filters.contractDateRange.startTo && startDate > new Date(filters.contractDateRange.startTo)) return false;
          
          return true;
        });
        if (!hasMatchingStartDate) return false;
      }

      // 契約終了日フィルタ
      if (filters.contractDateRange.endFrom || filters.contractDateRange.endTo) {
        const hasMatchingEndDate = client.companies.some(company => {
          if (!company.contractEndDate) return true; // 無期限契約は全ての条件にマッチ
          const endDate = new Date(company.contractEndDate);
          
          if (filters.contractDateRange.endFrom && endDate < new Date(filters.contractDateRange.endFrom)) return false;
          if (filters.contractDateRange.endTo && endDate > new Date(filters.contractDateRange.endTo)) return false;
          
          return true;
        });
        if (!hasMatchingEndDate) return false;
      }

      // 最終ログイン日フィルタ
      if (filters.loginDateRange.from || filters.loginDateRange.to) {
        const hasMatchingLoginDate = client.companies.some(company => {
          // 各会社のユーザーの最終ログイン日をチェック
          return company.users.some(user => {
            if (!user.lastLoginDate) return false;
            const loginDate = new Date(user.lastLoginDate);
            
            if (filters.loginDateRange.from && loginDate < new Date(filters.loginDateRange.from)) return false;
            if (filters.loginDateRange.to && loginDate > new Date(filters.loginDateRange.to)) return false;
            
            return true;
          });
        });
        if (!hasMatchingLoginDate) return false;
      }

      // 使用率フィルタ（クライアント全体の集約使用率で判定）
      const totalSites = client.companies.reduce((sum, company) => sum + company.settings.usage.sites, 0);
      const totalSiteLimit = client.companies.reduce((sum, company) => sum + company.settings.limits.sites, 0);
      const totalPoints = client.companies.reduce((sum, company) => sum + company.settings.usage.points, 0);
      const totalPointLimit = client.companies.reduce((sum, company) => sum + company.settings.limits.points, 0);
      
      const siteUsage = getUsagePercentage(totalSites, totalSiteLimit);
      const pointUsage = getUsagePercentage(totalPoints, totalPointLimit);

      if (filters.usageLimits.sites.min !== null && siteUsage < filters.usageLimits.sites.min) return false;
      if (filters.usageLimits.sites.max !== null && siteUsage > filters.usageLimits.sites.max) return false;
      if (filters.usageLimits.points.min !== null && pointUsage < filters.usageLimits.points.min) return false;
      if (filters.usageLimits.points.max !== null && pointUsage > filters.usageLimits.points.max) return false;

      return true;
    });

    // 検索フィルタ
    if (searchTerm) {
      result = result.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.companies.some(company =>
          company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          company.sites.some(site =>
            site.name.toLowerCase().includes(searchTerm.toLowerCase())
          ) ||
          company.users.some(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
          )
        )
      );
    }

    return result;
  }, [clients, companies, filters, searchTerm]);



  const renderTableView = () => {
    // companiesの更新をclientsに反映
    const updatedClients = clients.map(client => ({
      ...client,
      companies: client.companies.map(company => 
        companies.find(c => c.id === company.id) || company
      )
    }));
    
    // クライアント単位で統合したデータを作成
    const clientAggregatedData: Array<{
      clientId: string;
      clientName: string;
      clientType: string;
      totalSites: number;
      totalSitesLimit: number;
      totalPoints: number;
      totalPointsLimit: number;
      totalUsers: number;
      companies: Company[];
      latestLoginDate: string | undefined;
      earliestCreatedDate: string | undefined;
      latestUpdatedDate: string | undefined;
      primarySubscriptionType: string;
      overallStatus: string;
      contractStatus: string;
      contractColor: string;
      contractBgColor: string;
      contractStartDate: string | undefined;
      contractEndDate: string | undefined;
      analyticsEnabled: boolean;
      heatmapEnabled: boolean;
      totalCumulativePoints: number;
      totalCumulativeLimit: number;
    }> = [];

    processedClients.forEach(client => {
      // 検索条件でフィルタリング
      if (searchTerm && 
          !client.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !client.companies.some(company =>
            company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            company.sites.some(site =>
              site.name.toLowerCase().includes(searchTerm.toLowerCase())
            ) ||
            company.users.some(user =>
              user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              user.email.toLowerCase().includes(searchTerm.toLowerCase())
            )
          )) {
        return;
      }

      const totalSites = client.companies.reduce((sum, company) => sum + company.settings.usage.sites, 0);
      const totalSitesLimit = client.companies.reduce((sum, company) => sum + company.settings.limits.sites, 0);
      const totalPoints = client.companies.reduce((sum, company) => sum + company.settings.usage.points, 0);
      const totalPointsLimit = client.companies.reduce((sum, company) => sum + company.settings.limits.points, 0);
      const totalUsers = client.companies.reduce((sum, company) => sum + company.users.length, 0);
      
      // 累積ポイントの計算
      const calculateCumulativePoints = (company: Company) => {
        if (!company.contractStartDate) return { cumulative: 0, total: 0 };
        
        const startDate = new Date(company.contractStartDate);
        const now = new Date();
        const monthsDiff = Math.max(1, Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30)));
        
        // 累積使用ポイント（毎月の使用量×契約月数として概算）
        const cumulativeUsed = company.settings.cumulativePoints || (company.settings.usage.points * monthsDiff);
        // 累積総ポイント（月間限度×契約月数）
        const cumulativeTotal = company.settings.totalPoints || (company.settings.limits.points * monthsDiff);
        
        return { cumulative: cumulativeUsed, total: cumulativeTotal };
      };
      
      // クライアント全体の累積ポイントを計算
      const cumulativePointsData = client.companies.map(c => calculateCumulativePoints(c));
      const totalCumulativePoints = cumulativePointsData.reduce((sum, data) => sum + data.cumulative, 0);
      const totalCumulativeLimit = cumulativePointsData.reduce((sum, data) => sum + data.total, 0);

      // 最新ログイン日時を取得
      const allUsers = client.companies.flatMap(company => company.users);
      const latestLogin = allUsers
        .filter(u => u.lastLoginDate)
        .map(u => ({ ...u, date: new Date(u.lastLoginDate!) }))
        .sort((a, b) => b.date.getTime() - a.date.getTime())[0];

      // 最初の作成日を取得
      const earliestCreated = allUsers
        .filter(u => u.createdDate)
        .map(u => ({ ...u, date: new Date(u.createdDate!) }))
        .sort((a, b) => a.date.getTime() - b.date.getTime())[0];

      // 最新更新日を取得
      const latestUpdated = allUsers
        .filter(u => u.lastUpdatedDate)
        .map(u => ({ ...u, date: new Date(u.lastUpdatedDate!) }))
        .sort((a, b) => b.date.getTime() - a.date.getTime())[0];

      // 主要なサブスクリプションタイプ（最も高いプランを選択）
      const subscriptionOrder = { 'free': 1, 'basic': 2, 'premium': 3, 'enterprise': 4 };
      const primarySubscription = client.companies
        .map(c => c.settings.subscriptionType)
        .sort((a, b) => (subscriptionOrder[b] || 0) - (subscriptionOrder[a] || 0))[0];

      // 契約ステータスの集計（主要な会社の契約ステータスを使用）
      const primaryCompany = client.companies[0];
      const contractStatus = getContractStatus(primaryCompany);
      
      // 全体の契約ステータスを決定
      const allContractStatuses = client.companies.map(c => getContractStatus(c).text);
      const hasActive = allContractStatuses.includes('契約中');
      const hasInactive = allContractStatuses.includes('契約終了');
      const hasSuspended = allContractStatuses.includes('停止中');
      
      let overallContractStatus = contractStatus.text;
      let overallContractColor = contractStatus.color;
      let overallContractBgColor = contractStatus.bgColor;
      
      // 複数の異なるステータスがある場合は主要な会社のステータスを使用
      if (primaryCompany) {
        const status = getContractStatus(primaryCompany);
        overallContractStatus = status.text;
        overallContractColor = status.color;
        overallContractBgColor = status.bgColor;
      }

      clientAggregatedData.push({
        clientId: client.id,
        clientName: client.name,
        clientType: client.type,
        totalSites,
        totalSitesLimit,
        totalPoints,
        totalPointsLimit,
        totalUsers,
        companies: client.companies,
        latestLoginDate: latestLogin?.lastLoginDate,
        earliestCreatedDate: earliestCreated?.createdDate,
        latestUpdatedDate: latestUpdated?.lastUpdatedDate,
        primarySubscriptionType: primarySubscription,
        overallStatus: overallContractStatus,
        contractStatus: overallContractStatus,
        contractColor: overallContractColor,
        contractBgColor: overallContractBgColor,
        contractStartDate: primaryCompany?.contractStartDate,
        contractEndDate: primaryCompany?.contractEndDate,
        analyticsEnabled: primaryCompany?.analyticsEnabled ?? true, // デフォルトで有効
        heatmapEnabled: primaryCompany?.heatmapEnabled ?? (primaryCompany?.settings?.subscriptionType === 'enterprise' || primaryCompany?.settings?.subscriptionType === 'premium'), // premium以上でヒートマップ有効
        totalCumulativePoints,
        totalCumulativeLimit
      });
    });

    // ソート処理を追加（指定された列のみ）
    const sortedData = [...clientAggregatedData].sort((a, b) => {
      const { sortKey, sortDirection } = tableSortState;
      let aValue: any, bValue: any;
      
      switch (sortKey) {
        case 'siteUsage':
          aValue = a.totalSiteUsage || 0;
          bValue = b.totalSiteUsage || 0;
          break;
        case 'cumulativePointUsage':
          aValue = getUsagePercentage(a.totalCumulativePoints, a.totalCumulativeLimit) || 0;
          bValue = getUsagePercentage(b.totalCumulativePoints, b.totalCumulativeLimit) || 0;
          break;
        case 'contractStartDate':
          aValue = a.contractStartDate ? new Date(a.contractStartDate).getTime() : 0;
          bValue = b.contractStartDate ? new Date(b.contractStartDate).getTime() : 0;
          break;
        case 'contractEndDate':
          aValue = a.contractEndDate ? new Date(a.contractEndDate).getTime() : Number.MAX_SAFE_INTEGER; // 無期限は最後
          bValue = b.contractEndDate ? new Date(b.contractEndDate).getTime() : Number.MAX_SAFE_INTEGER;
          break;
        case 'lastLogin':
          aValue = a.latestLoginDate ? new Date(a.latestLoginDate).getTime() : 0;
          bValue = b.latestLoginDate ? new Date(b.latestLoginDate).getTime() : 0;
          break;
        default:
          return 0; // ソート対象外の列はソートしない
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    // ページネーション処理
    const totalItems = sortedData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = sortedData.slice(startIndex, endIndex);

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1800px] divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                クライアント名
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ステータス
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                プラン
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                サイト使用率
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ポイント使用率（累積）
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                契約開始日
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                契約終了日
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                分析機能
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                最終ログイン
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                アクション
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((client) => (
              <tr key={client.clientId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg mr-3">
                      <Building2 className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900">{client.clientName}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${client.contractColor} ${client.contractBgColor}`}>
                    {client.contractStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                    {client.primarySubscriptionType}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900">
                      {client.totalSites}/{client.totalSitesLimit}
                    </span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getUsageColor(getUsagePercentage(client.totalSites, client.totalSitesLimit))}`}>
                      {getUsagePercentage(client.totalSites, client.totalSitesLimit)}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900">
                      {client.totalCumulativePoints.toLocaleString()}/{client.totalCumulativeLimit.toLocaleString()}
                    </span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getUsageColor(getUsagePercentage(client.totalCumulativePoints, client.totalCumulativeLimit))}`}>
                      {getUsagePercentage(client.totalCumulativePoints, client.totalCumulativeLimit)}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {client.contractStartDate ? formatContractDate(client.contractStartDate) : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {client.contractEndDate ? formatContractDate(client.contractEndDate) : '無期限'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-1">
                    {client.analyticsEnabled && (
                      <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800" title="分析機能（ヒートマップ以外）">
                        分析
                      </span>
                    )}
                    {client.heatmapEnabled && (
                      <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800" title="ヒートマップ分析">
                        ヒートマップ
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {client.latestLoginDate ? formatDateTime(client.latestLoginDate) : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => {
                        console.log(`代理ログイン: ${client.clientName}`);
                      }}
                      className="px-2 py-1.5 rounded-lg text-xs font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700"
                      title="代理ログイン"
                    >
                      ログイン
                    </button>
                    <button
                      onClick={() => {
                        // クライアント名を会社データに設定
                        const companyWithClientName = {
                          ...client.companies[0],
                          name: client.clientName // クライアント名を使用
                        };
                        setSelectedCompanyForEdit(companyWithClientName);
                        setIsCompanyEditModalOpen(true);
                      }}
                      className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="クライアント情報編集"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        const companyWithClientName = {
                          ...client.companies[0],
                          name: client.clientName // クライアント名を使用
                        };
                        setSelectedCompanyForContract(companyWithClientName);
                        setIsContractPeriodModalOpen(true);
                      }}
                      className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="契約期間編集"
                    >
                      <Calendar className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        const companyWithClientName = {
                          ...client.companies[0],
                          name: client.clientName // クライアント名を使用
                        };
                        setSelectedCompanyForPlan(companyWithClientName);
                        setIsContractPlanModalOpen(true);
                      }}
                      className="p-1.5 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      title="契約プラン編集"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        
        {/* ページネーション */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                <span>全{totalItems}件中 </span>
                <span className="font-medium">{startIndex + 1}-{Math.min(endIndex, totalItems)}</span>
                <span>件を表示</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  前へ
                </button>
                
                {/* ページ番号ボタン */}
                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  次へ
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-blue-100 rounded-xl">
            <Building2 className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">クライアント管理</h1>
            <p className="text-gray-600 mt-1">クライアント・プロジェクトの統合管理</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="クライアント、会社、サイト、ユーザーを検索..."
              className="pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full shadow-sm"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // 検索時はページを1にリセット
              }}
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={downloadCSV}
              className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span className="font-medium">CSVダウンロード</span>
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          <FilterBar filters={filters} onFilterChange={(newFilters) => {
            setFilters(newFilters);
            setCurrentPage(1); // フィルター変更時はページを1にリセット
          }} />
          <SortBar
            viewMode="table"
            tableSortState={tableSortState}
            onTableSortChange={setTableSortState}
          />
        </div>
      </div>

      {/* テーブル表示 */}
      {renderTableView()}

      {isCompanyEditModalOpen && selectedCompanyForEdit && (
        <CompanyEditModal
          company={selectedCompanyForEdit}
          onClose={() => {
            setIsCompanyEditModalOpen(false);
            setSelectedCompanyForEdit(null);
          }}
          onSave={(updatedCompany) => {
            console.log('Updated company:', updatedCompany);
            // クライアント名とユーザー情報を更新
            setCompanies(prevCompanies => 
              prevCompanies.map(company => 
                company.id === selectedCompanyForEdit.id
                  ? {
                      ...company,
                      ...updatedCompany,
                      updatedAt: new Date().toISOString()
                    }
                  : company
              )
            );
            setIsCompanyEditModalOpen(false);
            setSelectedCompanyForEdit(null);
          }}
        />
      )}

      {isCompanySettingsModalOpen && selectedCompany && (
        <CompanySettingsModal
          company={selectedCompany}
          onClose={() => {
            setIsCompanySettingsModalOpen(false);
            setSelectedCompany(null);
          }}
          onSave={(updatedSettings) => {
            console.log('Updated settings:', updatedSettings);
            // 会社設定を更新
            setCompanies(prevCompanies => 
              prevCompanies.map(company => 
                company.id === selectedCompany.id
                  ? {
                      ...company,
                      settings: {
                        ...company.settings,
                        ...updatedSettings
                      },
                      updatedAt: new Date().toISOString()
                    }
                  : company
              )
            );
            setIsCompanySettingsModalOpen(false);
            setSelectedCompany(null);
          }}
        />
      )}

      {isContractPeriodModalOpen && selectedCompanyForContract && (
        <ContractPeriodModal
          companyId={selectedCompanyForContract.id}
          companyName={selectedCompanyForContract.name}
          currentPeriod={{
            startDate: selectedCompanyForContract.contractStartDate,
            endDate: selectedCompanyForContract.contractEndDate,
            status: selectedCompanyForContract.contractStatus
          }}
          currentStatus={selectedCompanyForContract.contractStatus || 'active'}
          onClose={() => {
            setIsContractPeriodModalOpen(false);
            setSelectedCompanyForContract(null);
          }}
          onSave={(period) => {
            console.log('Updated contract period:', period);
            // 契約期間とステータスを更新
            setCompanies(prevCompanies => 
              prevCompanies.map(company => 
                company.id === selectedCompanyForContract.id
                  ? {
                      ...company,
                      contractStartDate: period.startDate || undefined,
                      contractEndDate: period.endDate || undefined,
                      contractStatus: period.status,
                      updatedAt: new Date().toISOString()
                    }
                  : company
              )
            );
            setIsContractPeriodModalOpen(false);
            setSelectedCompanyForContract(null);
          }}
        />
      )}

      {isContractPlanModalOpen && selectedCompanyForPlan && (
        <ContractPlanModal
          company={selectedCompanyForPlan}
          onClose={() => {
            setIsContractPlanModalOpen(false);
            setSelectedCompanyForPlan(null);
          }}
          onSave={(planData) => {
            console.log('Updated contract plan:', planData);
            // 契約プランと分析機能設定を更新
            setCompanies(prevCompanies => 
              prevCompanies.map(company => 
                company.id === selectedCompanyForPlan.id
                  ? {
                      ...company,
                      settings: {
                        ...company.settings,
                        subscriptionType: planData.subscriptionType,
                        limits: {
                          ...company.settings.limits,
                          sites: planData.sitesLimit,
                          points: planData.additionalMonthlyPoints + 
                            (planData.subscriptionType === 'free' ? 500 :
                             planData.subscriptionType === 'basic' ? 1000 :
                             planData.subscriptionType === 'premium' ? 2000 : 5000)
                        }
                      },
                      analyticsEnabled: planData.analyticsEnabled,
                      heatmapEnabled: planData.heatmapEnabled,
                      updatedAt: new Date().toISOString()
                    }
                  : company
              )
            );
            setIsContractPlanModalOpen(false);
            setSelectedCompanyForPlan(null);
          }}
        />
      )}
    </div>
  );
};