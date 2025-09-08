import React, { useState } from 'react';
import { ClientUser, Project } from '../../types/client';
import { X, Globe, Zap, Shield, Users, AlertTriangle } from 'lucide-react';

interface ContractInfoModalProps {
  user: ClientUser;
  project: Project;
  onSave: (projectId: string, limits: Project['limits']) => void;
  onClose: () => void;
}

export const ContractInfoModal: React.FC<ContractInfoModalProps> = ({ user, project, onSave, onClose }) => {
  const [limits, setLimits] = useState({
    sites: project.limits.sites,
    points: project.limits.points,
    domains: project.limits.domains,
    seats: project.limits.seats
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(project.id, limits);
  };

  const handleInputChange = (field: keyof typeof limits, value: number) => {
    setLimits(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">契約情報設定</h2>
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
            <div className="mb-3 text-sm">
              <p className="text-blue-700 font-medium">組織: {user.organizationName}</p>
              <p className="text-blue-700 font-medium">プロジェクト: {project.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-700 font-medium">サイト</span>
                <div className="text-blue-900">{project.usage.sites}/{project.limits.sites}</div>
              </div>
              <div>
                <span className="text-blue-700 font-medium">ポイント</span>
                <div className="text-blue-900">{project.usage.points}/{project.limits.points}</div>
              </div>
              <div>
                <span className="text-blue-700 font-medium">ドメイン</span>
                <div className="text-blue-900">{project.usage.domains}/{project.limits.domains}</div>
              </div>
              <div>
                <span className="text-blue-700 font-medium">シート</span>
                <div className="text-blue-900">{project.usage.seats}/{project.limits.seats}</div>
              </div>
            </div>
          </div>

          {/* サイト数上限 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              サイト数上限
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="number"
                value={limits.sites}
                onChange={(e) => handleInputChange('sites', parseInt(e.target.value) || 0)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">現在の使用量: {user.usage.sites}サイト</p>
            <p className="text-xs text-gray-500 mt-1">現在の使用量: {project.usage.sites}サイト</p>
          </div>

          {/* ポイント数設定 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ポイント数設定
            </label>
            <div className="relative">
              <Zap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="number"
                value={limits.points}
                onChange={(e) => handleInputChange('points', parseInt(e.target.value) || 0)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">現在の使用量: {user.usage.points}ポイント</p>
            <p className="text-xs text-gray-500 mt-1">現在の使用量: {project.usage.points}ポイント</p>
          </div>

          {/* 登録ドメイン数 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              登録ドメイン数
            </label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="number"
                value={limits.domains}
                onChange={(e) => handleInputChange('domains', parseInt(e.target.value) || 0)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">現在の使用量: {user.usage.domains}ドメイン</p>
            <p className="text-xs text-gray-500 mt-1">現在の使用量: {project.usage.domains}ドメイン</p>
          </div>

          {/* シート数上限 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              シート数上限
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="number"
                value={limits.seats}
                onChange={(e) => handleInputChange('seats', parseInt(e.target.value) || 0)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">現在の使用量: {user.usage.seats}シート</p>
            <p className="text-xs text-gray-500 mt-1">現在の使用量: {project.usage.seats}シート</p>
          </div>

          {/* 注意事項 */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800 mb-2">注意事項</h3>
                <ul className="text-xs text-yellow-700 space-y-1">
                  <li>• 上限値を現在の使用量より下げることはできません</li>
                  <li>• 変更は即座に反映されます</li>
                  <li>• 課金は月末に一括で処理されます</li>
                </ul>
              </div>
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