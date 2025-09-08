import React, { useState } from 'react';
import { Site } from '../../types/settings';
import { Globe, Plus, Search, Edit, Trash2, ExternalLink, Calendar, BarChart3, Settings as SettingsIcon } from 'lucide-react';
import { SiteModal } from './SiteModal';

interface SiteManagementProps {
  // Props can be added here if needed
}

export const SiteManagement: React.FC<SiteManagementProps> = () => {
  const [sites, setSites] = useState<Site[]>([
    {
      id: '1',
      name: 'Creative Drive メインサイト',
      url: 'https://creativedrive.jp',
      excludeUrls: ['https://creativedrive.jp/admin', 'https://creativedrive.jp/test'],
      excludeCondition: 'contains',
      globalTag: '<script>console.log("Creative Drive tracking");</script>',
      gaPropertyId: 'GA-123456789-1',
      googleAnalyticsConnected: true,
      googleSearchConsoleConnected: true,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-20T15:30:00Z'
    },
    {
      id: '2',
      name: 'ブログサイト',
      url: 'https://blog.creativedrive.jp',
      excludeUrls: [],
      excludeCondition: 'equals',
      globalTag: '',
      gaPropertyId: 'GA-123456789-2',
      googleAnalyticsConnected: false,
      googleSearchConsoleConnected: true,
      createdAt: '2024-01-10T09:00:00Z',
      updatedAt: '2024-01-18T11:20:00Z'
    },
    {
      id: '3',
      name: 'ランディングページ',
      url: 'https://lp.creativedrive.jp',
      excludeUrls: ['https://lp.creativedrive.jp/preview'],
      excludeCondition: 'startsWith',
      globalTag: '<script>gtag("config", "GA-123456789-3");</script>',
      gaPropertyId: 'GA-123456789-3',
      googleAnalyticsConnected: true,
      googleSearchConsoleConnected: false,
      createdAt: '2024-01-12T14:00:00Z',
      updatedAt: '2024-01-19T16:45:00Z'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSite, setEditingSite] = useState<Site | null>(null);

  const filteredSites = sites.filter(site => 
    site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateSite = () => {
    setEditingSite(null);
    setIsModalOpen(true);
  };

  const handleEditSite = (site: Site) => {
    setEditingSite(site);
    setIsModalOpen(true);
  };

  const handleDeleteSite = (siteId: string) => {
    if (confirm('このサイトを削除してもよろしいですか？')) {
      setSites(prev => prev.filter(s => s.id !== siteId));
    }
  };

  const handleSaveSite = (siteData: Omit<Site, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingSite) {
      // 編集
      setSites(prev => prev.map(s => 
        s.id === editingSite.id 
          ? { ...s, ...siteData, updatedAt: new Date().toISOString() }
          : s
      ));
    } else {
      // 新規作成
      const newSite: Site = {
        ...siteData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setSites(prev => [...prev, newSite]);
    }
    setIsModalOpen(false);
    setEditingSite(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getConnectionStatus = (connected: boolean) => {
    return connected ? (
      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
        接続済み
      </span>
    ) : (
      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
        未接続
      </span>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* ページヘッダー */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">サイト管理</h1>
            <p className="text-sm text-gray-600 mt-1">サイト情報の登録・設定・分析ツール連携</p>
          </div>
          <button
            onClick={handleCreateSite}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus size={20} />
            サイトを追加
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* 検索バー */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="サイト名やURLで検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* サイト一覧 */}
        {filteredSites.length === 0 ? (
          <div className="text-center py-12">
            {searchTerm ? (
              <div>
                <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">検索結果が見つかりません</h3>
                <p className="text-gray-600">
                  「{searchTerm}」に一致するサイトがありません。
                </p>
              </div>
            ) : (
              <div>
                <Globe className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">サイトがまだありません</h3>
                <p className="text-gray-600 mb-6">
                  最初のサイトを追加して、分析とトラッキングを開始しましょう。
                </p>
                <button
                  onClick={handleCreateSite}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus size={20} />
                  サイトを追加
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredSites.map((site) => (
              <div
                key={site.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Globe className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {site.name}
                        </h3>
                        <a
                          href={site.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 truncate flex items-center gap-1"
                        >
                          {site.url}
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEditSite(site)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                        title="編集"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteSite(site.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                        title="削除"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    {/* 分析ツール接続状況 */}
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-2">分析ツール接続状況</p>
                      <div className="flex flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <BarChart3 size={14} className="text-gray-500" />
                          <span className="text-sm text-gray-700">Google Analytics:</span>
                          {getConnectionStatus(site.googleAnalyticsConnected)}
                        </div>
                        <div className="flex items-center gap-2">
                          <SettingsIcon size={14} className="text-gray-500" />
                          <span className="text-sm text-gray-700">Search Console:</span>
                          {getConnectionStatus(site.googleSearchConsoleConnected)}
                        </div>
                      </div>
                    </div>

                    {/* GA プロパティID */}
                    {site.gaPropertyId && (
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">GA プロパティID</p>
                        <p className="text-sm text-gray-700 font-mono bg-gray-50 px-2 py-1 rounded">
                          {site.gaPropertyId}
                        </p>
                      </div>
                    )}

                    {/* 除外URL */}
                    {site.excludeUrls.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">除外URL</p>
                        <p className="text-sm text-gray-700">
                          {site.excludeUrls.length}件の除外設定
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      <span>更新: {formatDate(site.updatedAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* モーダル */}
      {isModalOpen && (
        <SiteModal
          site={editingSite}
          onSave={handleSaveSite}
          onClose={() => {
            setIsModalOpen(false);
            setEditingSite(null);
          }}
        />
      )}
    </div>
  );
};