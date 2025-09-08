import React from 'react';
import { Settings, Users, Globe, Package } from 'lucide-react';

interface SettingsLayoutProps {
  onNavigate: (view: string) => void;
}

export const SettingsLayout: React.FC<SettingsLayoutProps> = ({ onNavigate }) => {
  const settingsMenuItems = [
    {
      title: 'サイト管理',
      description: 'サイト情報の登録・設定・分析ツール連携',
      icon: Globe,
      color: 'green',
      view: 'settings-sites'
    },
    {
      title: 'クライアント管理',
      description: '代理ログイン・会社管理・プラン制御',
      icon: Users,
      color: 'indigo',
      view: 'settings-clients'
    },
    {
      title: '商材管理',
      description: '商材・ターゲット・著者情報の管理',
      icon: Package,
      color: 'purple',
      view: 'settings-products'
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* ページヘッダー */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">設定</h1>
            <p className="text-sm text-gray-600 mt-1">システムの各種設定を管理できます</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <Settings className="w-8 h-8 text-gray-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Creative Drive 設定</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            システムの各種設定を管理できます。下記のメニューから設定したい項目を選択してください。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {settingsMenuItems.map((item, index) => {
            const Icon = item.icon;
            const colorClasses = {
              green: 'bg-green-50 text-green-600 group-hover:bg-green-100',
              indigo: 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100',
              purple: 'bg-purple-50 text-purple-600 group-hover:bg-purple-100'
            };

            return (
              <button
                key={index}
                onClick={() => onNavigate(item.view)}
                className="group bg-white p-6 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all text-left w-full"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 transition-colors ${colorClasses[item.color as keyof typeof colorClasses]}`}>
                  <Icon size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-gray-700">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};