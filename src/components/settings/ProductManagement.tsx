import React from 'react';
import { Package } from 'lucide-react';
import App from '../../App';

interface ProductManagementProps {
  // Props can be added here if needed
}

export const ProductManagement: React.FC<ProductManagementProps> = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* ページヘッダー */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">商材管理</h1>
            <p className="text-sm text-gray-600 mt-1">商材・ターゲット・著者情報の管理</p>
          </div>
        </div>
      </div>

      {/* 既存の商材管理システムを埋め込み */}
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <App />
        </div>
      </div>
    </div>
  );
};