import React from 'react';
import { Package, Users, User, Search, ChevronRight, Database } from 'lucide-react';

type MainView = 'products' | 'targets' | 'authors' | 'keywords';

interface SidebarProps {
  currentView: MainView;
  onViewChange: (view: MainView) => void;
  counts: {
    products: number;
    targets: number;
    authors: number;
    keywords: number;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, counts }) => {
  const menuItems = [
    {
      id: 'database' as const,
      label: 'データベース',
      icon: Database,
      isHeader: true
    },
    {
      id: 'products' as const,
      label: '商材管理',
      icon: Package,
      count: counts.products
    },
    {
      id: 'targets' as const,
      label: 'ターゲット管理',
      icon: Users,
      count: counts.targets
    },
    {
      id: 'authors' as const,
      label: '著者管理',
      icon: User,
      count: counts.authors
    },
    {
      id: 'divider' as const,
      isDivider: true
    },
    {
      id: 'keywords' as const,
      label: 'キーワード管理',
      icon: Search,
      count: counts.keywords
    }
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">Chipper Mock</h1>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        {menuItems.map((item, index) => {
          if (item.isDivider) {
            return <div key={index} className="my-2 border-t border-gray-200" />;
          }

          if (item.isHeader) {
            const Icon = item.icon;
            return (
              <div key={item.id} className="px-4 py-2 flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <Icon size={14} />
                {item.label}
              </div>
            );
          }

          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as MainView)}
              className={`w-full px-4 py-2 flex items-center justify-between group transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={18} className={isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'} />
                <span className="font-medium">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.count !== undefined && item.count > 0 && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {item.count}
                  </span>
                )}
                {isActive && <ChevronRight size={16} />}
              </div>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          <p>Version 1.0.0</p>
          <p className="mt-1">© 2024 Chipper</p>
        </div>
      </div>
    </div>
  );
};