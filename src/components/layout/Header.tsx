import React from 'react';
import { Bell, HelpCircle, User, Globe, ChevronDown } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 h-14">
      <div className="flex items-center justify-between h-full">
        {/* 左側：ロゴとページタイトル */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">CD</span>
            </div>
            <span className="font-semibold text-gray-900 text-lg">Creative Drive</span>
          </div>
        </div>

        {/* 右側：ユーティリティメニュー */}
        <div className="flex items-center gap-4">
          {/* 通知 */}
          <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors">
            <Bell size={18} />
          </button>

          {/* ヘルプ */}
          <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors">
            <HelpCircle size={18} />
          </button>

          {/* お問い合わせ */}
          <button className="text-sm text-gray-600 hover:text-gray-900 transition-colors px-2 py-1">
            お問い合わせ
          </button>

          {/* 言語選択 */}
          <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors px-2 py-1">
            <Globe size={14} />
            <span>日本語</span>
            <ChevronDown size={12} />
          </button>

          {/* アカウント */}
          <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors px-2 py-1">
            <User size={14} />
            <span>アカウント</span>
          </button>
        </div>
      </div>
    </header>
  );
};