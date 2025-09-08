import React, { useState, useEffect } from 'react';
import { Site } from '../../types/settings';
import { X, Globe, Link, Code, BarChart3, Plus, Minus } from 'lucide-react';

interface SiteModalProps {
  site: Site | null;
  onSave: (siteData: Omit<Site, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onClose: () => void;
}

export const SiteModal: React.FC<SiteModalProps> = ({ site, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    excludeUrls: [''],
    excludeCondition: 'contains' as Site['excludeCondition'],
    globalTag: '',
    gaPropertyId: '',
    googleAnalyticsConnected: false,
    googleSearchConsoleConnected: false
  });

  useEffect(() => {
    if (site) {
      setFormData({
        name: site.name,
        url: site.url,
        excludeUrls: site.excludeUrls.length > 0 ? site.excludeUrls : [''],
        excludeCondition: site.excludeCondition,
        globalTag: site.globalTag,
        gaPropertyId: site.gaPropertyId,
        googleAnalyticsConnected: site.googleAnalyticsConnected,
        googleSearchConsoleConnected: site.googleSearchConsoleConnected
      });
    }
  }, [site]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      excludeUrls: formData.excludeUrls.filter(url => url.trim() !== '')
    });
  };

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleExcludeUrlAdd = () => {
    setFormData(prev => ({
      ...prev,
      excludeUrls: [...prev.excludeUrls, '']
    }));
  };

  const handleExcludeUrlRemove = (index: number) => {
    setFormData(prev => ({
      ...prev,
      excludeUrls: prev.excludeUrls.filter((_, i) => i !== index)
    }));
  };

  const handleExcludeUrlChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      excludeUrls: prev.excludeUrls.map((url, i) => i === index ? value : url)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {site ? 'サイト編集' : 'サイト情報の追加登録'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* フォーム */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* サイト名 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              サイト名 <span className="text-red-500">必須</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="サイト名を入力"
              required
            />
          </div>

          {/* サイトURL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              サイトURL <span className="text-red-500">必須</span>
            </label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => handleInputChange('url', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="https://example.com"
              required
            />
          </div>

          {/* 除外するURLの条件設定 */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-3">除外するURLの条件設定</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                比較条件
              </label>
              <select
                value={formData.excludeCondition}
                onChange={(e) => handleInputChange('excludeCondition', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="contains">次を含まない</option>
                <option value="equals">次と等しくない</option>
                <option value="startsWith">次で始まらない</option>
                <option value="endsWith">次で終わらない</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                値
              </label>
              {formData.excludeUrls.map((url, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => handleExcludeUrlChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="除外するURL"
                  />
                  <button
                    type="button"
                    onClick={() => handleExcludeUrlRemove(index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                  >
                    <Minus size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleExcludeUrlAdd}
                className="flex items-center gap-2 px-3 py-2 text-green-600 hover:bg-green-50 rounded-md text-sm"
              >
                <Plus size={16} />
                条件を追加する
              </button>
            </div>
          </div>

          {/* グローバルタグの設定 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              グローバルタグの設定 <span className="text-red-500">必須</span>
            </label>
            <p className="text-sm text-gray-600 mb-2">
              計測するページ内の&lt;head&gt;から&lt;/head&gt;の間にペーストしてください。
            </p>
            <textarea
              value={formData.globalTag}
              onChange={(e) => handleInputChange('globalTag', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 font-mono text-sm"
              placeholder="サイト登録後ここにタグが発行されます"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              グローバルタグの設定を確認する
            </p>
          </div>

          {/* GA用プロパティID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              GA用プロパティID <span className="text-red-500">必須</span>
            </label>
            <p className="text-sm text-gray-600 mb-2">
              プロパティIDの取得方法は<a href="#" className="text-blue-600 hover:underline">こちら</a>
            </p>
            <input
              type="text"
              value={formData.gaPropertyId}
              onChange={(e) => handleInputChange('gaPropertyId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="GA-XXXXXXXXX-X"
              required
            />
          </div>

          {/* Google Analytics連携 */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Google Analyticsと連携 <span className="text-red-500">必須</span></h3>
            <button
              type="button"
              onClick={() => handleInputChange('googleAnalyticsConnected', !formData.googleAnalyticsConnected)}
              className={`w-full px-4 py-2 rounded-md border transition-colors ${
                formData.googleAnalyticsConnected
                  ? 'bg-green-50 border-green-200 text-green-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {formData.googleAnalyticsConnected ? '✓ 連携済み' : 'Google Analyticsと連携する'}
            </button>
          </div>

          {/* Google Search Console連携 */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Google Search Consoleと連携 <span className="text-red-500">必須</span></h3>
            <button
              type="button"
              onClick={() => handleInputChange('googleSearchConsoleConnected', !formData.googleSearchConsoleConnected)}
              className={`w-full px-4 py-2 rounded-md border transition-colors ${
                formData.googleSearchConsoleConnected
                  ? 'bg-green-50 border-green-200 text-green-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {formData.googleSearchConsoleConnected ? '✓ 連携済み' : 'Google Search Consoleと連携する'}
            </button>
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
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              {site ? '更新する' : '確認する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};