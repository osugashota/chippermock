import React, { useState, useEffect } from 'react';
import { Company } from '../../types/client';
import { X, User, Mail, CreditCard } from 'lucide-react';

interface CompanyEditModalProps {
  company: Company;
  onSave: (companyData: Partial<Company>) => void;
  onClose: () => void;
}

export const CompanyEditModal: React.FC<CompanyEditModalProps> = ({ company, onSave, onClose }) => {
  // 最初のユーザーの情報を取得（存在する場合）
  const firstUser = company.users[0];
  const [firstName, lastName] = firstUser?.name.split(' ').reverse() || ['', ''];
  
  const [formData, setFormData] = useState({
    companyName: company.name,
    lastName: lastName || '',
    firstName: firstName || '',
    email: firstUser?.email || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // ユーザー情報と会社名を更新
    const updatedUsers = company.users.map((user, index) => {
      if (index === 0) {
        return {
          ...user,
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email
        };
      }
      return user;
    });

    onSave({
      name: formData.companyName,
      users: updatedUsers,
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
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">会社情報設定</h2>
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
          {/* ユーザー情報 */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-600" />
              ユーザー情報
            </h3>
            
            <div className="space-y-4">
              {/* クライアント名 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  クライアント名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="〇〇株式会社様"
                  required
                />
              </div>

              {/* 姓名 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    登録ユーザー名（姓） <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="田中"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    登録ユーザー名（名） <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="太郎"
                    required
                  />
                </div>
              </div>

              {/* メールアドレス */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  メールアドレス <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="example@company.com"
                  required
                />
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