import React, { useState } from 'react';
import { Company } from '../../types/client';
import { X, Building2, Zap, Shield, Users, Globe } from 'lucide-react';

interface CompanySettingsModalProps {
  company: Company;
  onSave: (settings: Company['settings']) => void;
  onClose: () => void;
}

export const CompanySettingsModal: React.FC<CompanySettingsModalProps> = ({ company, onSave, onClose }) => {
  const [settings, setSettings] = useState({
    subscriptionType: company.settings.subscriptionType,
    limits: { ...company.settings.limits },
    usage: { ...company.settings.usage }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(settings);
  };

  const handleLimitChange = (field: keyof typeof settings.limits, value: number) => {
    setSettings(prev => ({
      ...prev,
      limits: { ...prev.limits, [field]: value }
    }));
  };

  const getUsagePercentage = (used: number, limit: number) => {
    return Math.round((used / limit) * 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600 bg-red-100';
    if (percentage >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Building2 className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">プラン・基礎情報設定</h2>
              <p className="text-sm text-gray-600">{company.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* フォーム */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 現在の利用状況 */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-900 mb-3">現在の利用状況</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {Object.entries(settings.limits).filter(([key]) => key !== 'domains').map(([key, limit]) => {
                const used = settings.usage[key as keyof typeof settings.usage];
                const percentage = getUsagePercentage(used, limit);
                const label = key === 'sites' ? 'サイト' : 
                             key === 'points' ? 'ポイント' :
                             'ユーザー';
                
                return (
                  <div key={key} className="text-center">
                    <div className="text-blue-700 font-medium">{label}</div>
                    <div className="text-blue-900 font-semibold">{used}/{limit}</div>
                    <div className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${getUsageColor(percentage)}`}>
                      {percentage}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* サブスクリプションタイプ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Shield className="inline w-4 h-4 mr-1" />
              サブスクリプションプラン
            </label>
            <select
              value={settings.subscriptionType}
              onChange={(e) => setSettings(prev => ({ ...prev, subscriptionType: e.target.value as Company['settings']['subscriptionType'] }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="free">Free - 無料プラン</option>
              <option value="basic">Basic - ベーシックプラン</option>
              <option value="premium">Premium - プレミアムプラン</option>
              <option value="enterprise">Enterprise - エンタープライズプラン</option>
            </select>
          </div>

          {/* 上限設定 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">リソース上限設定</h3>
            
            {/* サイト数上限 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Globe className="inline w-4 h-4 mr-1" />
                サイト数上限
              </label>
              <input
                type="number"
                value={settings.limits.sites}
                onChange={(e) => handleLimitChange('sites', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min={settings.usage.sites}
                required
              />
              <p className="text-xs text-gray-500 mt-1">現在の使用量: {settings.usage.sites}サイト</p>
            </div>

            {/* ポイント数設定 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Zap className="inline w-4 h-4 mr-1" />
                ポイント数上限（月間）
              </label>
              <input
                type="number"
                value={settings.limits.points}
                onChange={(e) => handleLimitChange('points', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min={settings.usage.points}
                placeholder="1000"
                required
              />
              <p className="text-xs text-gray-500 mt-1">現在の使用量: {settings.usage.points.toLocaleString()}ポイント</p>
              <p className="text-xs text-gray-400 mt-1">デフォルト: 1000ポイント/月</p>
            </div>

            {/* ユーザー数上限 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="inline w-4 h-4 mr-1" />
                ユーザー数上限
              </label>
              <input
                type="number"
                value={settings.limits.users}
                onChange={(e) => handleLimitChange('users', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min={settings.usage.users}
                required
              />
              <p className="text-xs text-gray-500 mt-1">現在の使用量: {settings.usage.users}ユーザー</p>
            </div>
          </div>

          {/* 会社情報 */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-2">会社情報</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p>会社名: {company.name}</p>
              <p>タイプ: {company.type === 'project' ? 'プロジェクト' : '会社'}</p>
              <p>作成日: {new Date(company.createdAt).toLocaleDateString('ja-JP')}</p>
              <p>最終更新: {new Date(company.updatedAt).toLocaleDateString('ja-JP')}</p>
              <p>ステータス: {company.status === 'active' ? 'アクティブ' : company.status}</p>
            </div>
          </div>

          {/* ボタン */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              設定を保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};