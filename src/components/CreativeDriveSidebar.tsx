import React, { useState } from 'react';
import {
  FileText,
  BarChart,
  Search,
  ChevronDown,
  ChevronRight,
  Plus,
  Sparkles,
  Hash,
  TrendingUp,
  Target
} from 'lucide-react';
import { Keyword } from '../types/keyword';

interface CreativeDriveSidebarProps {
  keywords: Keyword[];
  onKeywordSelect: (keyword: Keyword) => void;
  onCreateKeyword: () => void;
  onShowGenerateModal: () => void;
}

export const CreativeDriveSidebar: React.FC<CreativeDriveSidebarProps> = ({
  keywords,
  onKeywordSelect,
  onCreateKeyword,
  onShowGenerateModal
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['keyword-analysis']));
  const [expandedParentKws, setExpandedParentKws] = useState<Set<string>>(new Set());

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const toggleParentKw = (parentKw: string) => {
    const newExpanded = new Set(expandedParentKws);
    if (newExpanded.has(parentKw)) {
      newExpanded.delete(parentKw);
    } else {
      newExpanded.add(parentKw);
    }
    setExpandedParentKws(newExpanded);
  };

  // 親キーワードでグループ化
  const groupedKeywords = keywords.reduce((acc, kw) => {
    if (!acc[kw.parentKeyword]) {
      acc[kw.parentKeyword] = [];
    }
    acc[kw.parentKeyword].push(kw);
    return acc;
  }, {} as Record<string, Keyword[]>);

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* ヘッダー */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">CD</span>
          </div>
          <span className="font-semibold text-gray-900">Creative Drive</span>
        </div>
      </div>

      {/* メニュー */}
      <nav className="flex-1 overflow-y-auto py-2">
        {/* 記事分析 */}
        <div className="px-2 mb-1">
          <button
            onClick={() => toggleSection('article-analysis')}
            className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded"
          >
            {expandedSections.has('article-analysis') ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
            <FileText size={16} />
            <span>記事分析</span>
          </button>
        </div>

        {/* ダッシュボード */}
        <div className="px-2 mb-1">
          <button className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded">
            <div className="w-4" />
            <BarChart size={16} />
            <span>ダッシュボード</span>
          </button>
        </div>

        {/* キーワード分析 */}
        <div className="px-2 mb-1">
          <button
            onClick={() => toggleSection('keyword-analysis')}
            className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded"
          >
            {expandedSections.has('keyword-analysis') ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
            <Search size={16} />
            <span>キーワード分析</span>
          </button>

          {expandedSections.has('keyword-analysis') && (
            <div className="mt-1">
              {/* アクションボタン */}
              <div className="px-8 py-2 space-y-1">
                <button
                  onClick={onCreateKeyword}
                  className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-gray-600 hover:bg-gray-50 rounded"
                >
                  <Plus size={14} />
                  <span>新規キーワード</span>
                </button>
                <button
                  onClick={onShowGenerateModal}
                  className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-purple-600 hover:bg-purple-50 rounded"
                >
                  <Sparkles size={14} />
                  <span>AI生成</span>
                </button>
              </div>

              {/* キーワードリスト */}
              <div className="px-4 py-2 border-t border-gray-100">
                {Object.entries(groupedKeywords).length === 0 ? (
                  <p className="text-xs text-gray-400 px-4">キーワードがありません</p>
                ) : (
                  Object.entries(groupedKeywords).map(([parentKw, kwList]) => (
                    <div key={parentKw} className="mb-2">
                      <button
                        onClick={() => toggleParentKw(parentKw)}
                        className="w-full flex items-center gap-1 px-2 py-1 text-xs text-gray-700 hover:bg-gray-50 rounded"
                      >
                        {expandedParentKws.has(parentKw) ? (
                          <ChevronDown size={12} />
                        ) : (
                          <ChevronRight size={12} />
                        )}
                        <Hash size={12} className="text-gray-400" />
                        <span className="truncate">{parentKw}</span>
                        <span className="text-gray-400 ml-auto">({kwList.length})</span>
                      </button>

                      {expandedParentKws.has(parentKw) && (
                        <div className="ml-3 mt-1">
                          {kwList.map(keyword => (
                            <button
                              key={keyword.id}
                              onClick={() => onKeywordSelect(keyword)}
                              className="w-full flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50 rounded group"
                            >
                              {keyword.keywordType === '意思決定KW' && (
                                <Target size={10} className="text-red-500" />
                              )}
                              {keyword.keywordType === '比較KW' && (
                                <TrendingUp size={10} className="text-orange-500" />
                              )}
                              {keyword.keywordType === '関心KW' && (
                                <Search size={10} className="text-yellow-500" />
                              )}
                              {keyword.keywordType === '潜在KW' && (
                                <Hash size={10} className="text-blue-500" />
                              )}
                              <span className="truncate">{keyword.childKeyword.replace(keyword.parentKeyword + ' ', '')}</span>
                              {keyword.isArticleCreated && (
                                <span className="ml-auto w-1.5 h-1.5 bg-green-500 rounded-full" />
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* その他のメニュー項目 */}
        <div className="px-2 mb-1">
          <button className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded">
            <div className="w-4" />
            <FileText size={16} />
            <span>コンペティション分析</span>
          </button>
        </div>

        <div className="px-2 mb-1">
          <button className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded">
            <div className="w-4" />
            <FileText size={16} />
            <span>記事一覧</span>
          </button>
        </div>

        <div className="border-t border-gray-200 my-2" />

        {/* コンテンツ記事生成 */}
        <div className="px-2 mb-1">
          <button
            onClick={() => toggleSection('content-generation')}
            className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded"
          >
            {expandedSections.has('content-generation') ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
            <FileText size={16} />
            <span>コンテンツ記事生成</span>
          </button>
        </div>

        {/* その他のセクション */}
        <div className="px-2 mb-1">
          <button className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded">
            <div className="w-4" />
            <FileText size={16} />
            <span>システム記事生成</span>
          </button>
        </div>

        <div className="px-2 mb-1">
          <button className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded">
            <div className="w-4" />
            <FileText size={16} />
            <span>ワンショップ記事</span>
          </button>
        </div>

        <div className="border-t border-gray-200 my-2" />

        {/* 管理 */}
        <div className="px-2 mb-1">
          <button className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded">
            <div className="w-4" />
            <BarChart size={16} />
            <span>管理</span>
          </button>
        </div>

        {/* 情報収集フェーズ */}
        <div className="px-2 mb-1">
          <button className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded">
            <div className="w-4" />
            <Search size={16} />
            <span>情報収集フェーズ</span>
          </button>
        </div>

        {/* 評価検討フェーズ */}
        <div className="px-2 mb-1">
          <button className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded">
            <div className="w-4" />
            <TrendingUp size={16} />
            <span>評価検討フェーズ</span>
          </button>
        </div>

        {/* 導入検討フェーズ */}
        <div className="px-2 mb-1">
          <button className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded">
            <div className="w-4" />
            <Target size={16} />
            <span>導入検討フェーズ</span>
          </button>
        </div>

        <div className="border-t border-gray-200 my-2" />

        {/* 設定 */}
        <div className="px-2 mb-1">
          <button
            onClick={() => toggleSection('settings')}
            className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded"
          >
            {expandedSections.has('settings') ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
            <BarChart size={16} />
            <span>設定</span>
          </button>
        </div>
      </nav>
    </div>
  );
};