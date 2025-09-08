import React, { useState, useMemo } from 'react';
import { Search, Users, Building2, Globe, Settings, Edit, Table, TrendingUp, Zap, Shield, Calendar, AlertCircle, CheckCircle, Download } from 'lucide-react';
import { CompanyEditModal } from './CompanyEditModal';
import { CompanySettingsModal } from './CompanySettingsModal';
import { ContractPeriodModal } from './ContractPeriodModal';
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
    name: 'デジタルマーケティング会社',
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
    name: 'ダイレクト株式会社',
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
    name: 'WEBコンサルティング株式会社',
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
    name: 'テクノロジー株式会社',
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
  }
];

export const ClientManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'hierarchy' | 'table'>('table');
  const [selectedCompanyForEdit, setSelectedCompanyForEdit] = useState<Company | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isCompanyEditModalOpen, setIsCompanyEditModalOpen] = useState(false);
  const [isCompanySettingsModalOpen, setIsCompanySettingsModalOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    clientTypes: [],
    companyStatuses: [],
    subscriptionPlans: [],
    proxyLogin: 'any',
    usageLimits: {
      sites: { min: null, max: null },
      points: { min: null, max: null }
    }
  });
  
  // ソート状態の管理
  
  const [tableSortState, setTableSortState] = useState<TableSortState>({
    sortKey: 'companyName',
    sortDirection: 'asc'
  });
  
  const [isContractPeriodModalOpen, setIsContractPeriodModalOpen] = useState(false);
  const [selectedCompanyForContract, setSelectedCompanyForContract] = useState<Company | null>(null);


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
    const today = new Date().toISOString().split('T')[0];
    
    if (!company.contractStartDate && !company.contractEndDate) {
      return { text: '未設定', color: 'text-gray-600', bgColor: 'bg-gray-100' };
    }
    
    if (company.contractStartDate && !company.contractEndDate) {
      if (today < company.contractStartDate) {
        return { text: '契約開始前', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
      }
      return { text: '契約中（無期限）', color: 'text-green-600', bgColor: 'bg-green-100' };
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
      '会社名',
      'クライアント名',
      'クライアント種別',
      'ユーザー名',
      'メールアドレス',
      'ロール',
      'ステータス',
      'クレジット残高',
      '最終ログイン日時',
      '作成日',
      '最終更新日',
      'サブスクリプションプラン',
      '契約開始日',
      '契約終了日',
      '契約ステータス',
      'サイト使用率(%)',
      'ポイント使用率(%)',
      '代理ログイン'
    ];

    const rows: string[][] = [];
    
    processedClients.forEach(client => {
      client.companies.forEach(company => {
        const contractStatus = getContractStatus(company);
        const siteUsage = getUsagePercentage(company.settings.usage.sites, company.settings.limits.sites);
        const pointUsage = getUsagePercentage(company.settings.usage.points, company.settings.limits.points);
        
        company.users.forEach(user => {
          rows.push([
            company.name,
            client.name,
            'ダイレクト',
            user.name,
            user.email,
            getRoleLabel(user.role),
            user.status,
            user.credits.toString(),
            formatDateTime(user.lastLoginDate),
            formatDateTime(user.createdDate),
            formatDateTime(user.lastUpdatedDate),
            company.settings.subscriptionType,
            formatContractDate(company.contractStartDate),
            formatContractDate(company.contractEndDate),
            contractStatus.text,
            siteUsage.toString(),
            pointUsage.toString(),
            company.proxyLoginEnabled ? '有効' : '無効'
          ]);
        });
      });
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
    let result = mockClients;

    // クライアント種別フィルタ
    if (filters.clientTypes.length > 0) {
      result = result.filter(client => filters.clientTypes.includes(client.type));
    }

    // 会社レベルのフィルタと検索を適用
    result = result.map(client => {
      let filteredCompanies = client.companies;

      // 会社ステータスフィルタ
      if (filters.companyStatuses.length > 0) {
        filteredCompanies = filteredCompanies.filter(company => 
          filters.companyStatuses.includes(company.status)
        );
      }

      // サブスクリプションプランフィルタ
      if (filters.subscriptionPlans.length > 0) {
        filteredCompanies = filteredCompanies.filter(company => 
          filters.subscriptionPlans.includes(company.settings.subscriptionType)
        );
      }

      // 代理ログインフィルタ
      if (filters.proxyLogin !== 'any') {
        filteredCompanies = filteredCompanies.filter(company => 
          filters.proxyLogin === 'enabled' ? company.proxyLoginEnabled : !company.proxyLoginEnabled
        );
      }

      // 使用率フィルタ
      filteredCompanies = filteredCompanies.filter(company => {
        const siteUsage = getUsagePercentage(company.settings.usage.sites, company.settings.limits.sites);
        const pointUsage = getUsagePercentage(company.settings.usage.points, company.settings.limits.points);

        if (filters.usageLimits.sites.min !== null && siteUsage < filters.usageLimits.sites.min) return false;
        if (filters.usageLimits.sites.max !== null && siteUsage > filters.usageLimits.sites.max) return false;
        if (filters.usageLimits.points.min !== null && pointUsage < filters.usageLimits.points.min) return false;
        if (filters.usageLimits.points.max !== null && pointUsage > filters.usageLimits.points.max) return false;

        return true;
      });

      return {
        ...client,
        companies: filteredCompanies
      };
    });

    // 空の会社を持つクライアントを除外
    result = result.filter(client => client.companies.length > 0);

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
  }, [mockClients, filters, searchTerm]);



  const renderTableView = () => {
    let allCompanies: (Company & { clientName: string; clientType: string })[] = [];
    
    processedClients.forEach(client => {
      client.companies.forEach(company => {
        // 検索条件でフィルタリング
        if (!searchTerm || 
            company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.name.toLowerCase().includes(searchTerm.toLowerCase())) {
          allCompanies.push({
            ...company,
            clientName: client.name,
            clientType: client.type
          });
        }
      });
    });

    // テーブル表示用のソートを適用
    allCompanies = sortTableCompanies(allCompanies, tableSortState.sortKey, tableSortState.sortDirection, getUsagePercentage);

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1600px] divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                会社名
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                クライアント
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                タイプ
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
                ポイント使用率
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                代理ログイン
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                最終ログイン
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                作成日
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                最終更新日
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                契約期間
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                アクション
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {allCompanies.map((company) => (
              <tr key={company.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg mr-3">
                      <Building2 className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900">{company.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {company.clientName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    直クライアント
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    company.status === 'active' ? 'bg-green-100 text-green-800' : 
                    company.status === 'inactive' ? 'bg-gray-100 text-gray-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {company.status === 'active' ? 'アクティブ' : 
                     company.status === 'inactive' ? '非アクティブ' : '停止中'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                    {company.settings.subscriptionType}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900">
                      {company.settings.usage.sites}/{company.settings.limits.sites}
                    </span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getUsageColor(getUsagePercentage(company.settings.usage.sites, company.settings.limits.sites))}`}>
                      {getUsagePercentage(company.settings.usage.sites, company.settings.limits.sites)}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900">
                      {company.settings.usage.points}/{company.settings.limits.points}
                    </span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getUsageColor(getUsagePercentage(company.settings.usage.points, company.settings.limits.points))}`}>
                      {getUsagePercentage(company.settings.usage.points, company.settings.limits.points)}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    company.proxyLoginEnabled ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {company.proxyLoginEnabled ? '有効' : '無効'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {(() => {
                    const latestLogin = company.users
                      .filter((u: any) => u.lastLoginDate)
                      .map((u: any) => ({ ...u, date: new Date(u.lastLoginDate) }))
                      .sort((a: any, b: any) => b.date.getTime() - a.date.getTime())[0];
                    return latestLogin ? formatDateTime(latestLogin.lastLoginDate) : '-';
                  })()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {(() => {
                    const earliestCreated = company.users
                      .filter((u: any) => u.createdDate)
                      .map((u: any) => ({ ...u, date: new Date(u.createdDate) }))
                      .sort((a: any, b: any) => a.date.getTime() - b.date.getTime())[0];
                    return earliestCreated ? formatDateTime(earliestCreated.createdDate) : '-';
                  })()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {(() => {
                    const latestUpdated = company.users
                      .filter((u: any) => u.lastUpdatedDate)
                      .map((u: any) => ({ ...u, date: new Date(u.lastUpdatedDate) }))
                      .sort((a: any, b: any) => b.date.getTime() - a.date.getTime())[0];
                    return latestUpdated ? formatDateTime(latestUpdated.lastUpdatedDate) : '-';
                  })()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-900">
                      {formatContractDate(company.contractStartDate)} 〜 {formatContractDate(company.contractEndDate)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getContractStatus(company).color} ${getContractStatus(company).bgColor}`}>
                      {getContractStatus(company).text}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => {
                        if (company.proxyLoginEnabled) {
                          // 代理ログイン処理をここに実装
                          console.log(`代理ログイン: ${company.name}`);
                        }
                      }}
                      disabled={!company.proxyLoginEnabled}
                      className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        company.proxyLoginEnabled
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                      title={company.proxyLoginEnabled ? '代理ログイン' : '代理ログイン無効'}
                    >
                      ログイン
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCompanyForEdit(company);
                        setIsCompanyEditModalOpen(true);
                      }}
                      className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="会社情報編集"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCompanyForContract(company);
                        setIsContractPeriodModalOpen(true);
                      }}
                      className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="契約期間編集"
                    >
                      <Calendar className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCompany(company);
                        setIsCompanySettingsModalOpen(true);
                      }}
                      className="p-1.5 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      title="設定"
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
              onChange={(e) => setSearchTerm(e.target.value)}
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
          <FilterBar filters={filters} onFilterChange={setFilters} />
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
            endDate: selectedCompanyForContract.contractEndDate
          }}
          onClose={() => {
            setIsContractPeriodModalOpen(false);
            setSelectedCompanyForContract(null);
          }}
          onSave={(period) => {
            console.log('Updated contract period:', period);
            // 実際の実装では、ここでAPIを呼び出して契約期間を更新
            setIsContractPeriodModalOpen(false);
            setSelectedCompanyForContract(null);
          }}
        />
      )}
    </div>
  );
};