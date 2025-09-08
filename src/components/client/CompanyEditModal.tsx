import React, { useState, useEffect } from 'react';
import { Company } from '../../types/client';
import { X, Building2, Mail, Globe, Calendar, Users } from 'lucide-react';

interface CompanyEditModalProps {
  company: Company;
  onSave: (companyData: Partial<Company>) => void;
  onClose: () => void;
}

export const CompanyEditModal: React.FC<CompanyEditModalProps> = ({ company, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: company.name,
    type: company.type,
    status: company.status,
    organizationId: company.organizationId || ''
  });


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      updatedAt: new Date().toISOString()
    });
  };

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">会社情報編集</h2>
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
          {/* 基本情報 */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Building2 className="w-5 h-5 mr-2 text-blue-600" />
              基本情報
            </h3>
            
            <div className="space-y-4">
              {/* 会社名 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  会社・プロジェクト名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="会社・プロジェクト名を入力"
                  required
                />
              </div>

              {/* タイプ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  タイプ <span className="text-red-500">*</span>
                </label>
                <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                  会社
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  すべて「会社」として管理されます
                </p>
              </div>

              {/* ステータス */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ステータス
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value as Company['status'])}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="active">アクティブ</option>
                  <option value="inactive">非アクティブ</option>
                  <option value="suspended">停止中</option>
                </select>
              </div>


            </div>
          </div>

          {/* 現在の利用状況 */}
          <div className="bg-blue-50 p-6 rounded-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-600" />
              現在の利用状況
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {company.settings.usage.sites}/{company.settings.limits.sites}
                </div>
                <div className="text-sm text-gray-600">サイト数</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600 mb-1">
                  {company.settings.usage.points.toLocaleString()}/{company.settings.limits.points.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">ポイント</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {company.settings.usage.users}/{company.settings.limits.users}
                </div>
                <div className="text-sm text-gray-600">ユーザー数</div>
              </div>
            </div>
          </div>

          {/* システム情報 */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-gray-600" />
              システム情報
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
              <div>
                <div className="font-medium text-gray-700 mb-1">作成日時</div>
                <div>{new Date(company.createdAt).toLocaleString('ja-JP')}</div>
              </div>
              
              <div>
                <div className="font-medium text-gray-700 mb-1">最終更新</div>
                <div>{new Date(company.updatedAt).toLocaleString('ja-JP')}</div>
              </div>
              
              <div>
                <div className="font-medium text-gray-700 mb-1">会社ID</div>
                <div className="font-mono text-xs bg-gray-200 px-2 py-1 rounded">{company.id}</div>
              </div>
              
              <div>
                <div className="font-medium text-gray-700 mb-1">タイプ</div>
                <div>会社</div>
              </div>
              
              <div>
                <div className="font-medium text-gray-700 mb-1">サブスクリプション</div>
                <div className="capitalize">{company.settings.subscriptionType}</div>
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
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
            >
              保存する
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};