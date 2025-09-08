import React from 'react';
import { 
  BarChart3, 
  FileText, 
  Users, 
  Globe,
  Package,
  Target, 
  TrendingUp, 
  Search, 
  Settings,
  ChevronDown,
  ChevronRight,
  Database
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const [expandedSections, setExpandedSections] = React.useState<string[]>(['analysis', 'content']);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const menuItems = [
    {
      id: 'analysis',
      title: '記事分析',
      icon: BarChart3,
      items: [
        { id: 'dashboard', title: 'ダッシュボード', icon: BarChart3 },
        { id: 'keyword-analysis', title: 'キーワード分析', icon: Search },
        { id: 'competition-analysis', title: 'コンペティション分析', icon: Target },
        { id: 'performance', title: '記事一覧', icon: FileText }
      ]
    },
    {
      id: 'content',
      title: 'コンテンツ記事生成',
      icon: FileText,
      items: [
        { id: 'system-prompt', title: 'システム記事生成', icon: Database },
        { id: 'workshop', title: 'ワンショップ記事', icon: FileText }
      ]
    },
    {
      id: 'management',
      title: '管理',
      icon: Settings,
      items: [
        { id: 'product-management', title: '商材管理', icon: Database }
      ]
    },
    {
      id: 'custom-phase',
      title: '情報収集フェーズ',
      icon: Search,
      items: [
        { id: 'custom-collection-1', title: 'コラム記事 カスタム記事生成', icon: FileText },
        { id: 'custom-collection-2', title: 'コラム記事 ワンステップ記事生成', icon: FileText },
        { id: 'custom-system-1', title: 'ハウツー記事 カスタム記事生成', icon: FileText },
        { id: 'custom-system-2', title: 'ハウツー記事 ワンステップ記事生成', icon: FileText }
      ]
    },
    {
      id: 'consideration-phase',
      title: '評価検討フェーズ',
      icon: TrendingUp,
      items: [
        { id: 'list-article-1', title: 'リスト記事 カスタム記事生成', icon: FileText },
        { id: 'list-article-2', title: 'リスト記事 ワンステップ記事生成', icon: FileText },
        { id: 'comparison-system-1', title: '比較記事 カスタム記事生成', icon: FileText },
        { id: 'comparison-system-2', title: '比較記事 ワンステップ記事生成', icon: FileText }
      ]
    },
    {
      id: 'action-phase',
      title: '導入検討フェーズ',
      icon: Target,
      items: [
        { id: 'intro-system-1', title: '比較記事 カスタム記事生成', icon: FileText },
        { id: 'intro-system-2', title: '比較記事 ワンステップ記事生成', icon: FileText },
        { id: 'review-system-1', title: 'レビュー記事 カスタム記事生成', icon: FileText },
        { id: 'review-system-2', title: 'レビュー記事 ワンステップ記事生成', icon: FileText }
      ]
    }
  ] as const;

  const isExpanded = (sectionId: string) => expandedSections.includes(sectionId);

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen overflow-y-auto">
      {/* サイドバーヘッダー */}
      <div className="p-4 border-b border-gray-200 h-14 flex items-center">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-xs">CD</span>
          </div>
          <span className="font-semibold text-gray-900">Creative Drive</span>
        </div>
      </div>

      {/* メニュー項目 */}
      <nav className="p-2">
        {menuItems.map((section) => {
          const SectionIcon = section.icon;
          const expanded = isExpanded(section.id);
          
          return (
            <div key={section.id} className="mb-1">
              {/* セクションヘッダー */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
              >
                <SectionIcon size={16} className="text-blue-600" />
                <span className="flex-1 text-left">{section.title}</span>
                {expanded ? (
                  <ChevronDown size={14} className="text-gray-400" />
                ) : (
                  <ChevronRight size={14} className="text-gray-400" />
                )}
              </button>

              {/* サブメニュー */}
              {expanded && (
                <div className="ml-6 mt-1 space-y-1">
                  {section.items.map((item) => {
                    const ItemIcon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => onViewChange(item.id)}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
                          currentView === item.id
                            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <ItemIcon size={14} />
                        <span className="text-left">{item.title}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* 設定セクション */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={() => onViewChange('settings')}
            className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
              currentView === 'settings' || currentView.startsWith('settings-')
                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <Settings size={16} />
            <span>設定</span>
          </button>
          
          {/* 設定サブメニュー */}
          {(currentView === 'settings' || currentView.startsWith('settings-')) && (
            <div className="ml-4 mt-2 space-y-1">
              <button
                onClick={() => onViewChange('settings-sites')}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
                  currentView === 'settings-sites'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Globe size={14} />
                <span>サイト管理</span>
              </button>
              <button
                onClick={() => onViewChange('settings-clients')}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
                  currentView === 'settings-clients'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Users size={14} />
                <span>クライアント管理</span>
              </button>
              <button
                onClick={() => onViewChange('settings-products')}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
                  currentView === 'settings-products'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Package size={14} />
                <span>商材管理</span>
              </button>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};