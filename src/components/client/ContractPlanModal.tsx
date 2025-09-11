import React, { useState } from 'react';
import { X, Settings, Globe, TrendingUp, BarChart3, Eye } from 'lucide-react';
import { Company } from '../../types/client';

interface ContractPlanModalProps {
  company: Company;
  onClose: () => void;
  onSave: (planData: {
    sitesLimit: number;
    subscriptionType: string;
    additionalMonthlyPoints: number;
    analyticsEnabled: boolean;
    heatmapEnabled: boolean;
    heatmapsLimit?: number;
  }) => void;
}

function getBasicPoints(subscriptionType: string): number {
  switch (subscriptionType) {
    case 'free': return 500;
    case 'basic': return 1000;
    case 'premium': return 2000;
    case 'enterprise': return 5000;
    default: return 1000;
  }
}

export const ContractPlanModal: React.FC<ContractPlanModalProps> = ({
  company,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState({
    sitesLimit: company.settings.limits.sites,
    subscriptionType: company.settings.subscriptionType,
    additionalMonthlyPoints: Math.max(0, company.settings.limits.points - getBasicPoints(company.settings.subscriptionType)), // 現在のポイント制限から基本ポイントを引いた値として計算
    analyticsEnabled: (company as any).analyticsEnabled ?? true, // 既存の設定を使用、なければデフォルトで有効
    heatmapEnabled: (company as any).heatmapEnabled ?? false, // 既存の設定を使用、なければデフォルトで無効
    heatmapsLimit: company.settings.limits.heatmaps || 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getTotalMonthlyPoints = (): number => {
    return getBasicPoints(formData.subscriptionType) + formData.additionalMonthlyPoints;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Settings className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">契約プラン編集</h2>
              <p className="text-sm text-gray-600">{company.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* フォーム */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 基本プラン設定 */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2 text-purple-600" />
              基本プラン設定
            </h3>
            
            <div className="space-y-4">
              {/* サイト数上限 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Globe className="w-4 h-4 inline mr-1" />
                  サイト数上限 <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.sitesLimit}
                  onChange={(e) => handleInputChange('sitesLimit', parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  placeholder="10"
                  min="1"
                  required
                />
              </div>

              {/* サブスクリプションタイプ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  サブスクリプションタイプ <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.subscriptionType}
                  onChange={(e) => handleInputChange('subscriptionType', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                >
                  <option value="free">Free (基本ポイント: 500)</option>
                  <option value="basic">Basic (基本ポイント: 1,000)</option>
                  <option value="premium">Premium (基本ポイント: 2,000)</option>
                  <option value="enterprise">Enterprise (基本ポイント: 5,000)</option>
                </select>
              </div>

              {/* 追加ポイント数 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <TrendingUp className="w-4 h-4 inline mr-1" />
                  追加ポイント数（月間）
                </label>
                <input
                  type="number"
                  value={formData.additionalMonthlyPoints}
                  onChange={(e) => handleInputChange('additionalMonthlyPoints', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  placeholder="0"
                  min="0"
                />
                <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>月間合計ポイント: {getTotalMonthlyPoints().toLocaleString()}ポイント</strong><br />
                    基本ポイント ({getBasicPoints(formData.subscriptionType).toLocaleString()}) + 追加ポイント ({formData.additionalMonthlyPoints.toLocaleString()})
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 分析機能設定 */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
              分析機能設定
            </h3>
            
            <div className="space-y-4">
              {/* 分析機能（ヒートマップ分析以外） */}
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">分析機能（ヒートマップ分析以外）</div>
                    <div className="text-xs text-gray-500">アクセス解析、コンバージョン分析、レポート機能など</div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.analyticsEnabled}
                    onChange={(e) => handleInputChange('analyticsEnabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* ヒートマップ分析 */}
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <Eye className="w-5 h-5 text-red-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">ヒートマップ分析</div>
                    <div className="text-xs text-gray-500">ユーザーの行動を可視化する高度な分析機能</div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.heatmapEnabled}
                    onChange={(e) => handleInputChange('heatmapEnabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>

              {/* ヒートマップ利用可能数 */}
              {formData.heatmapEnabled && (
                <div className="ml-8 p-4 bg-white rounded-lg border border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Eye className="w-4 h-4 inline mr-1 text-red-600" />
                    ヒートマップ利用可能数
                  </label>
                  <input
                    type="number"
                    value={formData.heatmapsLimit}
                    onChange={(e) => handleInputChange('heatmapsLimit', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="10"
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">ヒートマップを利用できる数を設定します</p>
                </div>
              )}
            </div>
          </div>

          {/* 現在の設定 */}
          <div className="bg-blue-50 p-6 rounded-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">現在の設定</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">サイト数: </span>
                <span className="font-medium">{company.settings.usage.sites}/{company.settings.limits.sites}</span>
              </div>
              <div>
                <span className="text-gray-600">ポイント: </span>
                <span className="font-medium">{company.settings.usage.points.toLocaleString()}/{company.settings.limits.points.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-600">プラン: </span>
                <span className="font-medium capitalize">{company.settings.subscriptionType}</span>
              </div>
            </div>
          </div>

          {/* ボタン */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium shadow-sm"
            >
              保存する
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};