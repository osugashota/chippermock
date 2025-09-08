import React, { useState, useEffect } from 'react';
import { ClientUser } from '../../types/client';
import { X, User, Mail, CreditCard, Shield } from 'lucide-react';

interface BasicInfoModalProps {
  user: ClientUser;
  onSave: (userData: Partial<ClientUser>) => void;
  onClose: () => void;
}

export const BasicInfoModal: React.FC<BasicInfoModalProps> = ({ user, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    lastName: user.lastName,
    firstName: user.firstName,
    email: user.email,
    creditBalance: user.creditBalance,
    subscriptionType: user.subscriptionType,
    role: user.role
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">基礎契約情報</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* フォーム */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* 姓名 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                姓
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="秋山"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                名
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="龍"
                required
              />
            </div>
          </div>

          {/* メールアドレス */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              メールアドレス
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="bol_ssh_ml@boc.bookoff.co.jp"
                required
              />
            </div>
          </div>

          {/* クレジット */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              クレジット
            </label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="number"
                value={formData.creditBalance}
                onChange={(e) => handleInputChange('creditBalance', parseInt(e.target.value) || 0)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="99999679"
              />
            </div>
          </div>

          {/* 契約プラン */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              契約プラン
            </label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <select
                value={formData.subscriptionType}
                onChange={(e) => handleInputChange('subscriptionType', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="free">Free</option>
                <option value="basic">Basic</option>
                <option value="premium">Premium</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
          </div>

          {/* 権限 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              権限
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <select
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="company-user">エンドユーザー(社員)</option>
                <option value="company-admin">エンドユーザー(管理者)</option>
                <option value="chipper">Chipper</option>
              </select>
            </div>
          </div>

          {/* 追加情報 */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-2">追加情報</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p>組織: {user.organizationName}</p>
              <p>プロジェクト: {user.projectName}</p>
              <p>会社名: {user.company}</p>
              <p>ニックネーム: {user.nickName}</p>
              <p>最終ログイン: {user.lastLogin}</p>
              <p>月間ログイン数: {user.monthlyLogins}回</p>
              <p>月間記事生成数: {user.monthlyArticles}件</p>
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
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};